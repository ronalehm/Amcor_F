type FlowStepProps = {
  number: string;
  title: string;
  description: string;
  completed: boolean;
  color: string;
  className?: string;
};

export default function FlowStep({
  number,
  title,
  description,
  completed,
  color,
  className = "",
}: FlowStepProps) {
  return (
    <div
      className={`flex gap-3 rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 ${className}`}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white transition-colors"
        style={{
          backgroundColor: completed ? "#27ae60" : color,
        }}
      >
        {completed ? "✓" : number}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-slate-800">{title}</div>
        <div className="mt-0.5 text-xs text-slate-500">{description}</div>
      </div>
    </div>
  );
}
