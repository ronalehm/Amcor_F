import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLayout } from "../../../components/layout/LayoutContext";
import { getClientByCode, ClientRecord } from "../../../shared/data/clientStorage";
import PreviewRow from "../../../shared/components/display/PreviewRow";
import EntityStatusBadge from "../../../shared/components/display/EntityStatusBadge";
import FormCard from "../../../shared/components/forms/FormCard";

export default function ClientDetailPage() {
  const navigate = useNavigate();
  const { setHeader, resetHeader } = useLayout();
  const { clientCode } = useParams<{ clientCode: string }>();

  const [client, setClient] = useState<ClientRecord | null>(null);

  useEffect(() => {
    if (clientCode) {
      const record = getClientByCode(clientCode);
      setClient(record || null);
      
      setHeader({
        title: "Detalle de Cliente",
        breadcrumbs: [
          { label: "Clientes", href: "/clients" },
          { label: clientCode },
          { label: "Ver" },
        ],
        actions: (
          <button
            onClick={() => navigate(`/clients/${clientCode}/edit`)}
            className="rounded-lg bg-[#003b5c] px-4 py-2 text-sm font-bold text-white hover:bg-[#002b43]"
          >
            Editar Cliente
          </button>
        )
      });
    }

    return () => resetHeader();
  }, [clientCode, setHeader, resetHeader, navigate]);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-red-600 font-semibold">Cliente no encontrado</div>
        <button onClick={() => navigate("/clients")} className="text-brand-primary hover:underline">
          Volver a Clientes
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none bg-[#f6f8fb] space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-[#003b5c] to-[#1E82D9] text-white">
              <h2 className="text-xl font-bold">{client.name}</h2>
              <p className="text-sm opacity-80 mt-1">{client.documentType}: {client.ruc}</p>
              <div className="mt-4">
                <EntityStatusBadge status={client.status} />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <PreviewRow label="Código" value={client.code} />
              <PreviewRow label="Nombre Comercial" value={client.commercialName} />
              <PreviewRow label="Ejecutivo" value={client.ejecutivoName} />
              <PreviewRow label="Fecha Registro" value={new Date(client.createdAt).toLocaleDateString()} />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <FormCard title="Clasificación Estratégica" icon="◇" color="#1E82D9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <PreviewRow label="Actividad Principal" value={client.actividadPrincipal} />
              <PreviewRow label="Rubro General" value={client.rubroGeneral} />
              <PreviewRow label="Gestión" value={client.gestion} />
              <PreviewRow label="Ventas UIT" value={client.ventasUIT} />
              <PreviewRow label="Empleados" value={client.empleados} />
              <PreviewRow label="Resultado" value={client.resultado} />
              <PreviewRow label="Cobertura" value={client.cobertura} />
              <PreviewRow label="Posicionamiento" value={client.posicionamiento} />
            </div>
          </FormCard>

          <FormCard title="Sede Central" icon="▥" color="#003b5c">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              <PreviewRow label="País" value={client.pais} />
              <PreviewRow label="Departamento" value={client.departamento} />
              <PreviewRow label="Provincia" value={client.provincia} />
              <PreviewRow label="Distrito" value={client.distrito} />
              <PreviewRow label="Dirección Fiscal" value={client.direccionFiscal} className="md:col-span-2" />
              <PreviewRow label="Cultura" value={client.culturaOrganizacional} className="md:col-span-2" />
            </div>
          </FormCard>
        </div>
      </div>
    </div>
  );
}
