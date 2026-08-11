# 📊 Exportar Restricciones a Excel/CSV

Este documento explica cómo exportar todas las restricciones (Dimensiones y Validaciones) organizadas por categoría, envoltura y formato.

## 🎯 ¿Qué contiene la exportación?

### **Hoja: Restricciones Dimensión**
Todas las restricciones de dimensionales para LÁMINA, BOLSA y POUCH:
- Código y nombre
- Envoltura (LÁMINA, BOLSA, POUCH)
- Formato del plan
- Rangos de valores (Ancho, Largo, Fuelle, etc.)
- Estado (Activo, Inactivo, Bloqueado)
- **Columna vacía para Descripción** (puedes completarla y volver a importar)

### **Hoja: Restricciones Validación**
Todas las restricciones de validación:
- Código y nombre
- Envoltura
- Campo origen y dependiente
- Valores permitidos
- Estado
- **Descripción** (editable)

### **Hoja: Resumen**
Estadísticas de restricciones:
- Total por categoría y envoltura
- Totales generales

---

## 📥 Opción 1: Descargar desde la Interfaz

### Desde la Página "Ver Todo"
1. Ve a `/catalogs/view-all`
2. En la pestaña **Restricciones**
3. Haz clic en botón **Exportar ▼** 
4. Selecciona **Descargar restricciones**

### Componente Dedicado
Una vez integrado, el botón estará disponible en:
```
<ExportRestrictionsButton variant="primary" />
```

---

## 📥 Opción 2: Usar el HTML Standalone

Si quieres una página independiente para descargar:

1. **Abre el archivo:** `export-restrictions.html` en tu navegador
2. **Haz clic:** "Descargar Restricciones (Excel)"
3. **Se descargará:** `Restricciones_YYYY-MM-DD.xlsx`

⚠️ **Nota:** Esta página funciona solo con datos de ejemplo. Para datos reales, necesitas completar los arrays `DIMENSION_RESTRICTIONS` y `VALIDATION_RESTRICTIONS` en el HTML.

---

## 📥 Opción 3: Script Node.js (CLI)

Para generar los archivos desde línea de comandos:

```bash
node scripts/exportRestrictions.js
```

Esto genera tres archivos CSV en carpeta `exports/`:
- `restricciones-dimensiones-YYYY-MM-DD.csv`
- `restricciones-validaciones-YYYY-MM-DD.csv`
- `restricciones-resumen-YYYY-MM-DD.csv`

⚠️ **Nota:** Requiere completar los datos en `scripts/exportRestrictions.js`

---

## 🏗️ Implementación Técnica

### Utility Function
```typescript
// src/modules/catalog-management/utils/exportRestrictionsToExcel.ts
export function exportRestrictionsToExcel(): void {
  const dimensionRestrictions = getDimensionRestrictions();
  const validationRestrictions = getValidationRestrictions();
  // Genera y descarga el Excel
}
```

### React Component
```tsx
import ExportRestrictionsButton from "./components/ExportRestrictionsButton";

// Uso
<ExportRestrictionsButton variant="primary" />
```

### Servicios Utilizados
- `getDimensionRestrictions()` - Obtiene restricciones de dimensión
- `getValidationRestrictions()` - Obtiene restricciones de validación
- `XLSX` - Librería para generar Excel

---

## 📋 Estructura del Excel

### Dimensiones (Hoja 1)
```
| Categoría | Envoltura | Código | Nombre | Formato | Ancho | Largo | ... | Estado | Descripción |
|-----------|-----------|--------|--------|---------|-------|-------|-----|--------|-------------|
| Dimensiones | LÁMINA | LAMINA_GENERICA | LÁMINA - GENÉRICA | GENERICA | 38-2390 | 0-961 | ... | Activo | [editable] |
```

### Validaciones (Hoja 2)
```
| Categoría | Envoltura | Código | Nombre | Campo Origen | Campo Dependiente | Valores Permitidos | Estado | Descripción |
|-----------|-----------|--------|--------|--------------|-------------------|-------------------|--------|-------------|
| Validación | LÁMINA | ... | ... | tipoProducto | clasePrinting | Sí; No | Activo | [editable] |
```

### Resumen (Hoja 3)
```
RESUMEN DE RESTRICCIONES

Categoría,Envoltura,Cantidad
Dimensiones,LÁMINA,3
Dimensiones,BOLSA,5
...
Total Dimensiones,,XX
Total Validaciones,,YY
Total Restricciones,,ZZ
```

---

## ✏️ Editar y Re-importar

1. **Descarga el Excel** usando cualquiera de las opciones anteriores
2. **Edita las restricciones:**
   - Agrega descripción en la columna correspondiente
   - Modifica rangos de valores (solo si sabes qué haces)
   - Cambia estados
3. **Exporta desde Excel** como CSV o mantén .xlsx
4. **Importa nuevamente** al sistema (funcionalidad pendiente)

---

## 🔧 Configuración por Envoltura

El Excel está **organizado automáticamente por:**
1. **Categoría** (Dimensiones / Validación)
2. **Envoltura** (LÁMINA / BOLSA / POUCH)
3. **Formato** (dentro de cada envoltura)

Cada restricción incluye:
- ✅ Código único
- ✅ Nombre descriptivo
- ✅ Todos los campos aplicables
- ✅ Rangos mín-máx
- ✅ Estado vigencia
- ✅ **Espacio para descripción**

---

## 📊 Ejemplo de Datos Esperados

### Dimensiones - LÁMINA
```
- LÁMINA GENÉRICA: Ancho 38-2390mm, Largo 0-961mm
- LÁMINA FOLIO: Ancho 38-2390mm, Largo 0-500mm
- LÁMINA A4: Ancho 210mm, Largo 297mm
```

### Dimensiones - BOLSA
```
- BOLSA GENÉRICA: Ancho 50-2000mm, Largo 50-2000mm, Fuelle 0-500mm
- BOLSA DOYPACK: Ancho 100-1500mm, Base dinámica
```

### Validaciones - POUCH
```
- Compatibilidad Sello: SI dependente de tipoProducto
- Compatibilidad Fuelle: SI dependiente de formato
```

---

## 🆘 Troubleshooting

### "El archivo no se descarga"
- Verifica que JavaScript esté habilitado
- Comprueba que XLSX.js esté cargado (ver consola)
- Intenta desde otro navegador

### "Los datos están vacíos"
- Los datos vienen de `localStorage`
- Si es HTML standalone, completa manualmente los arrays
- Si es desde la interfaz, verifica que haya restricciones creadas

### "Formato incorrecto"
- Asegúrate de usar Excel 2016+ o LibreOffice
- Guarda como .xlsx (no .xls)
- Si exportas a CSV, usa UTF-8

---

## 📞 Soporte

Para actualizar la estructura o agregar más campos:
1. Modifica `exportRestrictionsToExcel.ts`
2. Agrega las nuevas columnas a las interfaces
3. Incluye los campos en las filas mapeadas

---

**Última actualización:** Agosto 2026  
**Versión:** 1.0
