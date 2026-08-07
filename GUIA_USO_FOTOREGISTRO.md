# 📖 Guía de Uso - Fotoregistro Simplificado

## 🎯 Objetivo

La nueva sección de **Fotoregistro Simplificado** permite al usuario configurar la ubicación del fotoregistro en una lámina ingresando solo **4 valores**, en lugar de los **12 anteriores**. El sistema calcula automáticamente todos los márgenes y puede generar un segundo fotoregistro en el extremo opuesto.

---

## ✨ ¿Qué cambió?

### Antes (12 campos)
```
Fotoregistro 1:
  ├─ ¿Tiene Fotoregistro 1? [Select]
  ├─ Ancho (mm) [Input]
  ├─ Alto (mm) [Input]
  ├─ Margen Izquierdo (mm) [Input]
  ├─ Margen Derecho (mm) [Input]
  ├─ Margen Superior (mm) [Input]
  └─ Margen Inferior (mm) [Input]

Fotoregistro 2:
  ├─ ¿Tiene Fotoregistro 2? [Select]
  ├─ Ancho (mm) [Input]
  ├─ Alto (mm) [Input]
  ├─ Margen Izquierdo (mm) [Input]
  ├─ Margen Derecho (mm) [Input]
  ├─ Margen Superior (mm) [Input]
  └─ Margen Inferior (mm) [Input]
```

### Ahora (4 campos)
```
¿La lámina lleva fotoregistro?
  ├─ [No] [Sí] (botones)

¿Cuántos fotoregistros lleva? (solo si Sí)
  ├─ [1 fotoregistro] [2 fotoregistros] (botones)

Fotoregistro 1:
  ├─ Ancho (mm) [Input]
  ├─ Alto (mm) [Input]
  ├─ Referencia horizontal [Desde la izquierda / Desde la derecha]
  ├─ Distancia horizontal (mm) [Input]
  ├─ Referencia vertical [Desde arriba / Desde abajo]
  └─ Distancia vertical (mm) [Input]

Vista Previa:
  └─ [SVG interactivo mostrando la lámina y fotoregistros]

Fotoregistro 2 (si aplica):
  └─ Se genera automáticamente en el extremo opuesto
```

---

## 🚀 Flujo de Uso - Paso a Paso

### Paso 1: Acceder a la Sección

1. Navega a **ProductEditPage** (edición de producto)
2. Ve al **Paso 1 - Diseño**
3. Busca la sección **"Datos del Fotoregistro"** (ícono 📸)
   - ⚠️ Solo visible si seleccionaste envoltura tipo **LÁMINA**

### Paso 2: Decisión Inicial

**Pregunta:** ¿La lámina lleva fotoregistro?

Selecciona uno de dos botones:
- **[No]** - Si la lámina no requiere fotoregistro
  - Sistema limpia todos los campos
- **[Sí]** - Si la lámina sí requiere fotoregistro
  - Aparece la segunda pregunta

### Paso 3: Decidir Cantidad

**Pregunta:** ¿Cuántos fotoregistros lleva?

Selecciona uno de dos botones:
- **[1 fotoregistro]** - Solo requiere uno
  - Muestra configuración del Fotoregistro 1
- **[2 fotoregistros]** - Requiere dos (lado a lado)
  - Muestra configuración del Fotoregistro 1
  - Fotoregistro 2 se genera automáticamente en el extremo opuesto

### Paso 4: Configurar Fotoregistro 1

Ingresa solo **4 valores**:

#### Tamaño
```
Ancho (mm):        [_____] mm
Alto (mm):         [_____] mm
```

#### Ubicación Horizontal
```
Referencia:        [Desde la izquierda ▼]
Distancia (mm):    [_____] mm
```
- Si seleccionas **Desde la izquierda**: distancia desde el lado izquierdo
- Si seleccionas **Desde la derecha**: distancia desde el lado derecho

#### Ubicación Vertical
```
Referencia:        [Desde arriba ▼]
Distancia (mm):    [_____] mm
```
- Si seleccionas **Desde arriba**: distancia desde el lado superior
- Si seleccionas **Desde abajo**: distancia desde el lado inferior

### Paso 5: Visualización

Automáticamente aparece una **vista previa SVG** que muestra:
- La lámina completa (fondo gris)
- El Fotoregistro 1 (rectángulo azul)
- El Fotoregistro 2 si aplica (rectángulo verde)
- Líneas de referencia punteadas
- Etiquetas con las dimensiones totales

