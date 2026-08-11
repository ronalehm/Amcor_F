// Script para ejecutar en la consola del navegador para limpiar el cache de restricciones
// Ejecutar esto en: F12 > Console (en la página de Gestión de Catálogos)

console.log("Limpiando cache de restricciones...");

// Limpiar el localStorage de restricciones
localStorage.removeItem("odiseo_dimension_restrictions");
localStorage.removeItem("odiseo_validation_restrictions");
localStorage.removeItem("odiseo_restriction_change_log");

console.log("✅ Cache limpiado. Recarga la página (F5)");
window.location.reload();
