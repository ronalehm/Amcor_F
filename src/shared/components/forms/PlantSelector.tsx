type PlantOption = "AF_LIMA" | "AF_CALI" | "AF_SANTIAGO" | "AF_SAN_LUIS";

type PlantSelectorProps = {
  value: PlantOption | "";
  onChange?: (value: PlantOption) => void;
  readOnly?: boolean;
  error?: string;
};

const PLANTS = [
  {
    id: "AF_LIMA",
    label: "AF Lima",
    description: "Planta Lima",
    emoji: "🌴",
  },
  {
    id: "AF_CALI",
    label: "AF Cali",
    description: "Planta Cali",
    emoji: "🏭",
  },
  {
    id: "AF_SANTIAGO",
    label: "AF Santiago Norte",
    description: "Planta Santiago",
    emoji: "⛰️",
  },
  {
    id: "AF_SAN_LUIS",
    label: "AF San Luis",
    description: "Planta San Luis",
    emoji: "🏢",
  },
] as const;

export default function PlantSelector({
  value,
  onChange,
  readOnly = false,
  error,
}: PlantSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {PLANTS.map((plant) => (
          <button
            key={plant.id}
            type="button"
            onClick={() => !readOnly && onChange?.(plant.id as PlantOption)}
            disabled={readOnly}
            className={`relative flex flex-col items-center gap-1 rounded-lg border-2 px-2 py-2 transition-all ${
              value === plant.id
                ? "border-brand-primary bg-blue-50/60"
                : "border-slate-200 bg-white hover:border-slate-300"
            } ${readOnly ? "cursor-default" : "cursor-pointer"} ${
              !readOnly && "hover:shadow-sm"
            }`}
          >
            {/* Radio Circle */}
            <div
              className={`absolute top-1.5 right-1.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                value === plant.id
                  ? "border-brand-primary bg-brand-primary"
                  : "border-slate-300 bg-white"
              }`}
            >
              {value === plant.id && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>

            {/* Icon */}
            <div className="text-xl leading-none">{plant.emoji}</div>

            {/* Label */}
            <span
              className={`text-xs font-semibold text-center leading-tight ${
                value === plant.id
                  ? "text-brand-primary"
                  : "text-slate-700"
              }`}
            >
              {plant.label}
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
