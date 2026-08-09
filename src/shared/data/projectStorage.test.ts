import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getProjectRecords,
  updateProjectRecord,
  getProjectByCode,
  clearProjectStorage,
  createProjectFromPortfolio,
  type ProjectRecord,
} from "./projectStorage";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("Project Storage Status Update Bug - QA Test", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("PASSING TEST: Should preserve 'Ficha Completa' status when updating and reading project", () => {
    // Arrange: Create a portfolio for testing
    const portfolio = {
      codigo: "PO-TEST-001",
      nombre: "Test Portfolio",
      clientCode: "CLI-TEST-001",
      clientName: "Test Client",
      cliente: "Test Client",
      planta: "AF Test",
      plantaName: "AF Test",
      envoltura: "POUCH",
      usoFinal: "Test",
      sector: "Test",
      segmento: "Test",
      subsegmento: "Test",
      afMarketId: "12345",
      maquinaCliente: "Test Machine",
    };

    // Act 1: Create a project from portfolio
    const initialData = {
      clasificacion: "Nuevo",
      tipoProyecto: "ICO",
      licitacion: "No" as const,
      skuCode: "SKU-TEST-001-E-00",
    };

    const createdProject = createProjectFromPortfolio({
      portfolio,
      initialData,
    });

    console.log("Created project status:", createdProject.status);
    expect(createdProject.status).toBe("Registrado");

    // Act 2: Update project with status "Ficha Completa" (corrected from "Completado")
    const projectCode = createdProject.code;

    const updatedProjectData: ProjectRecord = {
      ...createdProject,
      status: "Ficha Completa", // This is the correct ProjectStatus
      code: projectCode,
      id: projectCode,
      updatedAt: new Date().toISOString(),
    };

    updateProjectRecord(projectCode, updatedProjectData);

    console.log("DEBUG 1 - Project saved with status: Ficha Completa");

    // Act 3: Retrieve project from getProjectRecords() (what ProductListPage does)
    const allProjects = getProjectRecords();
    const retrievedProject = allProjects.find((p) => p.code === projectCode);

    console.log("DEBUG 2 - Retrieved project status:", retrievedProject?.status);
    console.log("DEBUG 3 - All retrieved project data:", {
      code: retrievedProject?.code,
      status: retrievedProject?.status,
      updatedAt: retrievedProject?.updatedAt,
    });

    // Assert: Status should be "Ficha Completa"
    expect(retrievedProject).toBeDefined();
    expect(retrievedProject?.status).toBe(
      "Ficha Completa",
      "Status should be 'Ficha Completa' after update, got: " +
        retrievedProject?.status
    );
  });

  it("DEFENSIVE TEST: Should handle legacy 'Completado' status gracefully", () => {
    // This test ensures that if legacy data uses "Completado", it gets normalized correctly
    const portfolio = {
      codigo: "PO-TEST-LEGACY",
      nombre: "Test Portfolio Legacy",
      clientCode: "CLI-TEST-LEGACY",
      clientName: "Test Client Legacy",
      cliente: "Test Client Legacy",
      planta: "AF Test",
      plantaName: "AF Test",
      envoltura: "BOLSA",
      usoFinal: "Test",
      sector: "Test",
      segmento: "Test",
      subsegmento: "Test",
      afMarketId: "12347",
      maquinaCliente: "Test Machine",
    };

    const initialData = {
      clasificacion: "Nuevo",
      tipoProyecto: "ICO",
      licitacion: "No" as const,
      skuCode: "SKU-TEST-LEGACY-E-00",
    };

    const createdProject = createProjectFromPortfolio({
      portfolio,
      initialData,
    });

    const projectCode = createdProject.code;

    // Act: Update with legacy "Completado" status
    const updatedProjectData: ProjectRecord = {
      ...createdProject,
      status: "Completado" as any,
      code: projectCode,
      id: projectCode,
      updatedAt: new Date().toISOString(),
    };

    updateProjectRecord(projectCode, updatedProjectData);

    // Assert: Should be normalized to "Ficha Completa"
    const retrieved = getProjectByCode(projectCode);
    expect(retrieved).toBeDefined();
    expect(retrieved?.status).toBe(
      "Ficha Completa",
      "Legacy 'Completado' should normalize to 'Ficha Completa', got: " +
        retrieved?.status
    );
  });

  it("PASSING TEST: getProjectByCode() should return updated 'Ficha Completa' status", () => {
    // Arrange: Create and update a project
    const portfolio = {
      codigo: "PO-TEST-002",
      nombre: "Test Portfolio 2",
      clientCode: "CLI-TEST-002",
      clientName: "Test Client 2",
      cliente: "Test Client 2",
      planta: "AF Test",
      plantaName: "AF Test",
      envoltura: "BOLSA",
      usoFinal: "Test",
      sector: "Test",
      segmento: "Test",
      subsegmento: "Test",
      afMarketId: "12346",
      maquinaCliente: "Test Machine",
    };

    const initialData = {
      clasificacion: "Nuevo",
      tipoProyecto: "RFQ",
      licitacion: "No" as const,
      skuCode: "SKU-TEST-002-E-00",
    };

    const createdProject = createProjectFromPortfolio({
      portfolio,
      initialData,
    });

    const projectCode = createdProject.code;

    // Act: Update with "Ficha Completa"
    updateProjectRecord(projectCode, {
      ...createdProject,
      status: "Ficha Completa",
      code: projectCode,
      id: projectCode,
      updatedAt: new Date().toISOString(),
    });

    // Assert: getProjectByCode should return updated status
    const retrieved = getProjectByCode(projectCode);
    expect(retrieved).toBeDefined();
    expect(retrieved?.status).toBe(
      "Ficha Completa",
      "getProjectByCode() should return status: Ficha Completa"
    );
  });

  it("VALIDATION: Test normalization functions directly", () => {
    // Import and test the normalize functions
    const { normalizeProjectStatus } = require("./projectWorkflow");

    // This should handle "Completado" gracefully
    const result = normalizeProjectStatus("Completado");
    console.log("normalizeProjectStatus('Completado') returns:", result);

    // Currently returns "Registrado" (BUG), should return a valid ProjectStatus
    expect(["Completado", "Ficha Completa", "En Preparación"]).toContain(result);
  });
});