### Paso 6: Guardar

El sistema automáticamente:
- Calcula los 4 márgenes (izquierdo, derecho, superior, inferior)
- Genera el Fotoregistro 2 en el extremo opuesto (si seleccionaste 2)
- Guarda todos los valores cuando presionas "Actualizar" o "Solicitar aprobación"

---

## 📊 Ejemplo Práctico

### Escenario: Lámina 1178 x 417.5 mm

```
Entrada del Usuario:
┌─────────────────────────────────────────────────────────────┐
│ ¿La lámina lleva fotoregistro?                              │
│ [No]  [Sí] ✓                                               │
├─────────────────────────────────────────────────────────────┤
│ ¿Cuántos fotoregistros?                                     │
│ [1 fotoregistro]  [2 fotoregistros]                         │
├─────────────────────────────────────────────────────────────┤
│ FOTOREGISTRO 1                                              │
│                                                              │
│ Tamaño:                                                      │
│   Ancho (mm):      76                                        │
│   Alto (mm):       12.7                                      │
│                                                              │
│ Ubicación horizontal:                                        │
│   [Desde la derecha ▼]  8 mm                                │
│                                                              │
│ Ubicación vertical:                                          │
│   [Desde abajo ▼]  12.7 mm                                  │
└─────────────────────────────────────────────────────────────┘

Sistema Calcula Automáticamente:
┌─────────────────────────────────────────────────────────────┐
│ Márgenes Calculados                                         │
│                                                              │
│ Margen izquierdo:   1094 mm                                 │
│ Margen derecho:     8 mm                                    │
│ Margen superior:    392.1 mm                                │
│ Margen inferior:    12.7 mm                                 │
│                                                              │
│ Verificación:                                               │
│ Izq + Ancho + Der = 1094 + 76 + 8 = 1178 ✓ (correcto)     │
│ Sup + Alto + Inf = 392.1 + 12.7 + 12.7 = 417.5 ✓           │
└─────────────────────────────────────────────────────────────┘

Vista Previa:
┌─────────────────────────────────────────────────────────────┐
│                        1178 mm                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 392.1                           ┌────┐                  ││ 
│  │  mm  ────────────────────────── │ FR1│ ───────────────  ││
│  │                                 └────┘                  ││
│  │                            8 mm ↑                       ││
│  │                                                          ││
│  │                                                    12.7mm││
│  │                                                ↓         ││
│  │ 1094 mm │  76 mm │  8 mm                                ││
│  └─────────────────────────────────────────────────────────┘│
│                        417.5 mm                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Fotoregistro 2 Automático

Si seleccionas **2 fotoregistros**:

```
El Fotoregistro 2 se genera automáticamente:

FR1: Desde la derecha 8 mm, Desde abajo 12.7 mm
  ↓
FR2: Desde la izquierda 8 mm, Desde abajo 12.7 mm
     (ubicación inversa en eje horizontal, misma en eje vertical)

Márgenes generados automáticamente para FR2:
  Margen izquierdo: 8 mm
  Margen derecho: 1094 mm
  Margen superior: 392.1 mm
  Margen inferior: 12.7 mm
```

### Actualización Sincronizada

Si cambias valores en FR1, FR2 se actualiza automáticamente:

```
Cambias ancho FR1: 76 → 100 mm
  ↓
Sistema recalcula FR2:
  - Ancho FR2: 76 → 100 mm
  - Márgenes recalculados para mantener simetría
  - Vista previa actualizada en tiempo real
