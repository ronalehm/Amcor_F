/**
 * Pruebas de funciones de cálculo de Fotoregistro
 */

import {
  calculateMargins,
  reconstructReferenceAndDistance,
  calculateSymmetricSecond,
  isSecondPhotoregisterAutomatic,
  validatePhotoregisterFitsInLamina,
  parseDecimalInput,
  type HorizontalReference,
  type VerticalReference,
} from "./photoregisterCalculations";

const testCases = {
  // Caso 1: Ejemplo real del usuario
  // FR1: Ancho=76, Alto=12.7, Der=8, Inf=12.7, Izq=1094, Sup=392.1
  // Lámina: Ancho=1178, Repetición=417.5
  caso1_ejemploReal: () => {
    console.log("\n📋 CASO 1: Ejemplo Real del Usuario");
    console.log("=====================================");

    const laminaWidth = 1178;
    const laminaRepetition = 417.5;
    const fr1Dimensions = { width: 76, height: 12.7 };
    const fr1Reference = { horizontal: "right" as HorizontalReference, vertical: "bottom" as VerticalReference };
    const fr1Distance = { horizontal: 8, vertical: 12.7 };

    const margins = calculateMargins(laminaWidth, laminaRepetition, fr1Dimensions, fr1Reference, fr1Distance);

    console.log("Entrada del usuario:");
    console.log(`  Ancho FR1: ${fr1Dimensions.width} mm`);
    console.log(`  Alto FR1: ${fr1Dimensions.height} mm`);
    console.log(`  Ref horizontal: desde la ${fr1Reference.horizontal === "right" ? "derecha" : "izquierda"}`);
    console.log(`  Distancia horizontal: ${fr1Distance.horizontal} mm`);
    console.log(`  Ref vertical: desde ${fr1Reference.vertical === "bottom" ? "abajo" : "arriba"}`);
    console.log(`  Distancia vertical: ${fr1Distance.vertical} mm`);

    console.log("\nMárgenes calculados:");
    console.log(`  Izquierda: ${margins.left} mm (esperado: 1094)`);
    console.log(`  Derecha: ${margins.right} mm (esperado: 8)`);
    console.log(`  Superior: ${margins.top} mm (esperado: 392.1)`);
    console.log(`  Inferior: ${margins.bottom} mm (esperado: 12.7)`);

    const isCorrect =
      Math.abs(margins.left - 1094) < 0.1 &&
      Math.abs(margins.right - 8) < 0.1 &&
      Math.abs(margins.top - 392.1) < 0.1 &&
      Math.abs(margins.bottom - 12.7) < 0.1;

    console.log(isCorrect ? "✅ CORRECTO" : "❌ ERROR");
    return isCorrect;
  },

  // Caso 2: Reconstrucción de referencias desde márgenes
  caso2_reconstruccion: () => {
    console.log("\n📋 CASO 2: Reconstrucción de Referencias desde Márgenes");
    console.log("========================================================");

    const laminaWidth = 1178;
    const laminaRepetition = 417.5;
    const fr1Dimensions = { width: 76, height: 12.7 };
    const fr1Margins = { left: 1094, right: 8, top: 392.1, bottom: 12.7 };

    const reconstructed = reconstructReferenceAndDistance(laminaWidth, laminaRepetition, fr1Dimensions, fr1Margins);

    console.log("Márgenes cargados:");
    console.log(`  Izquierda: ${fr1Margins.left}, Derecha: ${fr1Margins.right}`);
    console.log(`  Superior: ${fr1Margins.top}, Inferior: ${fr1Margins.bottom}`);

    console.log("\nReferencias reconstruidas:");
    console.log(`  Horizontal: ${reconstructed.reference.horizontal} (esperado: right)`);
    console.log(`  Vertical: ${reconstructed.reference.vertical} (esperado: bottom)`);
    console.log(`  Distancia horizontal: ${reconstructed.distance.horizontal} mm (esperado: 8)`);
    console.log(`  Distancia vertical: ${reconstructed.distance.vertical} mm (esperado: 12.7)`);

    const isCorrect =
      reconstructed.reference.horizontal === "right" &&
      reconstructed.reference.vertical === "bottom" &&
      Math.abs(reconstructed.distance.horizontal - 8) < 0.1 &&
      Math.abs(reconstructed.distance.vertical - 12.7) < 0.1;

    console.log(isCorrect ? "✅ CORRECTO" : "❌ ERROR");
    return isCorrect;
  },

  // Caso 3: Fotoregistro 2 simétrico automático
  caso3_fr2Simetrico: () => {
    console.log("\n📋 CASO 3: Fotoregistro 2 Simétrico Automático");
    console.log("==============================================");

    const laminaWidth = 1178;
    const laminaRepetition = 417.5;
    const fr1Dimensions = { width: 76, height: 12.7 };
    const fr1Reference = { horizontal: "right" as HorizontalReference, vertical: "bottom" as VerticalReference };
    const fr1Distance = { horizontal: 8, vertical: 12.7 };

    const fr2 = calculateSymmetricSecond(laminaWidth, laminaRepetition, fr1Dimensions, fr1Reference, fr1Distance);

    console.log("FR1:");
    console.log(`  Dimensiones: ${fr1Dimensions.width}x${fr1Dimensions.height} mm`);
    console.log(`  Ref: ${fr1Reference.horizontal}, Distancia horizontal: ${fr1Distance.horizontal} mm`);
    console.log(`  Ref: ${fr1Reference.vertical}, Distancia vertical: ${fr1Distance.vertical} mm`);

    console.log("\nFR2 Generado (simétrico):");
    console.log(`  Dimensiones: ${fr2.dimensions.width}x${fr2.dimensions.height} mm`);
    console.log(`  Ref horizontal: ${fr2.reference.horizontal} (esperado: left - opuesto a right)`);
    console.log(`  Distancia horizontal: ${fr2.distance.horizontal} mm (esperado: 8)`);
    console.log(`  Ref vertical: ${fr2.reference.vertical} (esperado: bottom - igual)`);
    console.log(`  Distancia vertical: ${fr2.distance.vertical} mm (esperado: 12.7)`);

    console.log("\nMárgenes calculados de FR2:");
    console.log(`  Izquierda: ${fr2.margins.left} mm (esperado: 8 - invertido de derecha de FR1)`);
    console.log(`  Derecha: ${fr2.margins.right} mm (esperado: 1094 - invertido de izquierda de FR1)`);

    const isCorrect =
      fr2.dimensions.width === 76 &&
      fr2.dimensions.height === 12.7 &&
      fr2.reference.horizontal === "left" &&
      fr2.reference.vertical === "bottom" &&
      Math.abs(fr2.margins.left - 8) < 0.1 &&
      Math.abs(fr2.margins.right - 1094) < 0.1;

    console.log(isCorrect ? "✅ CORRECTO" : "❌ ERROR");
    return isCorrect;
  },

  // Caso 4: Detección de simetría
  caso4_deteccionSimetria: () => {
    console.log("\n📋 CASO 4: Detección de Fotoregistro 2 Automático");
    console.log("==================================================");

    const laminaWidth = 1178;
    const laminaRepetition = 417.5;
    const fr1Dimensions = { width: 76, height: 12.7 };
    const fr1Margins = { left: 1094, right: 8, top: 392.1, bottom: 12.7 };
    const fr2Dimensions = { width: 76, height: 12.7 };
    const fr2Margins = { left: 8, right: 1094, top: 392.1, bottom: 12.7 };

    const isAutomatic = isSecondPhotoregisterAutomatic(
      laminaWidth,
      laminaRepetition,
      fr1Dimensions,
      fr1Margins,
      fr2Dimensions,
      fr2Margins
    );

    console.log("FR1 Márgenes: Left=1094, Right=8, Top=392.1, Bottom=12.7");
    console.log("FR2 Márgenes: Left=8, Right=1094, Top=392.1, Bottom=12.7");
    console.log(`\nFR2 es simétrico: ${isAutomatic ? "Sí" : "No"} (esperado: Sí)`);

    console.log(isAutomatic ? "✅ CORRECTO" : "❌ ERROR");
    return isAutomatic;
  },

  // Caso 5: Validaciones de límites
  caso5_validaciones: () => {
    console.log("\n📋 CASO 5: Validaciones de Límites");
    console.log("===================================");

    const laminaWidth = 1178;
    const laminaRepetition = 417.5;

    // 5a: FR cabe en la lámina
    console.log("\n5a) FR cabe correctamente:");
    const valid1 = validatePhotoregisterFitsInLamina(
      { width: 76, height: 12.7 },
      { horizontal: 8, vertical: 12.7 },
      laminaWidth,
      laminaRepetition
    );
    console.log(`  Ancho FR=76, Alto=12.7, Dist H=8, Dist V=12.7`);
    console.log(`  ✓ Válido: ${valid1.valid} (esperado: true)`);

    // 5b: FR más ancho que la lámina
    console.log("\n5b) FR más ancho que la lámina:");
    const valid2 = validatePhotoregisterFitsInLamina(
      { width: 1200, height: 12.7 },
      { horizontal: 8, vertical: 12.7 },
      laminaWidth,
      laminaRepetition
    );
    console.log(`  Ancho FR=1200, Ancho lámina=1178`);
    console.log(`  ✓ Válido: ${valid2.valid} (esperado: false)`);
    console.log(`  Error: "${valid2.errors[0]}"`);

    // 5c: Distancia horizontal excede límite
    console.log("\n5c) Distancia horizontal excede límite:");
    const valid3 = validatePhotoregisterFitsInLamina(
      { width: 76, height: 12.7 },
      { horizontal: 1200, vertical: 12.7 },
      laminaWidth,
      laminaRepetition
    );
    console.log(`  Distancia H=1200, máxima permitida=(1178-76)=1102`);
    console.log(`  ✓ Válido: ${valid3.valid} (esperado: false)`);
    console.log(`  Error: "${valid3.errors[0]}"`);

    // 5d: Distancia cero es válida
    console.log("\n5d) Distancia cero es válida:");
    const valid4 = validatePhotoregisterFitsInLamina(
      { width: 76, height: 12.7 },
      { horizontal: 0, vertical: 0 },
      laminaWidth,
      laminaRepetition
    );
    console.log(`  Distancia H=0, Distancia V=0`);
    console.log(`  ✓ Válido: ${valid4.valid} (esperado: true)`);

    const allCorrect = valid1.valid && !valid2.valid && !valid3.valid && valid4.valid;
    console.log(allCorrect ? "\n✅ TODAS LAS VALIDACIONES CORRECTAS" : "\n❌ ALGUNA VALIDACIÓN FALLÓ");
    return allCorrect;
  },

  // Caso 6: Parseo de entrada decimal
  caso6_parseDecimal: () => {
    console.log("\n📋 CASO 6: Parseo de Entrada Decimal");
    console.log("====================================");

    const tests = [
      { input: "76", expected: 76, desc: "Número entero" },
      { input: "12.7", expected: 12.7, desc: "Punto decimal" },
      { input: "12,7", expected: 12.7, desc: "Coma decimal" },
      { input: " 8 ", expected: 8, desc: "Espacios" },
      { input: "", expected: null, desc: "Vacío" },
      { input: "abc", expected: null, desc: "No numérico" },
    ];

    let allCorrect = true;
    tests.forEach(({ input, expected, desc }) => {
      const parsed = parseDecimalInput(input);
      const isCorrect = parsed === expected;
      const status = isCorrect ? "✓" : "✗";
      console.log(`  ${status} "${input}" → ${parsed} (esperado: ${expected}) - ${desc}`);
      if (!isCorrect) allCorrect = false;
    });

    console.log(allCorrect ? "\n✅ TODOS LOS PARSEEOS CORRECTOS" : "\n❌ ALGÚN PARSEEO FALLÓ");
    return allCorrect;
  },

  // Caso 7: Referencias desde la izquierda
  caso7_desdeIzquierda: () => {
    console.log("\n📋 CASO 7: FR desde la Izquierda");
    console.log("=================================");

    const laminaWidth = 1178;
    const laminaRepetition = 417.5;
    const fr1Dimensions = { width: 76, height: 12.7 };
    const fr1Reference = { horizontal: "left" as HorizontalReference, vertical: "top" as VerticalReference };
    const fr1Distance = { horizontal: 50, vertical: 30 };

    const margins = calculateMargins(laminaWidth, laminaRepetition, fr1Dimensions, fr1Reference, fr1Distance);

    console.log("Entrada del usuario:");
    console.log(`  Ancho FR1: ${fr1Dimensions.width} mm`);
    console.log(`  Alto FR1: ${fr1Dimensions.height} mm`);
    console.log(`  Ref horizontal: desde la izquierda`);
    console.log(`  Distancia horizontal: ${fr1Distance.horizontal} mm`);
    console.log(`  Ref vertical: desde arriba`);
    console.log(`  Distancia vertical: ${fr1Distance.vertical} mm`);

    console.log("\nMárgenes calculados:");
    console.log(`  Izquierda: ${margins.left} mm (esperado: 50)`);
    console.log(`  Derecha: ${margins.right} mm (esperado: ${1178 - 76 - 50})`);
    console.log(`  Superior: ${margins.top} mm (esperado: 30)`);
    console.log(`  Inferior: ${margins.bottom} mm (esperado: ${417.5 - 12.7 - 30})`);

    const expectedRight = 1178 - 76 - 50;
    const expectedBottom = 417.5 - 12.7 - 30;

    const isCorrect =
      Math.abs(margins.left - 50) < 0.1 &&
      Math.abs(margins.right - expectedRight) < 0.1 &&
      Math.abs(margins.top - 30) < 0.1 &&
      Math.abs(margins.bottom - expectedBottom) < 0.1;

    console.log(isCorrect ? "✅ CORRECTO" : "❌ ERROR");
    return isCorrect;
  },
};

// Ejecutar todas las pruebas
export function runAllTests() {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 PRUEBAS DE FOTOREGISTRO - CÁLCULOS");
  console.log("=".repeat(60));

  const results = Object.entries(testCases).map(([name, testFn]) => {
    try {
      const passed = testFn();
      return { name, passed };
    } catch (error) {
      console.error(`❌ Error en ${name}:`, error);
      return { name, passed: false };
    }
  });

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  console.log("\n" + "=".repeat(60));
  console.log(`📊 RESUMEN: ${passedCount}/${totalCount} pruebas pasadas`);
  console.log("=".repeat(60));

  if (passedCount === totalCount) {
    console.log("\n✅ TODAS LAS PRUEBAS PASARON CORRECTAMENTE\n");
  } else {
    console.log("\n❌ ALGUNAS PRUEBAS FALLARON\n");
    console.log("Pruebas que fallaron:");
    results.filter((r) => !r.passed).forEach((r) => {
      console.log(`  - ${r.name}`);
    });
  }

  return passedCount === totalCount;
}

// Ejecutar si se llama directamente
if (typeof window === "undefined") {
  runAllTests();
}
