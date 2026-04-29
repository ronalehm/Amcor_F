import { useEffect, useMemo, useState } from "react";

export type SmartCatalogOption = {
  id: number | string;
  code: string;
  name: string;
  meta?: string;
};

type SmartCatalogSearchProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  options: SmartCatalogOption[];
  placeholder?: string;
  error?: string;
  buttonLabel?: string;
};

export default function SmartCatalogSearch({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  error,
  buttonLabel = "Buscar",
}: SmartCatalogSearchProps) {
  const selectedOption = options.find((option) => String(option.id) === value);

  const [query, setQuery] = useState(selectedOption?.name || "");
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (selectedOption) {
      setQuery(selectedOption.name);
    }

    if (!value) {
      setQuery("");
    }
  }, [value, selectedOption?.name]);

  const filteredOptions = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (showAll || !search) return options;

    return options.filter((option) =>
      [option.name, option.code, option.meta]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [options, query, showAll]);

  const selectOption = (option: SmartCatalogOption) => {
    onChange(String(option.id));
    setQuery(option.name);
    setIsOpen(false);
    setShowAll(false);
  };

  return (
    <div className="relative">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </span>

      <div className="flex gap-2">
        <input
          value={query}
          onFocus={() => setIsOpen(true)}
          onBlur={onBlur}
          onChange={(event) => {
            setQuery(event.target.value);
            onChange("");
            setIsOpen(true);
            setShowAll(false);
          }}
          placeholder={placeholder}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm outline-none ${
            error
              ? "border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : "border-slate-300 focus:border-[#0d4c5c] focus:ring-2 focus:ring-[#0d4c5c]/20"
          }`}
        />

        <button
          type="button"
          onClick={() => {
            setShowAll(true);
            setIsOpen((prev) => !prev);
          }}
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          {buttonLabel}
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}
                className="block w-full border-b border-slate-100 px-3 py-2 text-left hover:bg-slate-50"
              >
                <div className="text-sm font-semibold text-slate-800">
                  {option.name}
                </div>

                <div className="text-xs text-slate-500">
                  {option.code}
                  {option.meta ? ` · ${option.meta}` : ""}
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-3 text-sm text-slate-500">
              No se encontraron resultados.
            </div>
          )}
        </div>
      )}

      {error && (
        <span className="mt-1 block text-[11px] font-semibold text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}