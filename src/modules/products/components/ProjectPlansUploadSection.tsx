type LooseProps = {
  className?: string;
  [key: string]: unknown;
};

function ProjectPlansUploadSection({ className = "" }: LooseProps) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-slate-900">Carga de planos</h3>
      <p className="mt-1 text-xs text-slate-500">
        Sección temporal para cargar o visualizar planos del proyecto.
      </p>
    </section>
  );
}

export default ProjectPlansUploadSection;
