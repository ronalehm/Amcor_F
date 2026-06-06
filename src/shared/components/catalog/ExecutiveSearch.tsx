import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search } from "lucide-react";
import type { CommercialExecutiveRecord } from "../../data/executiveStorage";

type ExecutiveSearchProps = {
  label: string;
  value: string; // Executive ID as string
  executives: CommercialExecutiveRecord[];
  onChange: (executiveId: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
};

export default function ExecutiveSearch({
  label,
  value,
  executives,
  onChange,
  onBlur,
  error,
  placeholder = "Escribe para buscar ejecutivo...",
}: ExecutiveSearchProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedExecutive = executives.find((e) => String(e.id) === value);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // Sincronizar nombre del ejecutivo en el input
  useEffect(() => {
    if (value && selectedExecutive) {
      setQuery(selectedExecutive.name);
    } else if (!value) {
      setQuery("");
    }
  }, [value, selectedExecutive]);

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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const dropdownHeight = 256;

      const shouldOpenUp = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

      setDropdownStyle({
        position: "fixed",
        ...(shouldOpenUp
          ? { bottom: viewportHeight - rect.top }
          : { top: rect.bottom }),
        left: rect.left,
        width: rect.width,
        maxHeight: "256px",
        zIndex: 9999,
      });
    }
  }, [isOpen]);

  const filteredExecutives = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return executives;

    return executives.filter((executive) => {
      const searchText = `${executive.name} ${executive.code} ${executive.email || ""}`.toLowerCase();
      return searchText.includes(search);
    });
  }, [executives, query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setQuery(newValue);
    setSelectedIndex(-1);

    if (newValue.trim().length > 0) {
      setIsOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsOpen(true);
        setSelectedIndex((prev) => Math.min(prev + 1, filteredExecutives.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && filteredExecutives[selectedIndex]) {
          selectExecutive(filteredExecutives[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const selectExecutive = (executive: CommercialExecutiveRecord) => {
    onChange(String(executive.id));
    setQuery(executive.name);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const showDropdown = isOpen && (query.trim().length === 0 || filteredExecutives.length > 0);

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
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm shadow-sm outline-none transition-colors ${
            error
              ? "border-red-300 text-red-900 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-slate-200 text-slate-700 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
          } placeholder:text-slate-400`}
        />
      </div>

      {showDropdown &&
        createPortal(
          <div
            style={dropdownStyle}
            className="overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg"
          >
            {filteredExecutives.length > 0 ? (
              filteredExecutives.map((executive, index) => (
                <button
                  key={executive.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => selectExecutive(executive)}
                  className={`block w-full border-b border-slate-100 px-3 py-2 text-left transition-colors last:border-0 ${
                    index === selectedIndex
                      ? "bg-brand-secondary-soft"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="text-sm font-semibold text-slate-800">
                    {executive.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {executive.code} · {executive.email}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-3 text-sm text-amber-700 bg-amber-50">
                Ejecutivo no encontrado. Regístrelo en el módulo Ejecutivos Comerciales.
              </div>
            )}
          </div>,
          document.body
        )}

      {error && (
        <span className="mt-1 block text-xs font-normal text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
