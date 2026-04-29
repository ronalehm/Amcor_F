import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { useLayout } from "../../../components/layout/LayoutContext";
import {
  createUser,
  getNextUserCode,
  ROLE_LABELS,
  findDuplicateUser,
  getCurrentUser,
  activateUser,
  unblockUser,
  type UserRole,
} from "../../../shared/data/userStorage";
import { registerUserStatusChange } from "../../../shared/data/userStatusStorage";
import { mockSendEmail } from "../../../shared/data/notificationStorage";
import { type VendorMirror } from "../../../shared/data/vendorMirrorStorage";

import FormCard from "../../../shared/components/forms/FormCard";
import FormInput from "../../../shared/components/forms/FormInput";
import FormSelect from "../../../shared/components/forms/FormSelect";
import FormActionButtons from "../../../shared/components/forms/FormActionButtons";
import SystemIntegrationUserSearch from "../../../shared/components/forms/SystemIntegrationUserSearch";
import UserDuplicateHandler from "../../../shared/components/forms/UserDuplicateHandler";

const AREAS = ["Comercial", "Artes Gráficas", "R&D", "Commercial Finance", "Administración", "TI"];
const VALID_ROLES = Object.keys(ROLE_LABELS) as UserRole[];

interface FormState {
  siUser: VendorMirror | null;
  email: string;
  firstName: string;
  lastName: string;
  workerCode: string;
  position: string;
  company: string;
  area: string;
  role: UserRole;
  phone: string;
}

