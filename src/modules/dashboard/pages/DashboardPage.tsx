// src/modules/dashboard/pages/DashboardPage.tsx

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Search } from "lucide-react";

import { useLayout } from "../../../components/layout/LayoutContext";
import QuickCreatePanel from "../components/QuickCreatePanel";
import WorkQueuePanel from "../components/WorkQueuePanel";
import ProductPreliminaryCreateModal from "../../../shared/components/modals/ProductPreliminaryCreateModal";
import { ProductActionButton } from "../../../shared/components/ProductActionButton";

import { WORK_QUEUE } from "../data/homeMockData";

function DashboardCommandBar() {

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const value = String(formData.get("search") ?? "").trim();

    if (!value) return;

    console.log("Buscar en ODISEO:", value);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Portal Web ODISEO
        </h1>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            name="search"
            type="text"
            placeholder="Buscar cliente, producto, SKU, portafolio o rubro..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#003B5C] focus:ring-2 focus:ring-[#003B5C]/10"
          />
        </div>

        <ProductActionButton source="dashboard" />
      </form>
    </div>
  );
}

export default function DashboardPage() {
  const { setHeader, resetHeader } = useLayout();

  const [isPreliminaryProductModalOpen, setIsPreliminaryProductModalOpen] =
    useState(false);

  useEffect(() => {
    setHeader({
      title: "Portal Web ODISEO",
      subtitle: undefined,
      toolbar: <DashboardCommandBar />,
    });

    return () => resetHeader();
  }, [setHeader, resetHeader]);

  return (
    <>
      <div className="w-full space-y-6">
        {/* Grid principal: Reutilizar base (izq) + Mi bandeja (der) */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.85fr]">
          {/* Columna izquierda: Reutilizar bases aprobadas */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              Crear desde base aprobada
            </h2>
            <p className="text-xs text-slate-500">
              Reutiliza productos aprobados como base para avanzar más rápido.
            </p>
            <QuickCreatePanel />
          </section>

          {/* Columna derecha: Mi bandeja */}
          <WorkQueuePanel items={WORK_QUEUE} />
        </div>
      </div>

      <ProductPreliminaryCreateModal
        isOpen={isPreliminaryProductModalOpen}
        onClose={() => setIsPreliminaryProductModalOpen(false)}
        onProductCreated={() => setIsPreliminaryProductModalOpen(false)}
      />
    </>
  );
}