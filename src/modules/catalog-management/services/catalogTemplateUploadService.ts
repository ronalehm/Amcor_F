import { CATALOG_REGISTRY } from "../../../shared/catalogs/catalog.registry";
import { getCatalogValues, upsertCatalogValues } from "../../../shared/catalogs/catalog.service";
import type { CatalogValue } from "../../../shared/catalogs/catalog.types";

export interface CatalogChange {
  type: "new" | "modified" | "inactivated" | "blocked";
  catalogCode: string;
  catalogName: string;
  valueCode: string;
  valueName: string;
  previousState?: string;
  newState: string;
  timestamp: string;
  user: string;
}

export interface UploadConfirmationData {
  catalogCode: string;
  changes: CatalogChange[];
  summary: {
    newRecords: number;
    modifiedRecords: number;
    inactivatedRecords: number;
    blockedRecords: number;
    totalChanges: number;
  };
  reason?: string;
  confirmedBy: string;
  confirmedAt: string;
}

export interface UploadResult {
  success: boolean;
  message: string;
  confirmation?: UploadConfirmationData;
  errors?: Array<{
    code: string;
    message: string;
  }>;
}

export class CatalogTemplateUploadService {
  /**
   * Procesa cambios y genera confirmación
   */
  public static async processChanges(
    uploadedData: any[],
    reason?: string,
    currentUser: string = "ODISEO_SYSTEM",
    defaultCatalogCode?: string
  ): Promise<UploadConfirmationData> {
    const changes: CatalogChange[] = [];
    const summary = {
      newRecords: 0,
      modifiedRecords: 0,
      inactivatedRecords: 0,
      blockedRecords: 0,
      totalChanges: 0,
    };

    const currentDate = new Date().toISOString();

    // Procesar cada cambio
    uploadedData.forEach((uploadedValue: any) => {
      // Para plantillas individuales, usar el catalogCode del parámetro
      const catalogCode = uploadedValue["Código Catálogo"] || defaultCatalogCode;
      const valueCode = uploadedValue["Código Valor"];
      const newValue = uploadedValue["Valor"];
      const newDescription = uploadedValue["Descripción"];
      const newState = uploadedValue["Estado"];

      if (!catalogCode || !valueCode || !newValue) return;

      // Obtener datos originales
      const originalValues = getCatalogValues(catalogCode);
      const originalValue = originalValues?.find((v) => v.item === valueCode);

      const catalog = CATALOG_REGISTRY.find((c) => c.code === catalogCode);

      if (!catalog) return;

      // Determinar tipo de cambio
      if (!originalValue) {
        // Nuevo valor
        changes.push({
          type: "new",
          catalogCode,
          catalogName: catalog.name,
          valueCode,
          valueName: newValue,
          newState,
          timestamp: currentDate,
          user: currentUser,
        });
        summary.newRecords++;
      } else if (originalValue.status !== newState) {
        // Cambio de estado
        if (newState === "Inactivo") {
          changes.push({
            type: "inactivated",
            catalogCode,
            catalogName: catalog.name,
            valueCode,
            valueName: newValue,
            previousState: originalValue.status,
            newState,
            timestamp: currentDate,
            user: currentUser,
          });
          summary.inactivatedRecords++;
        } else if (newState === "Bloqueado") {
          changes.push({
            type: "blocked",
            catalogCode,
            catalogName: catalog.name,
            valueCode,
            valueName: newValue,
            previousState: originalValue.status,
            newState,
            timestamp: currentDate,
            user: currentUser,
          });
          summary.blockedRecords++;
        } else {
          // Otro tipo de modificación
          changes.push({
            type: "modified",
            catalogCode,
            catalogName: catalog.name,
            valueCode,
            valueName: newValue,
            previousState: originalValue.status,
            newState,
            timestamp: currentDate,
            user: currentUser,
          });
          summary.modifiedRecords++;
        }
      } else if (originalValue.name !== newValue) {
        // Cambio de valor (nombre)
        changes.push({
          type: "modified",
          catalogCode,
          catalogName: catalog.name,
          valueCode,
          valueName: newValue,
          previousState: originalValue.name,
          newState: newValue,
          timestamp: currentDate,
          user: currentUser,
        });
        summary.modifiedRecords++;
      }
    });

    summary.totalChanges =
      summary.newRecords +
      summary.modifiedRecords +
      summary.inactivatedRecords +
      summary.blockedRecords;

    return {
      catalogCode: "BATCH",
      changes,
      summary,
      reason,
      confirmedBy: currentUser,
      confirmedAt: currentDate,
    };
  }

