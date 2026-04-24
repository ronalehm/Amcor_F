interface PreviewRowProps {
  label: string;
  value?: string;
  className?: string;
}

export default function PreviewRow({
  label,
  value,
  className = "",
}: PreviewRowProps) {
  return (
    <div
      className={`grid grid-cols-[90px_1fr] gap-2 border-b border-slate-100 pb-1 ${className}`}
    >
      <span className="text-xs font-bold uppercase text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-700">{value || "—"}</span>
    </div>
  );
}
