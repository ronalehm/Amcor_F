type PreviewItem = {
  label: string;
  value?: string;
};

type PortfolioPreviewProps = {
  codigo: string;
  estado: string;
  completionPercentage: number;
  items: PreviewItem[];
  title?: string;
  subtitle?: string;
  emptyStateText?: string;
  emptyStateIcon?: string;
  className?: string;
};

function PreviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-2 border-b border-slate-100 pb-1 last:border-0">
      <span className="text-xs font-bold uppercase text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-700">{value || "—"}</span>
    </div>
  );
}

export default function PortfolioPreview({
  codigo,
  estado,
  completionPercentage,
  items,
  title = "Vista rápida",
  subtitle = "Resumen del portafolio en creación",
  emptyStateText = "Complete identificación para previsualizar",
  emptyStateIcon = "◧",
  className = "",
}: PortfolioPreviewProps) {
  const hasPreview = items.some((item) => item.value);

  if (!hasPreview) {
    return (
      <div
        className={`flex min-h-[155px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-5 text-center shadow-sm ${className}`}
      >
        <div>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl text-slate-400">
            {emptyStateIcon}
          </div>
          <p className="text-sm font-bold text-slate-500">{emptyStateText}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
            {title}
          </h3>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>

        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
          {completionPercentage}%
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <PreviewRow label="Código" value={codigo} />
        <PreviewRow label="Estado" value={estado} />
        {items.map((item, index) => (
          <PreviewRow key={index} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
}

export { PreviewRow };
export type { PreviewItem };
