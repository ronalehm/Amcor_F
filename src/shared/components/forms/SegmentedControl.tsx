interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export default function SegmentedControl({
  options,
  value,
  onChange,
  label,
  className = "",
}: SegmentedControlProps) {
  return (
    <div className={className}>
      {label && (
        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
          {label}
        </span>
      )}
      <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              value === option.value
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
