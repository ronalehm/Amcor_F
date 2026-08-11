import { useState } from "react";
import type { ChangeLogEntry } from "../types/catalogRestriction.types";
import type { RestrictionChangeLogEntry } from "../../../shared/data/restrictionChangeLog";

interface RecentChangeLogPanelProps {
  type: "catalog" | "restriction";
  catalogEntries: ChangeLogEntry[];
  restrictionEntries: RestrictionChangeLogEntry[];
  onViewHistory: () => void;
}

export default function RecentChangeLogPanel({
  type,
  catalogEntries,
  restrictionEntries,
  onViewHistory,
}: RecentChangeLogPanelProps) {
  const entries = type === "catalog" ? catalogEntries : restrictionEntries;
  const recentEntries = entries.slice(0, 5);
  const isEmpty = entries.length === 0;

  const formatCatalogEntry = (entry: ChangeLogEntry) => (
    <div key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
      <div className="font-semibold text-slate-900">{entry.element}</div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-slate-600">✏️ {entry.action}</span>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            entry.result === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {entry.result === "success" ? "Éxito" : "Error"}
        </span>
      </div>
      <div className="text-slate-500 mt-2">
        {entry.timestamp} • {entry.user}
      </div>
      {entry.processedRecords !== undefined && (
        <div className="text-slate-600 mt-2">
          {entry.processedRecords} registro(s) procesado(s)
        </div>
      )}
    </div>
  );

  const formatRestrictionEntry = (entry: RestrictionChangeLogEntry) => (
    <div key={entry.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs">
      <div className="font-semibold text-slate-900">{entry.restrictionName}</div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-slate-600">
          {entry.action === "updated"
            ? "✏️ Actualizado"
            : entry.action === "deleted"
            ? "🗑️ Eliminado"
            : "➕ Creado"}
        </span>
        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
          {entry.restrictionType === "dimension" ? "Dimensión" : "Validación"}
        </span>
      </div>
      <div className="text-slate-500 mt-2">
        {entry.timestamp} • {entry.user}
      </div>
      {entry.reason && (
        <div className="text-slate-600 mt-2 italic line-clamp-2">
          "{entry.reason}"
        </div>
      )}
    </div>
  );

  return (
    <div className="sticky top-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600 mb-4">
          📋 Bitácora Reciente
        </h3>
        <div className="space-y-3">
          {isEmpty ? (
            <p className="text-sm text-slate-600">
              Aún no hay actualizaciones registradas.
            </p>
          ) : (
            <>
              {recentEntries.map((entry) =>
                type === "catalog"
                  ? formatCatalogEntry(entry as ChangeLogEntry)
                  : formatRestrictionEntry(entry as RestrictionChangeLogEntry)
              )}
              {entries.length > 5 && (
                <button
                  onClick={onViewHistory}
                  className="w-full text-center text-sm font-medium text-brand-primary hover:text-brand-primary/80 py-2 border-t border-slate-200 mt-2 transition-colors"
                >
                  Ver historial completo →
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
