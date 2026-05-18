// src/components/layout/HeaderCommandBar.tsx

import { Info, Plus, Search } from "lucide-react"

type HeaderCommandBarProps = {
  placeholder?: string
  primaryLabel?: string
  info?: string
  value?: string
  onSearchChange?: (value: string) => void
  onSearchSubmit?: (value: string) => void
  onPrimaryClick?: () => void
}

export default function HeaderCommandBar({
  placeholder = "Buscar cliente, producto, SKU, portafolio o rubro...",
  primaryLabel = "Crear Producto",
  info = "Busca referencias reutilizables para crear productos sin partir desde cero.",
  value,
  onSearchChange,
  onSearchSubmit,
  onPrimaryClick,
}: HeaderCommandBarProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const searchValue = String(formData.get("search") ?? "")

    onSearchSubmit?.(searchValue)
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-xl font-black tracking-tight text-slate-900">
          Portal Web ODISEO
        </h2>

        {info && (
          <button
            type="button"
            title={info}
            aria-label="Información"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Info size={16} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            name="search"
            type="text"
            value={value}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={placeholder}
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10"
          />
        </div>

        <button
          type="button"
          onClick={onPrimaryClick}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-brand-primary px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-secondary hover:shadow-md"
        >
          <Plus size={17} />
          {primaryLabel}
        </button>
      </form>
    </div>
  )
}