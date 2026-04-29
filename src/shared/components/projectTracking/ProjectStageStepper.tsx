import { type ProjectStage, PORTAL_PROJECT_STAGES, SI_PROJECT_STAGES, isPortalStage } from "../../../shared/data/projectStageConfig";
import { Check } from "lucide-react";

interface ProjectStageStepperProps {
  currentStage: ProjectStage;
}

export default function ProjectStageStepper({ currentStage }: ProjectStageStepperProps) {
  const currentIsPortal = isPortalStage(currentStage);
  
  const getStageStatus = (stageId: ProjectStage) => {
    const isPortal = isPortalStage(stageId);
    
    // If we are currently in Portal and evaluating SI stage, it's pending
    if (currentIsPortal && !isPortal) return "pending";
    // If we are in SI and evaluating Portal stage, it's completed
    if (!currentIsPortal && isPortal) return "completed";
    
    // Both in same block (Portal vs SI)
    const stages = isPortal ? PORTAL_PROJECT_STAGES : SI_PROJECT_STAGES;
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    const targetIndex = stages.findIndex(s => s.id === stageId);
    
    if (targetIndex < currentIndex) return "completed";
    if (targetIndex === currentIndex) return "current";
    return "pending";
  };

  const renderStages = (stages: any[], title: string, isPortalTracker: boolean) => (
    <div className={`flex-1 rounded-xl p-4 border ${isPortalTracker ? 'bg-white border-brand-primary/20 shadow-sm' : 'bg-slate-50 border-slate-200'}`}>
      <h3 className={`text-xs font-bold uppercase tracking-wider mb-4 ${isPortalTracker ? 'text-brand-primary' : 'text-slate-500'}`}>
        {title}
      </h3>
      <div className="flex justify-between relative">
        <div className="absolute top-4 left-0 w-full h-[2px] bg-slate-200 -z-10"></div>
        {stages.map((stage) => {
          const status = getStageStatus(stage.id);
          return (
            <div key={stage.id} className="flex flex-col items-center flex-1 z-10 group cursor-help" title={stage.description}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                status === "completed" ? "bg-[#27ae60] border-[#27ae60] text-white" :
                status === "current" ? "bg-white border-brand-primary text-brand-primary" :
                "bg-white border-slate-300 text-slate-400"
              }`}>
                {status === "completed" ? <Check size={14} /> : stage.id.replace('P', '')}
              </div>
              <div className={`mt-2 text-[10px] text-center font-bold px-1 ${
                status === "completed" ? "text-[#27ae60]" :
                status === "current" ? "text-brand-primary" :
                "text-slate-400"
              }`}>
                {stage.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col xl:flex-row gap-4 w-full">
      {renderStages(PORTAL_PROJECT_STAGES, "Tracking Portal Web (Operativo)", true)}
      {renderStages(SI_PROJECT_STAGES, "Seguimiento Sistema Integral (Externo)", false)}
    </div>
  );
}
