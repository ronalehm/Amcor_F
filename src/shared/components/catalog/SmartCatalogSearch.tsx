import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

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
  emptyMessage?: string;
};

export default function SmartCatalogSearch({
  label,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  error,
  emptyMessage,
}: SmartCatalogSearchProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const justTypedRef = useRef(false);
  const selectedOption = options.find((option) => String(option.id) === value);

  const [query, setQuery] = useState(selectedOption?.name || "");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedOption) {
      setQuery(selectedOption.name);
    }

    if (!value) {
      if (!justTypedRef.current) {
        setQuery("");
      }
      setIsOpen(false);
    }
    justTypedRef.current = false;
  }, [value, selectedOption?.name]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return [];

    return options.filter((option) =>
      [option.name, option.code, option.meta]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [options, query]);

  const selectOption = (option: SmartCatalogOption) => {
    onChange(String(option.id));
    setQuery(option.name);
    setIsOpen(false);
  };

  const showDropdown = isOpen && query.trim().length >= 1;

  return (
    <div className="relative" ref={wrapperRef}>
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
        {label}
      </span>

      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={query}
          onFocus={() => setIsOpen(true)}
          onBlur={onBlur}
          onChange={(event) => {
            const newValue = event.target.value;
            justTypedRef.current = true;
            setQuery(newValue);
            onChange("");
            if (newValue.trim().length >= 1) {
              setIsOpen(true);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setIsOpen(false);
            }
          }}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm shadow-sm outline-none transition-colors ${
            error
              ? "border-red-300 text-red-900 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-slate-200 text-slate-700 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          } placeholder:text-slate-400`}
        />
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
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
            <div className="px-3 py-3 text-sm text-amber-700 bg-amber-50">
              {emptyMessage || "No se encontraron resultados."}
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