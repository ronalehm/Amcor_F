import type { ReactNode } from "react";
import FlowStep from "./FlowStep.tsx";

type StepConfig = {
  number: string;
  title: string;
  description: string;
  completed: boolean;
  color: string;
};

type FlowGuideProps = {
  title?: string;
  subtitle?: string;
  tip?: string | ReactNode;
  steps: StepConfig[];
  className?: string;
  showTip?: boolean;
};

export default function FlowGuide({
  title = "Ruta de registro",
  subtitle = "Completa la ficha en este orden para evitar reprocesos.",
  tip = (
    <>
      <strong>Tip:</strong> empieza por el cliente. Luego la ficha se vuelve
      más fácil de completar porque los catálogos guían las selecciones.
    </>
  ),
  steps,
  className = "",
  showTip = true,
}: FlowGuideProps) {
  return (
    <aside className={`hidden xl:block ${className}`}>
      <div className="sticky top-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-800">
            {title}
          </h2>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <FlowStep
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              completed={step.completed}
              color={step.color}
            />
          ))}
        </div>

        {showTip && tip && (
          <div className="mt-5 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
            {tip}
          </div>
        )}
      </div>
    </aside>
  );
}

export { FlowStep };
export type { StepConfig };
