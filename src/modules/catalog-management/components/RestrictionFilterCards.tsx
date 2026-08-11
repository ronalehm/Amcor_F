import { ListFilter, Ruler, ListChecks } from "lucide-react";
import {
  getRestrictionCountByType,
} from "../utils/restrictionAdapters";

interface RestrictionFilterCardsProps {
  activeFilter: "all" | "dimension" | "validation";
  onFilterChange: (filter: "all" | "dimension" | "validation") => void;
}

export default function RestrictionFilterCards({
  activeFilter,
  onFilterChange,
}: RestrictionFilterCardsProps) {
  const counts = getRestrictionCountByType();

  const cards = [
    {
      id: "all" as const,
      label: "Todas",
      count: counts.all,
      icon: ListFilter,
    },
    {
      id: "dimension" as const,
      label: "Dimensiones",
      count: counts.dimension,
      icon: Ruler,
    },
    {
      id: "validation" as const,
      label: "Validaciones",
      count: counts.validation,
      icon: ListChecks,
    },
  ];

  return (
    <div className="flex gap-3 flex-wrap">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;
        return (
          <button
            key={card.id}
            onClick={() => onFilterChange(card.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
              isActive
                ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <Icon size={16} />
            <span className="font-medium">
              {card.label}: <span className="font-bold">{card.count}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