```

---

## ✅ Validaciones Automáticas

El sistema valida automáticamente:

| Validación | Condición | Acción |
|-----------|-----------|--------|
| **Fotoregistro cabe** | Ancho/Alto no excede lámina | Rechaza si excede |
| **Distancia válida** | No puede ser negativa | Rechaza negativos |
| **Margen válido** | Margen calculado no negativo | Rechaza si resulta negativo |
| **Entrada decimal** | Acepta punto o coma | Normaliza automáticamente |
| **Rango de lámina** | Basado en ancho y repetición | Valida contra límites reales |

---

## 💡 Tips y Trucos

### Tip 1: Usar Coma o Punto Decimal
Ambos funcionan igual:
```
12.7 mm  ✓
12,7 mm  ✓
```

### Tip 2: Fotoregistro en el Extremo
Puedes usar distancia = 0 para poner el fotoregistro en el extremo:
```
Desde la derecha, 0 mm → Fotoregistro toca el borde derecho
```

### Tip 3: Cargar Registros Existentes
Al cargar un proyecto que ya tiene fotoregistro:
- Sistema reconstruye automáticamente la referencia
- Usuario ve "Desde la derecha, 8 mm" (legible)
- No necesita re-ingresar los márgenes

### Tip 4: Cambiar de 2 a 1
Si cambias de "2 fotoregistros" a "1 fotoregistro":
- FR1 se mantiene
- FR2 se limpia automáticamente
- Los valores de FR1 no cambian

### Tip 5: Vista Previa en Tiempo Real
La vista previa se actualiza automáticamente al:
- Cambiar cualquier valor de tamaño o distancia
- Cambiar referencias
- Cambiar cantidad de fotoregistros

---

## 🚨 Casos Especiales

### Caso 1: La lámina no tiene fotoregistro
```
¿La lámina lleva fotoregistro? → [No]

Resultado:
  ✓ Todos los campos se limpian
  ✓ Vista previa desaparece
  ✓ Sistema guarda "No lleva fotoregistro"
```

### Caso 2: FR más ancho que la lámina
```
Lámina: 1178 mm
Ingresa: Ancho FR = 1200 mm

Resultado:
  ✗ Sistema rechaza el valor
  ✗ Muestra error: "El ancho no puede superar 1178 mm"
  ✗ No permite guardar
```

### Caso 3: Distancia horizontal excede límite
```
Lámina: 1178 mm
FR Ancho: 76 mm
Distancia: 1200 mm
Máximo permitido: 1178 - 76 = 1102 mm

Resultado:
  ✗ Sistema rechaza el valor
  ✗ Muestra error: "Distancia máxima 1102 mm"
```

### Caso 4: Importar datos con márgenes legados
```
Datos guardados: Izq=1094, Der=8, Sup=392.1, Inf=12.7

Al cargar:
  ✓ Sistema reconstruye referencias
  ✓ Usuario ve: "Desde la derecha, 8 mm"
  ✓ No necesita editar si solo quiere guardar
```

---

## 📋 Resumen de Campos

### Campos Que Ingresas (4)
| Campo | Tipo | Rango | Ejemplo |
|-------|------|-------|---------|
| Ancho | Número | 0-1000 mm | 76 |
| Alto | Número | 0-500 mm | 12.7 |
| Referencia H | Select | Izq/Der | Derecha |
| Distancia H | Número | 0-1000 mm | 8 |
| Referencia V | Select | Arriba/Abajo | Abajo |
| Distancia V | Número | 0-500 mm | 12.7 |

### Campos Que Calcula (4)
| Campo | Cálculo |
|-------|---------|
| Margen Izquierdo | Ancho lámina - Ancho FR - Margen Derecho |
| Margen Derecho | Distancia si ref es derecha, sino se calcula |
| Margen Superior | Repetición - Alto FR - Margen Inferior |
| Margen Inferior | Distancia si ref es abajo, sino se calcula |

---

## 🎯 Beneficios

✅ **66% menos campos** (de 12 a 4)
✅ **Cálculos automáticos** (no hay errores manuales)
✅ **Visualización en tiempo real** (ve lo que estás haciendo)
✅ **FR2 automático** (no duplicar trabajo)
✅ **Validación automática** (evita datos inválidos)
✅ **Parseeo decimal** (funciona con punto y coma)
✅ **Cargar registros** (reconstruye referencias automáticamente)
✅ **Interfaz simple** (botones segmentados, no dropdowns)

---

## 🆘 Solución de Problemas

### La sección no aparece
**Causa:** No seleccionaste envoltura tipo LÁMINA
**Solución:** Vuelve al Paso "Portafolio" y selecciona uno con envoltura LÁMINA

### No puedo ingresar números con coma
**Causa:** Tu navegador interpreta coma como separador de miles
**Solución:** Usa punto decimal (12.7) o coma directamente, ambos funcionan

### FR2 no se actualiza cuando cambio FR1
**Causa:** FR2 está en modo personalizado (distinto al simétrico)
**Solución:** Restaura la posición simétrica haciendo clic en botón correspondiente

### Veo error "Distancia excede límite"
**Causa:** La distancia que ingresaste es mayor a la disponible
**Solución:** Reduce la distancia o el tamaño del fotoregistro

---

Generado: 2026-08-05 | Última actualización: Implementación Completa