export default function UserCreatePage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const [userCode] = useState(getNextUserCode());

  const [form, setForm] = useState<FormState>({
    siUser: null,
    email: "",
    firstName: "",
    lastName: "",
    workerCode: "",
    position: "",
    company: "",
    area: "",
    role: "viewer",
    phone: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [duplicateUser, setDuplicateUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [hasNoSiResults, setHasNoSiResults] = useState(false);
  const [creationMode, setCreationMode] = useState<"manual" | "excel" | null>(null);
  const [isExcelImported, setIsExcelImported] = useState(false);
  const [excelError, setExcelError] = useState<string | null>(null);
  const [excelWarning, setExcelWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = getCurrentUser();

  useEffect(() => {
    setHeader({
      title: "Crear Nuevo Usuario",
      breadcrumbs: [
        { label: "Usuarios", href: "/users" },
        { label: "Crear Usuario" },
      ],
      badges: (
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          ID: {userCode}
        </span>
      ),
    });
    return () => resetHeader();
  }, [setHeader, resetHeader, userCode]);

  const updateField = <K extends keyof FormState>(field: K, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSiUserSelect = (vendor: VendorMirror) => {
    setForm((prev) => ({
      ...prev,
      siUser: vendor,
      workerCode: vendor.code,
      email: vendor.email || "",
      firstName: vendor.name.split(" ")[0],
      lastName: vendor.name.split(" ").slice(1).join(" ") || "",
      position: `Ejecutivo ${vendor.area}`,
      area: vendor.area,
      company: "Amcor",
    }));
    setSearchQuery("");
    setCreationMode(null);
    setIsExcelImported(false);
    setExcelError(null);
    setExcelWarning(null);
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        codigoTrabajador: "",
        nombre: "",
        apellido: "",
        correoCorporativo: "",
        puesto: "",
        empresa: "",
        area: "",
        telefono: "",
        rolPortalOdiseo: "",
      },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PlantillaUsuario");
    XLSX.writeFile(wb, "Plantilla_Creacion_Usuario.xlsx");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelError(null);
    setExcelWarning(null);

    // Validate file extension
    const validExtensions = [".xlsx", ".xls"];
    const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setExcelError("Formato de archivo no válido. Solo se permiten archivos .xlsx o .xls.");
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setExcelError("Error al leer el archivo. Intente con otro archivo o verifique que no esté corrupto.");
    };
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        if (!data) {
          setExcelError("No se pudo leer el contenido del archivo.");
          return;
        }
        const wb = XLSX.read(data, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rows = XLSX.utils.sheet_to_json<any>(ws);

        if (rows.length === 0) {
          setExcelError("El archivo no contiene datos para importar.");
          return;
        }

        if (rows.length > 1) {
          setExcelError(
            "La plantilla contiene más de un usuario. Para este flujo solo se permite registrar un usuario por vez."
          );
          return;
        }

        const row = rows[0];

        const expectedColumns = [
          "codigoTrabajador",
          "nombre",
          "apellido",
          "correoCorporativo",
          "puesto",
          "empresa",
          "area",
        ];

        const headerData = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });
        const headers = headerData.length > 0 ? headerData[0] : [];
        const missingCols = expectedColumns.filter(c => !headers.includes(c));
        if (missingCols.length > 0) {
          setExcelError("La plantilla no tiene la estructura requerida. Descargue la plantilla oficial.");
          return;
        }

        const workerCode = (row.codigoTrabajador || "").toString().trim();
        const email = (row.correoCorporativo || "").toString().trim();

        if (!workerCode) {
          setExcelError("El código de trabajador es obligatorio.");
          // Still autocomplete what we can so user can fix other fields
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setExcelWarning("El correo corporativo importado no tiene un formato válido.");
        }

        let importedArea = (row.area || "").toString().trim();
        let finalArea = "";
        if (importedArea) {
          const areaMatch = AREAS.find(a => a.toLowerCase() === importedArea.toLowerCase());
          if (areaMatch) {
            finalArea = areaMatch;
          } else {
            setExcelWarning("El área importada no existe en el catálogo. Seleccione un área válida.");
          }
        }

        const importedRole = (row.rolPortalOdiseo || "").toString().trim().toLowerCase();
        const matchedRole = importedRole
          ? VALID_ROLES.find(r => r.toLowerCase() === importedRole || ROLE_LABELS[r].toLowerCase() === importedRole)
          : undefined;

        setForm(prev => ({
          ...prev,
          siUser: null,
          workerCode: workerCode,
          email: email,
          firstName: (row.nombre || "").toString().trim(),
          lastName: (row.apellido || "").toString().trim(),
          position: (row.puesto || "").toString().trim(),
          company: (row.empresa || "").toString().trim(),
          area: finalArea,
          phone: (row.telefono || "").toString().trim(),
          role: matchedRole || prev.role,
        }));

        setIsExcelImported(true);

      } catch (error) {
        setExcelError("Error al procesar el archivo Excel. Asegúrese de que el formato sea correcto.");
      }
    };
    reader.readAsArrayBuffer(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isSiUserSelected = form.siUser !== null;

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (!form.workerCode.trim()) {
      errors.workerCode = "El código de trabajador es obligatorio";
    }

    if (!form.email.trim()) {
      errors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "El formato del correo no es válido";
    }

    if (!form.firstName.trim()) {
      errors.firstName = "El nombre es obligatorio";
    }

    if (!form.lastName.trim()) {
      errors.lastName = "El apellido es obligatorio";
    }

    if (!form.position.trim()) {
      errors.position = "El puesto es obligatorio";
    }

    if (!form.company.trim()) {
      errors.company = "La empresa es obligatoria";
    }

    if (!form.area) {
      errors.area = "El área es obligatoria";
    }

    if (!form.role) {
      errors.role = "El rol es obligatorio";
    }

    return errors;
  }, [form]);

  const completionPercentage = useMemo(() => {
    const requiredChecks = [
      Boolean(form.workerCode.trim()),
      Boolean(form.email.trim()),
      Boolean(form.firstName.trim()),
      Boolean(form.lastName.trim()),
      Boolean(form.position.trim()),
      Boolean(form.company.trim()),
      Boolean(form.area),
      Boolean(form.role),
    ];
    const completed = requiredChecks.filter(Boolean).length;
    return Math.round((completed / requiredChecks.length) * 100);
  }, [form]);

  const handleResendActivation = async () => {
    if (!duplicateUser) return;
    setLoading(true);

    try {
      mockSendEmail(
        duplicateUser.email,
        "Reenvío de Activación - ODISEO",
        `Hola ${duplicateUser.firstName},\n\nTe reenviamos el correo de activación de tu cuenta en ODISEO.\n\nEquipo ODISEO`,
        duplicateUser.id,
        "activation"
      );

      setSuccessMessage("Correo de activación reenviado correctamente.");
      setTimeout(() => navigate("/users"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateUser = async () => {
    if (!duplicateUser) return;

    const confirmed = window.confirm(
      `¿Reactivar usuario ${duplicateUser.firstName} ${duplicateUser.lastName}?`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      // Cambiar estado a pending_activation

      registerUserStatusChange(
        duplicateUser.id,
        duplicateUser.status,
        "pending_activation",
        currentUser?.id || "system",
        "Usuario reactivado desde formulario de creación"
      );

      mockSendEmail(
        duplicateUser.email,
        "Reactivación de Cuenta - ODISEO",
        `Hola ${duplicateUser.firstName},\n\nTu cuenta ha sido reactivada. Por favor completa el proceso de activación.\n\nEquipo ODISEO`,
        duplicateUser.id,
        "reactivation"
      );

      setSuccessMessage("Usuario reactivado correctamente. Se envió correo de activación.");
      setTimeout(() => navigate("/users"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockUser = async () => {
    if (!duplicateUser) return;

    const confirmed = window.confirm(
      `¿Desbloquear usuario ${duplicateUser.firstName} ${duplicateUser.lastName}?`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      unblockUser(duplicateUser.id);

      registerUserStatusChange(
        duplicateUser.id,
        "blocked",
        "active",
        currentUser?.id || "system",
        "Usuario desbloqueado desde formulario de creación"
      );

      setSuccessMessage("Usuario desbloqueado correctamente.");
      setTimeout(() => navigate("/users"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSuccessMessage(null);

    if (Object.keys(validationErrors).length > 0 || excelError) return;

    setLoading(true);
    try {
      // Validar duplicidad
      const duplicate = findDuplicateUser(form.email, form.workerCode);
      if (duplicate) {
        setDuplicateUser(duplicate);
        return;
      }

      // Crear usuario
      const tempPassword = Math.random().toString(36).substring(2, 10);

      const newUser = createUser({
        email: form.email,
        password: tempPassword,
        firstName: form.firstName,
        lastName: form.lastName,
        workerCode: form.workerCode,
        position: form.position,
        company: form.company,
        role: form.role,
        status: "pending_activation",
        area: form.area || undefined,
        phone: form.phone || undefined,
        siUserId: form.siUser?.id || undefined,
        siUserCode: form.siUser?.code || undefined,
      });

      // Registrar cambio de estado
      registerUserStatusChange(
        newUser.id,
        null,
        "pending_activation",
        currentUser?.id || "system",
        "Usuario creado - pendiente activación"
      );

      // Enviar correo
      mockSendEmail(
        newUser.email,
        "Bienvenido a ODISEO - Activación de Cuenta",
        `Hola ${newUser.firstName},\n\nTu cuenta ha sido creada en ODISEO. Por favor actívala para continuar.\n\nEquipo ODISEO`,
        newUser.id,
        "activation"
      );

      setSuccessMessage("Usuario creado correctamente. Se envió el correo de activación.");
      setTimeout(() => navigate("/users"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const areaOptions = AREAS.map((area) => ({
    value: area,
    label: area,
  }));

  if (successMessage) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="rounded-lg border-2 border-green-300 bg-green-50 p-8 text-center max-w-md">
          <div className="text-4xl mb-4">✓</div>
          <p className="text-lg font-bold text-green-900">{successMessage}</p>
          <p className="text-sm text-green-700 mt-2">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  if (duplicateUser) {
    return (
      <div className="w-full max-w-none bg-[#f6f8fb] p-5">
        <div className="max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => setDuplicateUser(null)}
            className="mb-4 text-sm text-[#003b5c] hover:underline"
          >
            ← Volver al formulario
          </button>

          <UserDuplicateHandler
            existingUser={duplicateUser}
            loading={loading}
            onResendActivation={
              duplicateUser.status === "pending_activation" ? handleResendActivation : undefined
            }
            onReactiveUser={
              duplicateUser.status === "inactive" ? handleReactivateUser : undefined
            }
            onUnblockUser={
              duplicateUser.status === "blocked" ? handleUnblockUser : undefined
            }
            onViewDetails={() => navigate(`/users/${duplicateUser.id}`)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none bg-[#f6f8fb]">
      <form onSubmit={handleSubmit}>
        <div className="grid min-h-[calc(100vh-230px)] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,0.75fr)]">
          <div className="space-y-5">
            {/* PASO 1: Búsqueda Sistema Integral */}
            <FormCard title="Buscar en Sistema Integral" icon="🔍" color="#0D9488" required>
              <SystemIntegrationUserSearch
                value={searchQuery}
                onChange={setSearchQuery}
                onSelect={handleSiUserSelect}
                onNoResults={setHasNoSiResults}
                placeholder="Buscar por código, nombre, email o área..."
              />
              
              {isSiUserSelected && (
                <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm font-semibold text-green-900 mb-2">
                    ✓ Usuario del Sistema Integral seleccionado
                  </p>
                  <p className="text-sm text-green-800">
                    Los datos básicos se completarán automáticamente. Solo deberás asignar el rol del Portal ODISEO.
                  </p>
                </div>
              )}

              {hasNoSiResults && !isSiUserSelected && (
                <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-sm font-semibold text-amber-900 mb-3">
                    No se encontró el usuario en el Sistema Integral. Puede registrar los datos manualmente o importar una plantilla Excel.
                  </p>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCreationMode("manual")}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${
                        creationMode === "manual"
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-white text-amber-700 border-amber-300 hover:bg-amber-100"
                      }`}
                    >
                      Completar manualmente
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreationMode("excel")}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${
                        creationMode === "excel"
                          ? "bg-amber-600 text-white border-amber-600"
                          : "bg-white text-amber-700 border-amber-300 hover:bg-amber-100"
                      }`}
                    >
                      Importar plantilla Excel
                    </button>
                  </div>
                </div>
              )}

              {creationMode === "excel" && (
                <div className="mt-4 p-5 rounded-xl border border-[#003b5c]/20 bg-[#003b5c]/5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-[#003b5c]">Importar desde Excel</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        Descarga la plantilla, completa los datos y súbela para autocompletar el formulario.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleDownloadTemplate}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#003b5c] bg-white border border-[#003b5c]/30 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Download size={16} />
                      Descargar plantilla
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".xlsx, .xls"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#003b5c] rounded-lg hover:bg-[#002f4a] transition-colors shadow-sm"
                    >
                      <Upload size={16} />
                      Importar Excel
                    </button>
                  </div>

                  {excelError && (
                    <div className="mt-4 flex items-start gap-2 p-3 rounded bg-red-50 border border-red-200">
                      <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-red-800">{excelError}</p>
                    </div>
                  )}

                  {excelWarning && (
                    <div className="mt-4 flex items-start gap-2 p-3 rounded bg-amber-50 border border-amber-200">
                      <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-800">{excelWarning}</p>
                    </div>
                  )}

                  {isExcelImported && !excelError && (
                    <div className="mt-4 p-3 rounded bg-green-50 border border-green-200">
                      <p className="text-sm font-medium text-green-800">
                        ✓ Datos importados desde plantilla Excel. Revise la información antes de crear el usuario.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </FormCard>

            {/* PASO 2: Datos Básicos */}
            <FormCard
              title={isSiUserSelected ? "Datos del Sistema Integral" : "Datos del Trabajador"}
              icon="👤"
              color="#003b5c"
              required
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                  label="Código de Trabajador *"
                  value={form.workerCode}
                  onChange={(v) => updateField("workerCode", v)}
                  onBlur={() => {}}
                  error={submitAttempted ? validationErrors.workerCode : ""}
                  placeholder="Ej. EJC-000001"
                  disabled={isSiUserSelected}
                />

                <FormInput
                  label="Correo Corporativo *"
                  value={form.email}
                  onChange={(v) => updateField("email", v)}
                  onBlur={() => {}}
                  error={submitAttempted ? validationErrors.email : ""}
                  placeholder="usuario@amcor.com"
                  type="email"
                  disabled={isSiUserSelected}
                />

                <FormInput
                  label="Nombre *"
                  value={form.firstName}
                  onChange={(v) => updateField("firstName", v)}
                  onBlur={() => {}}
                  error={submitAttempted ? validationErrors.firstName : ""}
                  placeholder="Ej. Juan"
                  disabled={isSiUserSelected}
                />

                <FormInput
                  label="Apellido *"
                  value={form.lastName}
                  onChange={(v) => updateField("lastName", v)}
                  onBlur={() => {}}
                  error={submitAttempted ? validationErrors.lastName : ""}
                  placeholder="Ej. Pérez"
                  disabled={isSiUserSelected}
                />

                <FormInput
                  label="Puesto *"
                  value={form.position}
                  onChange={(v) => updateField("position", v)}
                  onBlur={() => {}}
                  error={submitAttempted ? validationErrors.position : ""}
                  placeholder="Ej. Ejecutivo Comercial"
                  disabled={isSiUserSelected}
                />

                <FormInput
                  label="Empresa *"
                  value={form.company}
                  onChange={(v) => updateField("company", v)}
                  onBlur={() => {}}
                  error={submitAttempted ? validationErrors.company : ""}
                  placeholder="Ej. Amcor"
                  disabled={isSiUserSelected}
                />

                <FormSelect
                  label="Área *"
                  value={form.area}
                  onChange={(v) => updateField("area", v)}
                  error={submitAttempted ? validationErrors.area : ""}
                  options={areaOptions}
                  placeholder="-- Seleccione Área --"
                  disabled={isSiUserSelected}
                />

                <FormInput
                  label="Teléfono"
                  value={form.phone}
                  onChange={(v) => updateField("phone", v)}
                  onBlur={() => {}}
                  placeholder="Ej. +51 999 999 999"
                />
              </div>

              {isSiUserSelected && (
                <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 flex gap-2">
                  <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800">
                    Los campos provenientes del Sistema Integral están bloqueados y no pueden editarse.
                  </p>
                </div>
              )}
            </FormCard>

            {/* PASO 3: Rol Portal ODISEO */}
            <FormCard title="Rol Portal ODISEO" icon="🔐" color="#7E3FB2" required>
              <div className="grid grid-cols-1 gap-4">
                <FormSelect
                  label="Rol *"
                  value={form.role}
                  onChange={(v) => updateField("role", v as UserRole)}
                  error={submitAttempted ? validationErrors.role : ""}
                  options={roleOptions}
                  placeholder="-- Seleccione Rol --"
                />
              </div>

              <div className="mt-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-sm font-semibold text-slate-700 mb-2">Descripción del Rol:</p>
                <p className="text-sm text-slate-600">
                  {form.role === "admin" && "Acceso total al sistema. Puede gestionar usuarios, configuraciones y todas las operaciones."}
                  {form.role === "comercial" && "Gestiona clientes, portafolios y proyectos. Acceso a datos comerciales."}
                  {form.role === "artes" && "Trabaja en especificaciones de diseño y arte de productos."}
                  {form.role === "rd" && "Gestiona especificaciones técnicas, estructura y desarrollo de productos."}
                  {form.role === "finance" && "Acceso a datos financieros, precios y condiciones comerciales."}
                  {form.role === "viewer" && "Solo lectura. Puede visualizar información pero no modificar datos."}
                </p>
              </div>

              <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm font-semibold text-amber-900 mb-1">Estado Automático:</p>
                <p className="text-sm text-amber-800">
                  El usuario se creará en estado <strong>Pendiente de activación</strong>. Se enviará un correo para completar la activación.
                </p>
              </div>
            </FormCard>
          </div>

          {/* Panel Lateral */}
          <div className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="px-5 py-4 bg-gradient-to-br from-[#003b5c] to-[#1E82D9] text-white">
                <div className="text-xs font-bold uppercase tracking-wide text-white/75">
                  Resumen
                </div>
                <div className="mt-2 text-lg font-extrabold">Nuevo Usuario</div>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Código</p>
                  <p className="text-lg font-bold text-[#003b5c]">{userCode}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Origen</p>
                  <p className="text-sm font-bold text-[#003b5c]">
                    {isExcelImported ? "Plantilla Excel" : isSiUserSelected ? "Sistema Integral" : "Manual"}
                  </p>
                </div>

                {isExcelImported && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Estado Automático</p>
                    <p className="text-sm font-bold text-amber-600">
                      Pendiente de activación
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Progreso</p>
                  <div className="mt-1">
                    <div className="text-sm font-bold text-amber-600">
                      {completionPercentage}% completado
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2 rounded-full bg-amber-500 transition-all"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                    Campos Requeridos
                  </p>
                  <ul className="text-sm space-y-1">
                    <li className={form.workerCode ? "text-green-600" : "text-slate-400"}>
                      {form.workerCode ? "✓" : "○"} Cod. Trabajador
                    </li>
                    <li className={form.email ? "text-green-600" : "text-slate-400"}>
                      {form.email ? "✓" : "○"} Correo Corporativo
                    </li>
                    <li className={form.firstName ? "text-green-600" : "text-slate-400"}>
                      {form.firstName ? "✓" : "○"} Nombre
                    </li>
                    <li className={form.lastName ? "text-green-600" : "text-slate-400"}>
                      {form.lastName ? "✓" : "○"} Apellido
                    </li>
                    <li className={form.position ? "text-green-600" : "text-slate-400"}>
                      {form.position ? "✓" : "○"} Puesto
                    </li>
                    <li className={form.company ? "text-green-600" : "text-slate-400"}>
                      {form.company ? "✓" : "○"} Empresa
                    </li>
                    <li className={form.area ? "text-green-600" : "text-slate-400"}>
                      {form.area ? "✓" : "○"} Área
                    </li>
                    <li className={form.role ? "text-green-600" : "text-slate-400"}>
                      {form.role ? "✓" : "○"} Rol
                    </li>
                  </ul>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500">
                    <span className="text-red-500">*</span> Campos obligatorios
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 z-40 mt-6 border-t border-slate-200 bg-[#f6f8fb]/95 py-4 backdrop-blur">
          <FormActionButtons
            onCancel={() => navigate("/users")}
            validationErrorList={[
              ...Object.values(validationErrors),
              ...(excelError ? [excelError] : []),
            ]}
            submitAttempted={submitAttempted}
            submitLabel="Crear Usuario"
            cancelLabel="Cancelar"
            isLoading={loading}
          />
        </div>
      </form>
    </div>
  );
}
