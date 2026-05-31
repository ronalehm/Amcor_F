// src/modules/dashboard/components/QuickCreatePanel.tsx

import { useState, useMemo } from "react";
import ReusableProductCard from "./ReusableProductCard";
import { REUSABLE_PRODUCTS } from "../data/homeMockData";
import type { PackagingType, ReusableProductCondition } from "../data/homeMockData";

type FilterType = "todos" | PackagingType | ReusableProductCondition;

const chipClassName =
  "rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-[#003B5C]/20 hover:bg-[#003B5C]/5 hover:text-[#003B5C] cursor-pointer";

const activeChipClassName =
  "rounded-full border border-[#003B5C] bg-[#003B5C] px-3 py-1.5 text-xs font-medium text-white shadow-sm";

export default function QuickCreatePanel() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("todos");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "todos") return REUSABLE_PRODUCTS;

    return REUSABLE_PRODUCTS.filter((product) => {
      if (activeFilter === "POUCH" || activeFilter === "BOLSA" || activeFilter === "LAMINA") {
        return product.packagingType === activeFilter;
      }
      if (activeFilter === "Producto Base" || activeFilter === "SKU Aprobado") {
        return product.condition === activeFilter;
      }
      return true;
    });
  }, [activeFilter]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Filtros</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter("todos")}
            className={activeFilter === "todos" ? activeChipClassName : chipClassName}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("Producto Base")}
            className={activeFilter === "Producto Base" ? activeChipClassName : chipClassName}
          >
            Producto Base
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("SKU Aprobado")}
            className={activeFilter === "SKU Aprobado" ? activeChipClassName : chipClassName}
          >
            SKU Aprobado
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("POUCH")}
            className={activeFilter === "POUCH" ? activeChipClassName : chipClassName}
          >
            POUCH
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("BOLSA")}
            className={activeFilter === "BOLSA" ? activeChipClassName : chipClassName}
          >
            BOLSA
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("LAMINA")}
            className={activeFilter === "LAMINA" ? activeChipClassName : chipClassName}
          >
            LAMINA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ReusableProductCard key={product.sku} product={product} />
          ))
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
            <p className="text-sm text-slate-600">No se encontraron productos con este filtro.</p>
          </div>
        )}
      </div>
    </section>
  );
}
