interface CatalogSourceTabsProps {
  value: "ODISEO" | "SISTEMA_INTEGRAL";
  onChange: (source: "ODISEO" | "SISTEMA_INTEGRAL") => void;
}

export default function CatalogSourceTabs({
  value,
  onChange,
}: CatalogSourceTabsProps) {
  return (
    <div className="mb-6 flex gap-2 border-b border-slate-200 px-0">
      <button
        type="button"
        onClick={() => onChange("ODISEO")}
        className={`px-4 py-3 text-sm font-semibold transition-colors ${
          value === "ODISEO"
            ? "border-b-2 border-brand-primary text-brand-primary"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        ODISEO
      </button>
      <button
        type="button"
        onClick={() => onChange("SISTEMA_INTEGRAL")}
        className={`px-4 py-3 text-sm font-semibold transition-colors ${
          value === "SISTEMA_INTEGRAL"
            ? "border-b-2 border-brand-primary text-brand-primary"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        Sistema Integral
      </button>
    </div>
  );
}
