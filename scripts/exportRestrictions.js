#!/usr/bin/env node

/**
 * Script para exportar todas las restricciones a Excel y CSV
 * Uso: node scripts/exportRestrictions.js
 */

const fs = require("fs");
const path = require("path");

// Simulación de datos (en una aplicación real, esto vendría de la BD o localStorage)
// Para esto, necesitaríamos importar los datos reales, pero como es un script Node,
// vamos a crear una versión simplificada que exporta los datos directamente

const DIMENSION_RESTRICTIONS = [
  {
    id: "dim-lamina-001",
    code: "LAMINA_GENERICA",
    name: "LÁMINA - GENÉRICA",
    productType: "LAMINA",
    formatPlan: "GENERICA",
    ancho: { min: 38, max: 2390 },
    largo: { min: 0, max: 961 },
    designAreaWidth: { min: 0, max: 2390 },
    designAreaHeight: { min: 0, max: 961 },
    status: "Activo",
  },
  // Nota: Agregar todas las restricciones del catálogo aquí
];

const VALIDATION_RESTRICTIONS = [
  // Nota: Agregar todas las validaciones del catálogo aquí
];

function getEnvolturaLabel(productType) {
  const labels = {
    LAMINA: "LÁMINA",
    BOLSA: "BOLSA",
    POUCH: "POUCH",
  };
  return labels[productType] || productType;
}

function formatRange(obj) {
  if (!obj) return "-";
  return `${obj.min}-${obj.max}`;
}

function generateDimensionCSV() {
  const headers = [
    "Categoría",
    "Envoltura",
    "Código",
    "Nombre Restricción",
    "Formato",
    "Ancho (min-max)",
    "Largo (min-max)",
    "Ancho Fuelle (min-max)",
    "Perímetro",
    "Repetición",
    "Diseño Ancho",
    "Diseño Altura",
    "Estado",
    "Descripción",
  ];

  const rows = DIMENSION_RESTRICTIONS.map((r) => [
    "Dimensiones",
    getEnvolturaLabel(r.productType),
    r.code,
    r.name,
    r.formatPlan || "-",
    formatRange(r.ancho),
    formatRange(r.largo),
    formatRange(r.anchoFuelle),
    formatRange(r.perimetro),
    formatRange(r.repeticion),
    formatRange(r.designAreaWidth),
    formatRange(r.designAreaHeight),
    r.status,
    "",
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
}

function generateValidationCSV() {
  const headers = [
    "Categoría",
    "Envoltura",
    "Código",
    "Nombre Restricción",
    "Campo Origen",
    "Valor Origen",
    "Campo Dependiente",
    "Valores Permitidos",
    "Estado",
    "Descripción",
  ];

  const rows = VALIDATION_RESTRICTIONS.map((r) => [
    "Validación",
    getEnvolturaLabel(r.productType),
    r.code,
    r.name,
    r.sourceField,
    r.sourceValue,
    r.dependentField,
    r.allowedValues.join("; "),
    r.status,
    r.description || "",
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");
}

function generateSummary() {
  const lines = [
    "RESUMEN DE RESTRICCIONES",
    "",
    "Categoría,Envoltura,Cantidad",
  ];

  const envolturas = ["LAMINA", "BOLSA", "POUCH"];

  for (const env of envolturas) {
    const count = DIMENSION_RESTRICTIONS.filter(
      (r) => r.productType === env
    ).length;
    if (count > 0) {
      lines.push(`Dimensiones,${getEnvolturaLabel(env)},${count}`);
    }
  }

  for (const env of envolturas) {
    const count = VALIDATION_RESTRICTIONS.filter(
      (r) => r.productType === env
    ).length;
    if (count > 0) {
      lines.push(`Validación,${getEnvolturaLabel(env)},${count}`);
    }
  }

  lines.push("");
  lines.push(
    `Total Dimensiones,,${DIMENSION_RESTRICTIONS.length}`
  );
  lines.push(
    `Total Validaciones,,${VALIDATION_RESTRICTIONS.length}`
  );
  lines.push(
    `Total Restricciones,,${DIMENSION_RESTRICTIONS.length + VALIDATION_RESTRICTIONS.length}`
  );

  return lines.join("\n");
}

function main() {
  const outputDir = path.join(__dirname, "..", "exports");

  // Crear directorio si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().split("T")[0];

  // Generar CSVs
  const dimensionCSV = generateDimensionCSV();
  const validationCSV = generateValidationCSV();
  const summary = generateSummary();

  fs.writeFileSync(
    path.join(outputDir, `restricciones-dimensiones-${timestamp}.csv`),
    dimensionCSV,
    "utf-8"
  );

  fs.writeFileSync(
    path.join(outputDir, `restricciones-validaciones-${timestamp}.csv`),
    validationCSV,
    "utf-8"
  );

  fs.writeFileSync(
    path.join(outputDir, `restricciones-resumen-${timestamp}.csv`),
    summary,
    "utf-8"
  );

  console.log("✅ Exportación completada:");
  console.log(`   📄 restricciones-dimensiones-${timestamp}.csv`);
  console.log(`   📄 restricciones-validaciones-${timestamp}.csv`);
  console.log(`   📄 restricciones-resumen-${timestamp}.csv`);
  console.log("");
  console.log(`📁 Directorio: ${outputDir}`);
  console.log("");
  console.log("Resumen:");
  console.log(summary);
}

main();