  /**
   * Confirma y aplica cambios (persistencia)
   */
  public static async confirmChanges(
    confirmation: UploadConfirmationData
  ): Promise<UploadResult> {
    try {
      // Validar que hay cambios
      if (confirmation.changes.length === 0) {
        return {
          success: false,
          message: "No hay cambios para aplicar",
          errors: [
            {
              code: "NO_CHANGES",
              message: "La plantilla no contiene cambios",
            },
          ],
        };
      }

      // Aplicar cambios (simulado - en producción, esto llamaría a un backend)
      const result = await this.applyChangesToStorage(confirmation);

      if (!result.success) {
        return result;
      }

      // Registrar en bitácora (Fase 6)
      this.logChanges(confirmation);

      return {
        success: true,
        message: `Cambios aplicados exitosamente: ${confirmation.summary.totalChanges} cambios registrados`,
        confirmation,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al aplicar cambios: ${error instanceof Error ? error.message : "Error desconocido"}`,
        errors: [
          {
            code: "APPLY_ERROR",
            message: error instanceof Error ? error.message : "Error desconocido",
          },
        ],
      };
    }
  }

  /**
   * Aplica cambios al almacenamiento (simulado)
   */
  private static async applyChangesToStorage(
    confirmation: UploadConfirmationData
  ): Promise<{ success: boolean; message: string }> {
    try {
      // En producción, esto llamaría a un backend endpoint
      // Por ahora, simulamos guardando en localStorage
      const timestamp = new Date().toISOString();
      const key = `catalog_upload_${timestamp}`;

      const uploadRecord = {
        id: key,
        timestamp,
        confirmation,
        status: "confirmed",
        appliedAt: new Date().toISOString(),
      };

      // Guardar en localStorage (para demo)
      const uploads = JSON.parse(localStorage.getItem("catalog_uploads") || "[]");
      uploads.push(uploadRecord);
      localStorage.setItem("catalog_uploads", JSON.stringify(uploads));

      // Aquí se actualizarían los valores en catalog.seed.ts
      // Por ahora, solo registramos la confirmación
      this.updateCatalogValues(confirmation);

      return {
        success: true,
        message: "Cambios aplicados correctamente",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  }

  /**
   * Actualiza valores de catálogos
   */
  private static updateCatalogValues(confirmation: UploadConfirmationData): void {
    // Agrupar cambios por catálogo
    const changesByCode = new Map<string, UploadConfirmationData["changes"]>();

    confirmation.changes.forEach((change) => {
      if (!changesByCode.has(change.catalogCode)) {
        changesByCode.set(change.catalogCode, []);
      }
      changesByCode.get(change.catalogCode)!.push(change);
    });

    // Aplicar cambios a cada catálogo
    changesByCode.forEach((changes, catalogCode) => {
      const rows = changes.map((change) => ({
        item: change.valueCode,
        name: change.valueName,
        status: change.newState as "Activo" | "Inactivo" | "Bloqueado",
      }));

      upsertCatalogValues({
        catalogCode,
        rows,
        user: confirmation.confirmedBy,
        reason: confirmation.reason || "Carga de plantilla Excel",
      });
    });
  }

  /**
   * Registra cambios en bitácora (preparación para Fase 6)
   */
  private static logChanges(confirmation: UploadConfirmationData): void {
    const logEntry = {
      timestamp: confirmation.confirmedAt,
      user: confirmation.confirmedBy,
      totalChanges: confirmation.summary.totalChanges,
      newRecords: confirmation.summary.newRecords,
      modifiedRecords: confirmation.summary.modifiedRecords,
      inactivatedRecords: confirmation.summary.inactivatedRecords,
      blockedRecords: confirmation.summary.blockedRecords,
      reason: confirmation.reason,
      status: "success",
    };

    // Guardar en localStorage (para Fase 6 - Trazabilidad)
    const logs = JSON.parse(localStorage.getItem("catalog_change_logs") || "[]");
    logs.push(logEntry);
    localStorage.setItem("catalog_change_logs", JSON.stringify(logs));
  }

  /**
   * Obtiene el histórico de cambios
   */
  public static getChangeHistory(): any[] {
    try {
      return JSON.parse(localStorage.getItem("catalog_change_logs") || "[]");
    } catch {
      return [];
    }
  }

  /**
   * Obtiene el histórico de uploads
   */
  public static getUploadHistory(): any[] {
    try {
      return JSON.parse(localStorage.getItem("catalog_uploads") || "[]");
    } catch {
      return [];
    }
  }

  /**
   * Limpia históricos (solo para testing)
   */
  public static clearHistory(): void {
    localStorage.removeItem("catalog_uploads");
    localStorage.removeItem("catalog_change_logs");
  }
}

/**
 * Función de utilidad para procesar cambios
 */
export async function processUploadChanges(
  data: any[],
  reason?: string,
  user?: string,
  catalogCode?: string
): Promise<UploadConfirmationData> {
  return CatalogTemplateUploadService.processChanges(data, reason, user, catalogCode);
}

/**
 * Función de utilidad para confirmar cambios
 */
export async function confirmUpload(
  confirmation: UploadConfirmationData
): Promise<UploadResult> {
  return CatalogTemplateUploadService.confirmChanges(confirmation);
}
