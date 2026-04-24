import type { ReactNode } from "react";

type FormSectionProps = {
  step: string;
  title: string;
  icon: string;
  color: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function FormSection({
  step,
  title,
  icon,
  color,
  description,
  children,
  className = "",
  contentClassName = "",
}: FormSectionProps) {
  return (
    <section
      className={`overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div
        className="flex items-start gap-3 border-b border-slate-200 px-5 py-4"
        style={{ borderTop: `4px solid ${color}` }}
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {icon}
        </div>

        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Paso {step}
          </div>

          <h2
            className="text-sm font-bold uppercase tracking-wide"
            style={{ color }}
          >
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>

      <div className={`p-5 ${contentClassName}`}>{children}</div>
    </section>
  );
}
