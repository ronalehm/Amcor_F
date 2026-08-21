import { describe, it, expect } from "vitest";
import { APPROVED_PRODUCTS, searchApprovedProducts } from "../../src/shared/data/approvedProductStorage";

describe("SKU Base y Aprobados - Verificación de Datos", () => {

  it("QA-SKU-01: Verificar que existan productos SKU Aprobados para Modificado", () => {
    console.log("\n═══════════════════════════════════════════");
    console.log("QA-SKU-01: Productos SKU Aprobados");
    console.log("═══════════════════════════════════════════\n");

    // Buscar productos aprobados para ALICORP en portafolio Carnes importadas
    const approvedProducts = searchApprovedProducts({
      portfolioCode: "PO-000011",
      productType: "approved",
      status: "Activo",
    });

    console.log(`✓ Se encontraron ${approvedProducts.length} productos aprobados`);
    console.log("📋 Productos encontrados:");

    approvedProducts.forEach((product) => {
      console.log(
        `  - ${product.code}: ${product.name} (${product.clientName})`
      );
    });

    // Verificar que hay al menos 4 productos aprobados
    expect(approvedProducts.length).toBeGreaterThanOrEqual(4);

    // Verificar que todos sean del cliente Alicorp
    approvedProducts.forEach((product) => {
      expect(product.clientCode).toBe("CL-000001");
      expect(product.clientName).toBe("Alicorp S.A.A.");
      expect(product.type).toBe("approved");
      expect(product.status).toBe("Activo");
    });

    // Verificar que existen específicamente los productos de prueba
    const codes = approvedProducts.map((p) => p.code);
    expect(codes).toContain("SKU-00020-A");
    expect(codes).toContain("SKU-00021-A");

    console.log("\n✅ QA-SKU-01 PASADO: Todos los productos aprobados están disponibles\n");
  });

  it("QA-SKU-02: Verificar que existan productos SKU Base para Nuevo", () => {
    console.log("\n═══════════════════════════════════════════");
    console.log("QA-SKU-02: Productos SKU Base");
    console.log("═══════════════════════════════════════════\n");

    // Buscar productos base para ALICORP en portafolio Carnes importadas
    const baseProducts = searchApprovedProducts({
      portfolioCode: "PO-000011",
      productType: "base",
      status: "Activo",
    });

    console.log(`✓ Se encontraron ${baseProducts.length} productos base`);
    console.log("📋 Productos encontrados:");

    baseProducts.forEach((product) => {
      console.log(
        `  - ${product.code}: ${product.name} (${product.clientName})`
      );
    });

    // Verificar que hay al menos 4 productos base
    expect(baseProducts.length).toBeGreaterThanOrEqual(4);

    // Verificar que todos sean del cliente Alicorp
    baseProducts.forEach((product) => {
      expect(product.clientCode).toBe("CL-000001");
      expect(product.clientName).toBe("Alicorp S.A.A.");
      expect(product.type).toBe("base");
      expect(product.status).toBe("Activo");
    });

    // Verificar que existen específicamente los productos de prueba
    const codes = baseProducts.map((p) => p.code);
    expect(codes).toContain("SKU-00008-B");
    expect(codes).toContain("SKU-00009-B");

    console.log("\n✅ QA-SKU-02 PASADO: Todos los productos base están disponibles\n");
  });

  it("QA-SKU-03: Verificar datos completos de cada producto", () => {
    console.log("\n═══════════════════════════════════════════");
    console.log("QA-SKU-03: Validación de Datos Completos");
    console.log("═══════════════════════════════════════════\n");

    const requiredProducts = [
      { code: "SKU-00020-A", type: "approved", name: "Mayonesa Light" },
      { code: "SKU-00021-A", type: "approved", name: "Salsa BBQ" },
      { code: "SKU-00008-B", type: "base", name: "Salsa de Soja Base" },
      { code: "SKU-00009-B", type: "base", name: "Ketchup Base" },
    ];

    requiredProducts.forEach(({ code, type, name }) => {
      const product = APPROVED_PRODUCTS.find((p) => p.code === code);

      expect(product).toBeDefined();
      expect(product?.code).toBe(code);
      expect(product?.type).toBe(type);
      expect(product?.name).toContain(name);
      expect(product?.portfolioCode).toBe("PO-000011");
      expect(product?.clientCode).toBe("CL-000001");
      expect(product?.clientName).toBe("Alicorp S.A.A.");
      expect(product?.status).toBe("Activo");

      console.log(
        `✅ ${code}: ${product?.name} (Portafolio: ${product?.portfolioCode}, Cliente: ${product?.clientCode})`
      );
    });

    console.log("\n✅ QA-SKU-03 PASADO: Todos los datos están completos y correctos\n");
  });

  it("QA-SKU-04: Verificar filtrado funciona correctamente", () => {
    console.log("\n═══════════════════════════════════════════");
    console.log("QA-SKU-04: Validación de Filtrado");
    console.log("═══════════════════════════════════════════\n");

    // Test 1: Filtrar solo productos activos
    const activeProducts = searchApprovedProducts({
      portfolioCode: "PO-000011",
      status: "Activo",
    });
    console.log(`✓ Productos activos: ${activeProducts.length}`);
    activeProducts.forEach((p) => {
      expect(p.status).toBe("Activo");
    });

    // Test 2: Filtrar por tipo "approved"
    const approved = searchApprovedProducts({
      portfolioCode: "PO-000011",
      productType: "approved",
      status: "Activo",
    });
    console.log(`✓ Productos aprobados: ${approved.length}`);
    approved.forEach((p) => {
      expect(p.type).toBe("approved");
    });

    // Test 3: Filtrar por tipo "base"
    const base = searchApprovedProducts({
      portfolioCode: "PO-000011",
      productType: "base",
      status: "Activo",
    });
    console.log(`✓ Productos base: ${base.length}`);
    base.forEach((p) => {
      expect(p.type).toBe("base");
    });

    // Test 4: Filtrar por portafolio diferente debe retornar vacío
    const differentPortfolio = searchApprovedProducts({
      portfolioCode: "PO-000999",
      status: "Activo",
    });
    console.log(`✓ Productos en portafolio inexistente: ${differentPortfolio.length}`);
    expect(differentPortfolio.length).toBe(0);

    console.log("\n✅ QA-SKU-04 PASADO: El filtrado funciona correctamente\n");
  });

  it("Resumen: 8 Productos Nuevos Creados para ALICORP", () => {
    console.log("\n═════════════════════════════════════════════════════════");
    console.log("RESUMEN: Datos de SKU Base y Aprobados Listos para Uso");
    console.log("═════════════════════════════════════════════════════════\n");

    const allNewProducts = APPROVED_PRODUCTS.filter(
      (p) =>
        p.clientCode === "CL-000001" &&
        p.portfolioCode === "PO-000011" &&
        (p.code.startsWith("SKU-00020") ||
          p.code.startsWith("SKU-00021") ||
          p.code.startsWith("SKU-00008") ||
          p.code.startsWith("SKU-00009"))
    );

    console.log(`📊 Total de productos creados: ${allNewProducts.length}`);
    console.log("📍 Cliente: Alicorp S.A.A. (CL-000001)");
    console.log("📍 Portafolio: PO-000011 - Carnes importadas");
    console.log("📍 Estado: Todos Activos");
    console.log("\n📋 Listado Completo:");

    const baseProducts = allNewProducts.filter((p) => p.type === "base");
    const approvedProducts = allNewProducts.filter((p) => p.type === "approved");

    console.log("\n  🔹 SKU Base (para Producto Nuevo sin Nueva estructura):");
    baseProducts.forEach((p) => {
      console.log(`     - ${p.code}: ${p.name}`);
    });

    console.log("\n  🔹 SKU Aprobados (para Producto Modificado):");
    approvedProducts.forEach((p) => {
      console.log(`     - ${p.code}: ${p.name}`);
    });

    console.log(
      `\n✅ LISTO: ${baseProducts.length} SKU Base + ${approvedProducts.length} SKU Aprobados\n`
    );

    expect(allNewProducts.length).toBe(8);
  });
});
