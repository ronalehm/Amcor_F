import type { ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

interface Breadcrumb {
  label: string
  path?: string
}

interface SubHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  tabs?: ReactNode
  breadcrumbs?: Breadcrumb[]
}

const SubHeader = ({ title, subtitle, actions, tabs, breadcrumbs }: SubHeaderProps) => (
  <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
    <div className="px-8 py-5">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center text-xs text-gray-500 mb-2 font-medium">
          <Link to="/inicio" className="hover:text-brand-primary transition-colors">
            Inicio
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center">
              <ChevronRight size={12} className="mx-1 text-gray-400" />
              {crumb.path && idx < breadcrumbs.length - 1 ? (
                <Link to={crumb.path} className="hover:text-brand-primary transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className={idx === breadcrumbs.length - 1 ? "text-brand-primary font-semibold" : ""}>
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title || "Inicio >> Cuadro de mando"}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>

    {tabs && (
      <div className="px-8 flex gap-6 text-sm font-medium text-gray-500 border-t border-gray-100 pt-3">
        {tabs}
      </div>
    )}
  </div>
)

export default SubHeader
