// src/modules/dashboard/pages/DashboardPage.tsx

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  FilePlus2,
  FolderPlus,
  GitBranchPlus,
  Plus,
  Search,
  Upload,
} from "lucide-react";

import { useLayout } from "../../../components/layout/LayoutContext";
import QuickCreatePanel from "../components/QuickCreatePanel";
import WorkQueuePanel from "../components/WorkQueuePanel";
import ProjectInitialCreateModal from "../../../shared/components/modals/ProjectInitialCreateModal";
import ProductPreliminaryCreateModal from "../../../shared/components/modals/ProductPreliminaryCreateModal";

import { WORK_QUEUE } from "../data/homeMockData";

type NewOption = {
  label: string;
  description: string;
  enabled: boolean;
  icon: ReactNode;
  onClick: () => void;
};

type DashboardCommandBarProps = {
  onCreateProject: () => void;
  onCreatePreliminaryProduct: () => void;
};

function DashboardCommandBar({
  onCreateProject,
  onCreatePreliminaryProduct,
}: DashboardCommandBarProps) {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  /**
   * TODO ODISEO:
   * Reemplazar por contexto real del portafolio/proyecto seleccionado.
   */
  const hasValidatedOrApprovedProject = true;
  const hasApprovedPreviousProduct = true;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const options = useMemo<NewOption[]>(
    () => [
      {
        label: "Crear Proyecto",
        description: "Registrar un nuevo proyecto para validación técnica.",
        enabled: true,
        icon: <FolderPlus size={17} />,
        onClick: () => {
          setOpen(false);
          onCreateProject();
        },
      },
      {
        label: "Crear Producto Preliminar",
        description: "Crear producto desde un proyecto validado o aprobado.",
        enabled: hasValidatedOrApprovedProject,
        icon: <FilePlus2 size={17} />,
        onClick: () => {
          setOpen(false);
          onCreatePreliminaryProduct();
        },
      },
      {
        label: "Importar Productos Preliminares",
        description: "Carga masiva de productos preliminares desde plantilla.",
        enabled: hasValidatedOrApprovedProject,
        icon: <Upload size={17} />,
        onClick: () => {
          setOpen(false);
          navigate("/products/import");
        },
      },
      {
        label: "Crear Producto Modificado / Nueva Versión",
        description: "Crear una nueva versión desde un producto previo aprobado.",
        enabled: hasApprovedPreviousProduct,
        icon: <GitBranchPlus size={17} />,
        onClick: () => {
          setOpen(false);
          navigate("/products/create?mode=modified");
        },
      },
    ],
    [
      hasValidatedOrApprovedProject,
      hasApprovedPreviousProduct,
      navigate,
      onCreateProject,
      onCreatePreliminaryProduct,
    ],
  );

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const value = String(formData.get("search") ?? "").trim();

    if (!value) return;

    console.log("Buscar en ODISEO:", value);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Portal Web ODISEO
        </h1>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            name="search"
            type="text"
            placeholder="Buscar cliente, producto, SKU, portafolio o rubro..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#003B5C] focus:ring-2 focus:ring-[#003B5C]/10"
          />
        </div>

        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#003B5C] px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#00567f] hover:shadow-md"
          >
            <Plus size={17} />
            Nuevo
            <ChevronDown
              size={16}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-[52px] z-50 w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">
                  Crear nuevo
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  Selecciona qué deseas iniciar en ODISEO.
                </p>
              </div>

              <div className="p-2">
                {options.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    disabled={!option.enabled}
                    onClick={option.enabled ? option.onClick : undefined}
                    title={
                      option.enabled
                        ? option.description
                        : "Opción no disponible con el contexto actual."
                    }
                    className={[
                      "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition",
                      option.enabled
                        ? "text-slate-700 hover:bg-slate-50"
                        : "cursor-not-allowed text-slate-400 opacity-60",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        option.enabled
                          ? "bg-[#003B5C]/10 text-[#003B5C]"
                          : "bg-slate-100 text-slate-400",
                      ].join(" ")}
                    >
                      {option.icon}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {option.label}
                      </span>

                      <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                        {option.description}
                      </span>

                      {!option.enabled && (
                        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                          No disponible
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default function DashboardPage() {
  const { setHeader, resetHeader } = useLayout();

  const [isProjectCreateModalOpen, setIsProjectCreateModalOpen] =
    useState(false);

  const [isPreliminaryProductModalOpen, setIsPreliminaryProductModalOpen] =
    useState(false);

  useEffect(() => {
    setHeader({
      title: "Portal Web ODISEO",
      subtitle: undefined,
      toolbar: (
        <DashboardCommandBar
          onCreateProject={() => setIsProjectCreateModalOpen(true)}
          onCreatePreliminaryProduct={() =>
            setIsPreliminaryProductModalOpen(true)
          }
        />
      ),
    });

    return () => resetHeader();
  }, [setHeader, resetHeader]);

  return (
    <>
      <div className="w-full space-y-6">
        {/* Grid principal: Reutilizar base (izq) + Mi bandeja (der) */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          {/* Columna izquierda: Reutilizar bases aprobadas */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              Crear desde base aprobada
            </h2>
            <p className="text-xs text-slate-500">
              Reutiliza productos aprobados como base para avanzar más rápido.
            </p>
            <QuickCreatePanel />
          </section>

          {/* Columna derecha: Mi bandeja */}
          <WorkQueuePanel items={WORK_QUEUE} />
        </div>
      </div>

      <ProjectInitialCreateModal
        isOpen={isProjectCreateModalOpen}
        onClose={() => setIsProjectCreateModalOpen(false)}
        onProjectCreated={() => setIsProjectCreateModalOpen(false)}
      />

      <ProductPreliminaryCreateModal
        isOpen={isPreliminaryProductModalOpen}
        onClose={() => setIsPreliminaryProductModalOpen(false)}
        onProductCreated={() => setIsPreliminaryProductModalOpen(false)}
      />
    </>
  );
}