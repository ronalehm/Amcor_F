import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { type VendorMirror } from "../../../shared/data/vendorMirrorStorage";
import { getAllClientsMirror } from "../../../shared/data/clientMirrorStorage";

interface SystemIntegrationClientSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (vendor: any) => void;
  onNoResults?: (hasNoResults: boolean) => void;
  placeholder?: string;
}

export default function SystemIntegrationClientSearch({
  value,
  onChange,
  onSelect,
  onNoResults,
  placeholder = "Buscar cliente del Sistema Integral...",
}: SystemIntegrationClientSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const clients = useMemo(() => getAllClientsMirror(), []);

  const filteredClients = useMemo(() => {
    const search = value.trim().toLowerCase();
    if (!search) return [];

    return clients.filter((client: any) => {
      const searchableText = [
        client.code,
        client.razonSocial,
        client.nombreComercial,
        client.ruc,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    });
  }, [value, clients]);

  const hasNoResults = value.trim().length > 0 && filteredClients.length === 0;

  useMemo(() => {
    onNoResults?.(hasNoResults);
  }, [hasNoResults, onNoResults]);

  return (
    <div className="relative">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-700 shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:border-[#003b5c] focus:ring-1 focus:ring-[#003b5c]"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="pointer-events-auto absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && value && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
            {filteredClients.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {filteredClients.map((client: any) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => {
                      onSelect(client);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 transition-colors"
                  >
                    <div className="font-semibold text-slate-900">{client.razonSocial || client.nombreComercial}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {client.code} • RUC: {client.ruc}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                No se encontraron clientes en el Sistema Integral
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
