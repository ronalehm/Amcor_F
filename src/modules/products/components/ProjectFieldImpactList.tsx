import { useMemo } from "react";
import { AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { PROJECT_FIELD_SCHEMA, type ProjectFieldSchema } from "../../../shared/data/projectFieldSchema";
import { getFieldImpactLevel, type WorkArea } from "../../../shared/data/projectFieldImpactConfig";

interface ProjectFieldImpactListProps {
  projectData: Record<string, unknown>;
  area: WorkArea;
  highlightedField?: string;
  onFieldClick?: (fieldKey: string) => void;
}

export default function ProjectFieldImpactList({
  projectData,
  area,
  highlightedField,
  onFieldClick,
}: ProjectFieldImpactListProps) {
  const impactedFields = useMemo(() => {
    return PROJECT_FIELD_SCHEMA.filter((field) =>
      field.impactedAreas.includes(area)
    );
  }, [area]);

  const groupedBySection = useMemo(() => {
    const groups: Record<string, ProjectFieldSchema[]> = {};
    impactedFields.forEach((field) => {
      if (!groups[field.section]) {
        groups[field.section] = [];
      }
      groups[field.section].push(field);
    });
    return groups;
  }, [impactedFields]);

  const getFieldStatus = (field: ProjectFieldSchema) => {
    const value = projectData[field.key];
    const hasValue = value !== undefined && value !== null && value !== "";
    const impactLevel = getFieldImpactLevel(field.key, area);

    return { hasValue, impactLevel };
  };

  const getImpactColor = (level?: string) => {
    switch (level) {
      case "alta":
        return "bg-red-100 text-red-700 border-red-200";
      case "media":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "baja":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getImpactBadge = (level?: string) => {
    switch (level) {
      case "alta":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
            <AlertCircle className="mr-1 h-3 w-3" />
            Alta
          </span>
        );
      case "media":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            <Info className="mr-1 h-3 w-3" />
            Media
          </span>
        );
      case "baja":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            <Info className="mr-1 h-3 w-3" />
            Baja
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            Info
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(groupedBySection).map(([section, fields]) => (
        <div
          key={section}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="bg-slate-50 px-4 py-3">
            <h4 className="font-bold text-slate-700">{section}</h4>
          </div>
          <div className="divide-y divide-slate-100">
            {fields.map((field) => {
              const { hasValue, impactLevel } = getFieldStatus(field);
              const isHighlighted = highlightedField === field.key;

              return (
                <button
                  key={field.key}
                  onClick={() => onFieldClick?.(field.key)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                    isHighlighted ? "bg-amber-50 ring-2 ring-amber-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        hasValue
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {hasValue ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {field.label}
                        {field.required && (
                          <span className="ml-1 text-red-400">*</span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">
                        Fuente: {field.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getImpactBadge(impactLevel)}
                    {field.editable && (
                      <span className="text-xs text-slate-400">Editable</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {impactedFields.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500">No hay campos impactados para esta área</p>
        </div>
      )}
    </div>
  );
}
