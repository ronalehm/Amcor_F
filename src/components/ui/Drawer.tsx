import { useEffect, useCallback } from "react"
import { X } from "lucide-react"
import type { ReactNode } from "react"

interface DrawerProps {
  open: boolean
  title?: string
  subtitle?: string
  widthClassName?: string
  onClose: () => void
  children: ReactNode
}

const Drawer = ({
  open,
  title,
  subtitle,
  widthClassName = "w-[420px]",
  onClose,
  children,
}: DrawerProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60]">
      <button
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Cerrar panel"
      />

      <aside
        className={`absolute right-0 top-0 h-full bg-white shadow-2xl border-l border-gray-200 flex flex-col ${widthClassName}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>}
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          {children}
        </div>
      </aside>
    </div>
  )
}

export default Drawer
