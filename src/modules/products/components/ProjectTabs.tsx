import type { ProjectTab } from "../../../shared/types"

const TABS: { key: ProjectTab; label: string }[] = [
  { key: "activos", label: "Activos" },
  { key: "borradores", label: "Borradores" },
  { key: "aprobaciones", label: "Aprobaciones" },
]

interface ProjectTabsProps {
  value: ProjectTab
  onChange: (tab: ProjectTab) => void
}

const ProjectTabs = ({ value, onChange }: ProjectTabsProps) => (
  <div className="flex gap-2 overflow-x-auto">
    {TABS.map((t) => {
      const active = t.key === value
      return (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={[
            "px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap border",
            active
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-transparent border-transparent text-gray-600 hover:bg-white/70 hover:border-gray-200",
          ].join(" ")}
        >
          {t.label}
        </button>
      )
    })}
  </div>
)

export default ProjectTabs
