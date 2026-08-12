import { useState } from "react";

type RestrictionTab = "dimension" | "validation";

export function RestrictionsViewerTabs() {
  const [activeTab, setActiveTab] = useState<RestrictionTab>("dimension");

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-slate-100 px-5 pt-4 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("dimension")}
            className={`whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition-colors ${
              activeTab === "dimension"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-slate-500 hover:text-brand-primary"
            }`}
          >
            <span className="mr-2">📏</span>
            Restricciones de Dimensión
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                activeTab === "dimension"
                  ? "bg-brand-secondary-soft text-brand-primary"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              0
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("validation")}
            className={`whitespace-nowrap border-b-2 pb-3 text-sm font-bold transition-colors ${
              activeTab === "validation"
                ? "border-brand-primary text-brand-primary"
                : "border-transparent text-slate-500 hover:text-brand-primary"
            }`}
          >
            <span className="mr-2">✓</span>
            Restricciones de Validación
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                activeTab === "validation"
                  ? "bg-brand-secondary-soft text-brand-primary"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              0
            </span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {activeTab === "dimension" && (
          <div className="py-8 text-center">
            <p className="text-slate-600">No hay restricciones de dimensión definidas aún</p>
          </div>
        )}

        {activeTab === "validation" && (
          <div className="py-8 text-center">
            <p className="text-slate-600">No hay restricciones de validación definidas aún</p>
          </div>
        )}
      </div>
    </div>
  );
}
