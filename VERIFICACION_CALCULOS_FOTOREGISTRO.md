# ✅ Verificación de Cálculos - Fotoregistro Simplificado

## 📊 Ejemplo Proporcional

### Datos de Entrada (Usuario ingresa)
```
¿La lámina lleva fotoregistro? [Sí]
¿Cuántos? [1 fotoregistro]

FOTOREGISTRO 1
  Tamaño
    Ancho: 76 mm
    Alto: 12.7 mm
  
  Ubicación horizontal
    [Desde la derecha ▼] 8 mm
  
  Ubicación vertical
    [Desde abajo ▼] 12.7 mm
```

### Dimensiones de la Lámina (Configuración de Formato)
```
Ancho de lámina: 1178 mm
Repetición: 417.5 mm
```

---

## 🔢 Cálculos Automáticos

### Fórmula: Margen = Dimensión Total - Tamaño FR - Distancia Opuesta

#### Horizontal (Reference: "right", Distance: 8)
```
Margen Derecha = 8 mm                      ✓ (distancia directa)
Margen Izquierda = 1178 - 76 - 8 = 1094 mm ✓
Verificación: 1094 + 76 + 8 = 1178 mm     ✓
```

#### Vertical (Reference: "bottom", Distance: 12.7)
```
Margen Inferior = 12.7 mm                        ✓ (distancia directa)
Margen Superior = 417.5 - 12.7 - 12.7 = 392.1 mm ✓
Verificación: 392.1 + 12.7 + 12.7 = 417.5 mm    ✓
```

---

## 📐 Matriz de Cálculos por Referencia

### Cuando Reference = "right"
| Concepto | Fórmula | Resultado |
|----------|---------|-----------|
| Margen Derecha | distance.horizontal | 8 mm |
| Margen Izquierda | laminaWidth - width - distance.horizontal | 1094 mm |

### Cuando Reference = "left"
| Concepto | Fórmula | Resultado |
|----------|---------|-----------|
| Margen Izquierda | distance.horizontal | N/A (no aplica en ejemplo) |
| Margen Derecha | laminaWidth - width - distance.horizontal | N/A (no aplica en ejemplo) |

### Cuando Reference = "bottom"
| Concepto | Fórmula | Resultado |
|----------|---------|-----------|
| Margen Inferior | distance.vertical | 12.7 mm |
| Margen Superior | repetition - height - distance.vertical | 392.1 mm |

### Cuando Reference = "top"
| Concepto | Fórmula | Resultado |
|----------|---------|-----------|
| Margen Superior | distance.vertical | N/A (no aplica en ejemplo) |
| Margen Inferior | repetition - height - distance.vertical | N/A (no aplica en ejemplo) |

---

## 🎯 Validación Cruzada

### Verificación de Integridad
```
Ancho Lámina = Izq + Ancho FR + Der
1178 = 1094 + 76 + 8 ✓

Repetición = Sup + Alto FR + Inf
417.5 = 392.1 + 12.7 + 12.7 ✓
```

### Casos Borde Validados
- ✓ Margen negativo → Redondeado a 0
- ✓ Distancia cero → Fotoregistro en extremo
- ✓ Referencias inversas → Cálculos simétricos

---

## 💾 Implementación en Código

### Función: `calculateMargins()`
Ubicación: `src/shared/utils/photoregisterCalculations.ts:33-68`

**Entrada:**
```typescript
calculateMargins(
  laminaWidth: 1178,
  repetition: 417.5,
  dimensions: { width: 76, height: 12.7 },
  reference: { horizontal: "right", vertical: "bottom" },
  distance: { horizontal: 8, vertical: 12.7 }
)
```

**Proceso:**
```typescript
// Horizontal (right)
marginLeft = 1178 - 76 - 8 = 1094
marginRight = 8

// Vertical (bottom)
marginTop = 417.5 - 12.7 - 12.7 = 392.1
marginBottom = 12.7
```

**Salida:**
```typescript
{
  left: 1094,
  right: 8,
  top: 392.1,
  bottom: 12.7
}
```

---

## ✨ Resumen

| Aspecto | Estado | Detalles |
|---------|--------|----------|
| Cálculos Horizontales | ✅ Correcto | Margen = Ancho - FR - Distancia |
| Cálculos Verticales | ✅ Correcto | Margen = Alto - FR - Distancia |
| Referencias Simétricas | ✅ Correcto | "left"/"right", "top"/"bottom" |
| Validación de Integridad | ✅ Correcto | Suma total = Dimensión lámina |
| Casos Borde | ✅ Correcto | Margen ≥ 0 siempre |

**Conclusión:** Los cálculos son matemáticamente correctos y validan la integridad bidimensional del fotoregistro en la lámina.

---

Verificado: 2026-08-05
