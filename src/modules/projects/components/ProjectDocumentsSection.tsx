import { useEffect, useRef, useState } from "react";
import type { ProjectDocument } from "../../../shared/data/projectDocumentStorage";
import {
  getDocumentsByProject,
  saveDocument,
  deleteDocument,
  generateDocumentId,
} from "../../../shared/data/projectDocumentStorage";
import ActionButton from "../../../shared/components/buttons/ActionButton";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const DOCUMENTOS_EXTENSIONS = ["doc", "docx", "xls", "xlsx", "txt", "pdf"];
const PLANOS_EXTENSIONS = ["ai", "zip", "links", "pdf"];

interface ProjectDocumentsSectionProps {
  projectCode: string;
}

interface DocumentType {
  type: "documentos" | "planos";
  label: string;
  extensions: string[];
  icon: string;
}

const DOCUMENT_TYPES: DocumentType[] = [
  { type: "documentos", label: "Documentos", extensions: DOCUMENTOS_EXTENSIONS, icon: "📄" },
  { type: "planos", label: "Planos", extensions: PLANOS_EXTENSIONS, icon: "📐" },
];

export default function ProjectDocumentsSection({
  projectCode,
}: ProjectDocumentsSectionProps) {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [isDraggingDocumentos, setIsDraggingDocumentos] = useState(false);
  const [isDraggingPlanos, setIsDraggingPlanos] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const fileInputDocumentosRef = useRef<HTMLInputElement>(null);
  const fileInputPlanosRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDocuments(getDocumentsByProject(projectCode));
  }, [projectCode]);

  const getFileExtension = (fileName: string): string => {
    const extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    return extension;
  };

  const validateFile = (file: File, allowedExtensions: string[]): string | null => {
    if (file.size === 0) {
      return `${file.name}: El archivo no puede estar vacío.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return `${file.name}: Tamaño ${sizeMB}MB excede límite de 10MB.`;
    }

    const ext = getFileExtension(file.name);
    if (!allowedExtensions.includes(ext)) {
      const validExts = allowedExtensions.join(", ");
      return `${file.name}: Formato no válido. Permitidos: ${validExts}`;
    }

    return null;
  };

  const processFiles = (files: File[], allowedExtensions: string[]) => {
    const errors: string[] = [];
    const toUpload: File[] = [];

    for (const file of files) {
      const error = validateFile(file, allowedExtensions);
      if (error) {
        errors.push(error);
      } else {
        toUpload.push(file);
      }
    }

    if (errors.length > 0) {
      setUploadErrors(errors);
      setTimeout(() => setUploadErrors([]), 5000);
      return;
    }

    toUpload.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const extension = "." + getFileExtension(file.name);
        const newDoc: ProjectDocument = {
          id: generateDocumentId(),
          projectCode,
          fileName: file.name,
          fileType: file.type || "application/octet-stream",
          fileExtension: extension || "file",
          fileSize: file.size,
          base64Data: base64,
          uploadedAt: new Date().toISOString(),
        };

        saveDocument(newDoc);
        setDocuments(getDocumentsByProject(projectCode));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent, setDragging: (state: boolean) => void) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (setDragging: (state: boolean) => void) => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent, setDragging: (state: boolean) => void, extensions: string[]) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files, extensions);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, extensions: string[]) => {
    const files = Array.from(e.currentTarget.files || []);
    processFiles(files, extensions);
    e.currentTarget.value = "";
  };

  const handleDownloadDocument = (doc: ProjectDocument) => {
    try {
      const base64WithoutPrefix = doc.base64Data.split(",")[1] || doc.base64Data;
      const binaryString = atob(base64WithoutPrefix);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: doc.fileType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error descargando documento:", error);
    }
  };

  const handleDeleteDocument = (docId: string) => {
    deleteDocument(docId);
    setDocuments(getDocumentsByProject(projectCode));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const DocumentTypeSection = ({ docType }: { docType: DocumentType }) => {
    const filteredDocs = documents.filter((doc) => {
      const ext = getFileExtension(doc.fileName);
      return docType.extensions.includes(ext);
    });

    const isDragging = docType.type === "documentos" ? isDraggingDocumentos : isDraggingPlanos;
    const setIsDragging = docType.type === "documentos" ? setIsDraggingDocumentos : setIsDraggingPlanos;
    const fileInputRef = docType.type === "documentos" ? fileInputDocumentosRef : fileInputPlanosRef;

    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{docType.icon}</span>
          <h3 className="text-sm font-bold uppercase text-slate-700">{docType.label}</h3>
          <span className="text-xs text-slate-500">({docType.extensions.join(", ")})</span>
        </div>

        {/* Drag & drop area */}
        <div
          onDragOver={(e) => handleDragOver(e, setIsDragging)}
          onDragLeave={() => handleDragLeave(setIsDragging)}
          onDrop={(e) => handleDrop(e, setIsDragging, docType.extensions)}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-brand-primary bg-blue-50 shadow-sm"
              : "border-slate-300 hover:border-brand-primary hover:bg-white"
          }`}
        >
          <p className="text-sm font-semibold text-slate-600 mb-2">
            Soltar archivos para subir
          </p>
          <p className="text-xs text-slate-500 mb-3">o</p>
          <ActionButton
            type="button"
            label="Seleccionar Archivos"
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            size="sm"
          />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => handleFileInputChange(e, docType.extensions)}
          />
        </div>

        {/* File list */}
        {filteredDocs.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-600 uppercase">
              Archivos cargados ({filteredDocs.length})
            </p>
            <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600">
                      Nombre
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 w-16">
                      Tipo
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 w-24">
                      Tamaño
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-600 w-28">
                      Fecha
                    </th>
                    <th className="px-3 py-2 text-center font-semibold text-slate-600 w-32">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-3 py-3 text-slate-700 truncate max-w-xs">
                        {doc.fileName}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {doc.fileExtension.replace(".", "").toUpperCase() || "file"}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {formatFileSize(doc.fileSize)}
                      </td>
                      <td className="px-3 py-3 text-slate-600 text-xs">
                        {formatDate(doc.uploadedAt)}
                      </td>
                      <td className="px-3 py-3 text-center flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadDocument(doc)}
                          title="Descargar"
                          className="text-blue-600 hover:text-blue-700 font-medium text-xs hover:underline"
                        >
                          ⬇ Descargar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDocument(doc.id)}
                          title="Eliminar"
                          className="text-red-600 hover:text-red-700 font-medium text-xs hover:underline"
                        >
                          ✕ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-slate-500">
              No hay {docType.label.toLowerCase()} cargados.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
          style={{ backgroundColor: "#0d4c5c15", color: "#0d4c5c" }}
        >
          📦
        </span>
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-800">
          Documentos y Planos
        </h2>
      </div>

      <div className="p-5 space-y-4">
        {/* Error messages */}
        {uploadErrors.length > 0 && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
            <p className="text-xs font-bold text-red-700 mb-2">Errores al cargar:</p>
            <ul className="space-y-1">
              {uploadErrors.map((error, idx) => (
                <li key={idx} className="text-xs text-red-600">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Document sections */}
        <div className="space-y-4">
          {DOCUMENT_TYPES.map((docType) => (
            <DocumentTypeSection key={docType.type} docType={docType} />
          ))}
        </div>

        {/* Download all button */}
        {documents.length > 0 && (
          <div className="flex justify-end pt-2">
            <ActionButton
              type="button"
              label="Descargar Todo"
              onClick={() => {
                documents.forEach((doc, idx) => {
                  setTimeout(() => {
                    handleDownloadDocument(doc);
                  }, idx * 200);
                });
              }}
              variant="primary"
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
