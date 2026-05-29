import { useMemo } from "react";
import { CheckCircle2, AlertCircle, XCircle, AlertTriangle } from "lucide-react";
import { getFieldsByArea, type WorkArea } from "../../../shared/data/projectFieldImpactConfig";
import { validateProjectByArea } from "../../../shared/data/projectValidationRules";

interface ProjectAreaValidationPanelProps {
  projectData: Record<string, unknown>;
  currentArea: WorkArea;
  onFieldClick?: (fieldKey: string) => void;
}

const AREA_COLORS: Record<WorkArea, { bg: string; border: string; text: string; icon: string }> = {
  "P1 - Comercial": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "text-blue-600" },
  "P2 - Artes Gráficas": { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: "text-purple-600" },
  "P3 - R&D": { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: "text-green-600" },
  "P4 - Commercial Finance": { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "text-amber-600" },
  "P5 - Crédito / Cierre": { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", icon: "text-teal-600" },
};

export default function ProjectAreaValidationPanel({
  projectData,
  currentArea,
  onFieldClick,
}: ProjectAreaValidationPanelProps) {
  const areaFields = useMemo(() => getFieldsByArea(currentArea), [currentArea]);
  
  const validation = useMemo(() => {
    return validateProjectByArea(projectData, currentArea);
  }, [projectData, currentArea]);

  const completionPercentage = useMemo(() => {
    const requiredFields = areaFields.filter((f) => f.required);
    if (requiredFields.length === 0) return 100;
    
    const completed = requiredFields.filter((field) => {
      const value = projectData[field.fieldKey];
      return value !== undefined && value !== null && value !== "";
    }).length;
    
    return Math.round((completed / requiredFields.length) * 100);
  }, [areaFields, projectData]);

  const colors = AREA_COLORS[currentArea];

  const getFieldStatus = (fieldKey: string) => {
    const value = projectData[fieldKey];
    const hasValue = value !== undefined && value !== null && value !== "";
    const hasError = validation.errors[fieldKey];
    
    if (hasError) return { icon: XCircle, color: "text-red-500", bg: "bg-red-50" };
    if (hasValue) return { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" };
    return { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" };
  };

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden`}>
      <div className="px-4 py-3 border-b border-inherit">
        <div className="flex items-center justify-between">
          <h3 className={`font-bold ${colors.text}`}>{currentArea}</h3>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${colors.text}`}>
              {completionPercentage}%
            </span>
            <div className="h-2 w-16 rounded-full bg-white/50">
              <div
                className={`h-2 rounded-full ${
                  completionPercentage === 100 ? "bg-green-500" : colors.text.replace("text-", "bg-")
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-h-[300px] overflow-y-auto p-2">
        <div className="space-y-1">
          {areaFields.map((field) => {
            const status = getFieldStatus(field.fieldKey);
            const Icon = status.icon;
            
            return (
              <button
                key={field.fieldKey}
                onClick={() => onFieldClick?.(field.fieldKey)}
                className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-white/50 ${
                  field.editable ? "cursor-pointer" : "cursor-default opacity-70"
                }`}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded-full ${status.bg}`}>
                  <Icon className={`h-3 w-3 ${status.color}`} />
                </div>
                <span className="flex-1 text-slate-700">{field.label}</span>
                {field.required && (
                  <span className="text-xs text-red-400">*</span>
                )}
                {field.editable ? (
                  <span className="text-xs text-green-600">Editable</span>
                ) : (
                  <span className="text-xs text-slate-400">Solo lectura</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {Object.keys(validation.errors).length > 0 && (
        <div className="border-t border-inherit px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 text-red-500" />
            <div className="text-sm text-red-700">
              <p className="font-medium">Campos pendientes:</p>
              <ul className="mt-1 space-y-0.5">
                {Object.entries(validation.errors).slice(0, 3).map(([key, msg]) => (
                  <li key={key} className="text-xs">• {msg}</li>
                ))}
                {Object.keys(validation.errors).length > 3 && (
                  <li className="text-xs">
                    +{Object.keys(validation.errors).length - 3} más...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
