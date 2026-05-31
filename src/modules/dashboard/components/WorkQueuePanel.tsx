// src/modules/dashboard/components/WorkQueuePanel.tsx

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { WorkQueueItem } from "../data/homeMockData";

type WorkQueuePanelProps = {
  items: WorkQueueItem[];
};

const priorityOrder: Record<WorkQueueItem["priority"], number> = {
  Alta: 1,
  Media: 2,
  Baja: 3,
};

const getStatusClass = (status: WorkQueueItem["status"]) => {
  if (status === "Registrado") {
    return "bg-blue-50 text-blue-700 border-blue-100";
  }

  if (status === "En preparación") {
    return "bg-amber-50 text-amber-700 border-amber-100";
  }

  if (status === "Completado") {
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  }

  return "bg-slate-50 text-slate-600 border-slate-200";
};

const getIntegrationBadgeClass = (integrationStatus: WorkQueueItem["integrationStatus"]) => {
  if (integrationStatus === "Enviado a Sistema Integral") {
    return "bg-green-50 text-green-700";
  }
  if (integrationStatus === "Pendiente de envío") {
    return "bg-orange-50 text-orange-700";
  }
  if (integrationStatus === "Error de envío") {
    return "bg-red-50 text-red-700";
  }
  return "bg-slate-50 text-slate-600";
};

const countPendingItems = (items: WorkQueueItem[]) => {
  return items.filter((item) => {
    if (item.status === "Registrado" || item.status === "En preparación") return true;
    if (item.status === "Completado" && item.integrationStatus === "Pendiente de envío") return true;
    if (item.integrationStatus === "Error de envío") return true;
    return false;
  }).length;
};

export default function WorkQueuePanel({ items }: WorkQueuePanelProps) {
  const navigate = useNavigate();

  const sortedItems = useMemo(() => {
    return [...items]
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      .slice(0, 5);
  }, [items]);

  const pendingCount = countPendingItems(items);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          {pendingCount} pendientes
        </span>
      </div>

      {sortedItems.length > 0 ? (
        <div className="space-y-3">
          {sortedItems.map((item, index) => (
            <article
              key={item.code}
              className={[
                "rounded-xl border p-3 transition-all",
                index === 0
                  ? "border-red-200 bg-red-50"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md",
              ].join(" ")}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{item.code}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-600">{item.product}</p>
                </div>

                <span
                  className={[
                    "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                    getStatusClass(item.status),
                  ].join(" ")}
                >
                  {item.status}
                </span>
              </div>

              <div className="mb-2 space-y-1 text-xs text-slate-600">
                <p>
                  <span className="font-medium text-slate-700">Tipo:</span> {item.requestType}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Etapa:</span> {item.bpmStage}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Responsable:</span> {item.responsibleArea}
                </p>
              </div>

              <div className="mb-2 flex gap-2">
                <span
                  className={[
                    "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                    getIntegrationBadgeClass(item.integrationStatus),
                  ].join(" ")}
                >
                  {item.integrationStatus}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-xs text-slate-500">{item.dueLabel}</p>

                <button
                  type="button"
                  onClick={() => navigate(item.route)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  {item.actionLabel}
                  <ArrowRight size={12} />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
          <p className="text-sm text-slate-600">No hay productos en tu bandeja.</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate("/products")}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Ver toda mi bandeja
        <ArrowRight size={14} />
      </button>
    </section>
  );
}
