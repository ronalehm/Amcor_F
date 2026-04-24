import type { ReactNode } from "react";

type FormCardProps = {
  title: string;
  icon: string;
  color: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
};

export default function FormCard({
  title,
  icon,
  color,
  required = false,
  children,
  className = "",
  contentClassName = "",
  headerClassName = "",
}: FormCardProps) {
  return (
    <section
      className={`overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div
        className={`flex items-center justify-between border-b border-slate-100 px-5 py-4 ${headerClassName}`}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {icon}
          </span>

          <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
            {title}
          </h2>
        </div>

        {required && <span className="text-red-500">*</span>}
      </div>

      <div className={`p-5 ${contentClassName}`}>{children}</div>
    </section>
  );
}
