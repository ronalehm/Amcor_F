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
      .slice(0, 4);
  }, [items]);

  const urgentItem = sortedItems[0];
  const nextItems = sortedItems.slice(1, 4);
  const pendingCount = countPendingItems(items);

  return (
    <section className="rounded-2xl border border-[#003B5C]/10 bg-[#003B5C]/5 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-900">
          Mi bandeja
        </h2>

        <span className="inline-flex shrink-0 items-center rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          {pendingCount} pendientes
        </span>
      </div>

      {urgentItem && (
        <article className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm mb-3">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-red-600 mb-1">PRIORITARIO</p>
              <h3 className="text-sm font-bold text-slate-900">
                {urgentItem.code}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {urgentItem.product}
              </p>
            </div>

            <span
              className={[
                "shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
                getStatusClass(urgentItem.status),
              ].join(" ")}
            >
              {urgentItem.status}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate(urgentItem.route)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-red-700"
          >
            {urgentItem.actionLabel}
            <ArrowRight size={14} />
          </button>
        </article>
      )}

      {nextItems.length > 0 && (
        <div className="space-y-2">
          {nextItems.map((item) => (
            <article
              key={item.code}
              className="rounded-lg border border-slate-100 bg-white px-3 py-2.5 shadow-sm transition hover:border-slate-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 gap-y-0">
                    <span className="text-xs font-bold text-slate-900">
                      {item.code}
                    </span>
                    <span
                      className={[
                        "rounded-full border px-1.5 py-0.5 text-[9px] font-semibold",
                        getStatusClass(item.status),
                      ].join(" ")}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    {item.product}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate(item.route)}
                className="w-full inline-flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-bold text-slate-700 transition hover:bg-slate-50"
              >
                {item.actionLabel}
                <ArrowRight size={12} />
              </button>
            </article>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate("/products")}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-[11px] font-bold text-[#003B5C] transition hover:bg-white"
      >
        Ver toda
        <ArrowRight size={12} />
      </button>
    </section>
  );
}
