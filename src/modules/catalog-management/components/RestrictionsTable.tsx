import { useState } from "react";
import { getAvailableRestrictions } from "../services/catalogRestrictionService";
import type { RestrictionItem } from "../types/catalogRestriction.types";

interface RestrictionsTableProps {
  onSelectRestriction: (id: string, name: string) => void;
  selectedRestrictionId: string;
  activeTab?: "dimension" | "validation";
  onTabChange?: (tab: "dimension" | "validation") => void;
}

export default function RestrictionsTable({
  onSelectRestriction,
  selectedRestrictionId,
  activeTab = "dimension",
  onTabChange,
}: RestrictionsTableProps) {
  const restrictions = getAvailableRestrictions();

  return (
    <div className="space-y-3">
      {/* Tabs */}
      {onTabChange && (
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => onTabChange("dimension")}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === "dimension"
                ? "border-b-2 border-brand-primary text-brand-primary"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Dimensiones
          </button>
          <button
            onClick={() => onTabChange("validation")}
            className={`pb-2 text-sm font-medium transition-colors ${
              activeTab === "validation"
                ? "border-b-2 border-brand-primary text-brand-primary"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Validaciones
          </button>
        </div>
      )}

      {/* Restrictions List */}
      <div className="max-h-96 overflow-y-auto space-y-2">
        {restrictions.length === 0 ? (
          <p className="text-sm text-slate-600 py-4">
            No hay restricciones disponibles.
          </p>
        ) : (
          restrictions.map((restriction) => (
            <label
              key={restriction.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
            >
              <input
                type="radio"
                name="selectedRestriction"
                value={restriction.id}
                checked={selectedRestrictionId === restriction.id}
                onChange={() => onSelectRestriction(restriction.id, restriction.name)}
                className="mt-0"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-900 truncate">
                  {restriction.name}
                </div>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
