interface CatalogRestrictionTabsProps {
  activeTab: "catalogs" | "restrictions";
  onTabChange: (tab: "catalogs" | "restrictions") => void;
  catalogCount: number;
  restrictionCount: number;
}

export default function CatalogRestrictionTabs({
  activeTab,
  onTabChange,
  catalogCount,
  restrictionCount,
}: CatalogRestrictionTabsProps) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="flex gap-8 px-6 py-4">
        <button
          onClick={() => onTabChange("catalogs")}
          className={`pb-3 text-sm font-semibold transition-colors ${
            activeTab === "catalogs"
              ? "border-b-2 border-brand-primary text-brand-primary"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Catálogos{" "}
          <span className="ml-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
            {catalogCount}
          </span>
        </button>
        <button
          onClick={() => onTabChange("restrictions")}
          className={`pb-3 text-sm font-semibold transition-colors ${
            activeTab === "restrictions"
              ? "border-b-2 border-brand-primary text-brand-primary"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Restricciones{" "}
          <span className="ml-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
            {restrictionCount}
          </span>
        </button>
      </div>
    </div>
  );
}
