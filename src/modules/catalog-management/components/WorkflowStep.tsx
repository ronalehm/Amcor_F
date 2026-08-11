interface WorkflowStepProps {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
  isVisible?: boolean;
}

export default function WorkflowStep({
  number,
  title,
  description,
  children,
  isVisible = true,
}: WorkflowStepProps) {
  if (!isVisible) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary text-white font-bold text-sm">
          {number}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
