type EnvolturaOption = "LAMINA" | "BOLSA" | "POUCH";

type EnvolturaSelectorProps = {
  value: EnvolturaOption | "";
  onChange?: (value: EnvolturaOption) => void;
  readOnly?: boolean;
  error?: string;
};

const ENVOLTURAS = [
  {
    id: "LAMINA",
    label: "Lámina",
    image: "/assets/envolturas/lamina.png",
    description: "Film plano enrollado",
  },
  {
    id: "BOLSA",
    label: "Bolsa",
    image: "/assets/envolturas/bolsa.png",
    description: "Bolsa sellada",
  },
  {
    id: "POUCH",
    label: "Pouch",
    image: "/assets/envolturas/pouch.png",
    description: "Pouch flexible",
  },
] as const;

export default function EnvolturaSelector({
  value,
  onChange,
  readOnly = false,
  error,
}: EnvolturaSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        {ENVOLTURAS.map((envoltura) => (
          <button
            key={envoltura.id}
            type="button"
            onClick={() => !readOnly && onChange?.(envoltura.id as EnvolturaOption)}
            disabled={readOnly}
            className={`relative flex flex-col items-center gap-1 rounded-lg border-2 px-2 py-2 transition-all ${
              value === envoltura.id
                ? "border-brand-primary bg-blue-50/60"
                : "border-slate-200 bg-white hover:border-slate-300"
            } ${readOnly ? "cursor-default" : "cursor-pointer"} ${
              !readOnly && "hover:shadow-sm"
            }`}
          >
            {/* Radio Circle */}
            <div
              className={`absolute top-1.5 right-1.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                value === envoltura.id
                  ? "border-brand-primary bg-brand-primary"
                  : "border-slate-300 bg-white"
              }`}
            >
              {value === envoltura.id && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>

            {/* Image */}
            <div className="w-full h-24 flex-none flex items-center justify-center overflow-hidden bg-slate-50 rounded">
              <img
                src={envoltura.image}
                alt={envoltura.label}
                className="h-full w-full object-contain p-2"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>

            {/* Label */}
            <span
              className={`text-xs font-semibold text-center leading-tight ${
                value === envoltura.id
                  ? "text-brand-primary"
                  : "text-slate-700"
              }`}
            >
              {envoltura.label}
            </span>


          </button>
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
