import type { ManagementType } from "../types/catalogRestriction.types";

interface ManagementTypeSelectorProps {
  value: ManagementType;
  onChange: (value: ManagementType) => void;
}

export default function ManagementTypeSelector({ value, onChange }: ManagementTypeSelectorProps) {
  const options: { value: ManagementType; label: string }[] = [
    { value: "catalog", label: "Catálogo" },
    { value: "restriction", label: "Restricción" },
  ];

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-6 border-b border-slate-200">
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition-colors ${
                isActive
                  ? "border-brand-primary text-brand-primary"
                  : "border-transparent text-slate-500 hover:text-brand-primary"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
