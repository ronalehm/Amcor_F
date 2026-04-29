import { useState } from "react";
import Button from "../ui/Button";

type FormActionButtonsProps = {
  cancelLabel?: string;
  submitLabel?: string;
  onCancel: () => void;
  validationErrorList?: string[];
  submitAttempted?: boolean;
  validationTitle?: string;
  isLoading?: boolean;
};

export default function FormActionButtons({
  cancelLabel = "Cancelar",
  submitLabel = "Guardar Portafolio",
  onCancel,
  validationErrorList = [],
  submitAttempted = false,
  validationTitle = "Faltan campos obligatorios.",
  isLoading = false,
}: FormActionButtonsProps) {
  const [isHovered, setIsHovered] = useState(false);

  const shouldShowPopover =
    validationErrorList.length > 0 && (isHovered || submitAttempted);

  return (
    <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>

      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {shouldShowPopover && (
          <div className="absolute bottom-full right-0 z-50 mb-2 w-96 rounded-lg border border-red-200 bg-slate-100 px-4 py-3 text-sm text-red-700 shadow-xl">
            <p className="font-bold">{validationTitle}</p>

            <ul className="mt-2 list-disc space-y-1 pl-5">
              {validationErrorList.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading || validationErrorList.length > 0}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}