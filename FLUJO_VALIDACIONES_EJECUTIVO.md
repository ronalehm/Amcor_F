# Flujo de Validación para Ejecutivos Comerciales

## 📋 Resumen General

El sistema de validación integra proyectos con un flujo de revisión por áreas (Artes Gráficas, R&D Técnica, R&D Desarrollo). Los Ejecutivos Comerciales pueden:

1. **Ver proyectos observados** → corregir → reenviar a validación
2. **Ver proyectos rechazados** → consultar motivo (bloqueados hasta reapertura)
3. **Avanzar proyectos validados** → RFQ, PDF, carga de precio

---

## 🔄 Estados del Proyecto

### Estados de Validación

| Estado | Descripción | Acción del Ejecutivo |
|--------|-------------|---------------------|
| **Sin solicitar** | Proyecto registrado, sin enviar a validación | Puede editar, solicitar validación |
| **Pendiente de validación** | Enviado, esperando revisión inicial | Consultar avance |
| **En validación** | Áreas están revisando | Consultar avance |
| **Observada** | Áreas requieren corrección | ✅ Editar, corregir, reenviar |
| **Rechazada** | Área rechazó por inviabilidad | ❌ Solo ver motivo, bloqueado |
| **Validada por áreas** | Todas las áreas aprobaron | ✅ Puede avanzar a RFQ |
| **Lista para RFQ** | Ficha lista para cotización | ✅ Exportar PDF, cargar precio |
| **Precio cargado** | Precio registrado | ✅ Completar campos finales |
| **Ficha aprobada** | Proceso completo | ✅ Flujo cerrado |

---

## ⚠️ Diferencia: Observado vs Rechazado

### Proyecto OBSERVADO ✅ → Requiere corrección

**Qué significa:**
- Una o más áreas detectaron información incompleta/inconsistente
- Ejemplos: falta archivo de arte, confirmar gramaje, aclarar uso final

**Qué puede hacer el Ejecutivo:**
1. Ver comentarios por área
2. Identificar campos observados
3. **Editar la ficha y guardar**
4. **Reenviar a validación**
5. Se conserva historial de comentarios anteriores

**Botones disponibles:**
- ✅ "Ver observaciones"
- ✅ "Corregir ficha" (editar)
- ✅ "Reenviar a validación"

**NO permitido:**
- ❌ Exportar PDF
- ❌ Cargar precio
- ❌ Avanzar a RFQ

---

### Proyecto RECHAZADO ❌ → Bloqueado

**Qué significa:**
- Área validadora determinó que NO es viable continuar
- Ejemplos: producto no viable técnicamente, no se puede fabricar, no cumple restricciones

**Qué puede ver el Ejecutivo:**
1. Motivo del rechazo
2. Área responsable
3. Validador y fecha

**NO permitido:**
- ❌ Editar ficha
- ❌ Reenviar a validación
- ❌ Exportar PDF
- ❌ Cargar precio
- ❌ Avanzar a RFQ

**Para reabrir:** Solo administrador o líder comercial puede habilitar reapertura

---

## 📍 Dónde Ver Proyectos

### 1. **Módulo Proyectos** (Bandeja Principal)
- Lista todos los proyectos
- **Filtro por estado:**
  - Todos
  - En validación
  - **Observados** ← Ejecutivo puede actuar
  - **Rechazados** ← Solo ver motivo
  - Listos para RFQ
  - Pendientes de precio
  - Aprobados

### 2. **Módulo Validaciones** (Bandeja de Validadores)
- Proyectos que requieren validación activa
- Validadores revisan, observan o rechazan

---

## 📊 Tabla de Observaciones

En la ficha de proyecto se muestra: **"Observaciones y comentarios de validación"**

| Área | Estado | Campo Observado | Comentario | Validador | Fecha | Acción Requerida |
|------|--------|-----------------|-----------|-----------|-------|------------------|
| Artes Gráficas | Observada | Archivo de arte | Falta adjuntar referencia visual | Ana Pérez | 24/04/2026 | Adjuntar archivo |
| R&D Técnica | Aprobada | Uso final | Información conforme | Luis Ramos | 24/04/2026 | Ninguna |
| R&D Desarrollo | Observada | Gramaje | Confirmar tolerancia | Carla Ruiz | 24/04/2026 | Corregir campo |

**Historial:**
- Los comentarios anteriores se conservan como trazabilidad
- Cada reenvío registra nuevos comentarios
- Muestra autor, fecha y acción requerida

---

## 🔄 Flujo Paso a Paso: Proyecto Observado

### Paso 1: El Ejecutivo ve el proyecto observado

**En Proyectos → filtro "Observados"**
- Badge naranja: "Observada"
- Botón: "Ver observaciones"

### Paso 2: Abre la ficha del proyecto

**En la sección "Observaciones y comentarios de validación":**
- Lee qué área observó
- Lee qué campo tiene problema
- Lee acción requerida
- Consulta el comentario específico

### Paso 3: Edita la ficha

**En "Editar Proyecto":**
- Modifica solo los campos observados (recomendado)
- Puede editar otros campos también
- **Guarda los cambios**

### Paso 4: Reenvía a validación

**En la ficha:**
- Botón: "Reenviar a validación"
- Sistema registra:
  - Nueva fecha de reenvío
  - Estado del área: vuelve a "Pendiente"
  - Estado general: "En validación"

### Paso 5: Validador revisa nuevamente

- El proyecto reaparece en Validaciones
- El área validadora revisa las correcciones
- Aprueba o vuelve a observar

---

## 🚫 Flujo: Proyecto Rechazado

### Paso 1: El Ejecutivo ve el rechazo

**En Proyectos → filtro "Rechazados"**
- Badge rojo: "Rechazada"
- Botón: "Ver motivo"

### Paso 2: Abre la ficha

**En la tabla de observaciones:**
- Área: "R&D Técnica"
- Estado: "Rechazada"
- Comentario: motivo del rechazo
- Validador: quién tomó la decisión

### Paso 3: Acciones disponibles

- ✅ Ver motivo
- ✅ Consultar trazabilidad
- ✅ Contactar al validador
- ❌ **NO puede editar**
- ❌ **NO puede reenviar**
- ❌ **NO puede exportar PDF**
- ❌ **NO puede cargar precio**

### Paso 4: Solicitar reapertura (opcional)

Si considera que el rechazo fue erróneo:
- Contacta administrador o líder comercial
- Ellos evalúan y pueden habilitar reapertura
- Sistema registra quién y cuándo

---

## 💾 Modelo de Datos

### AreaValidationRecord

```typescript
{
  area: "Artes Gráficas" | "R&D Técnica" | "R&D Desarrollo",
  estado: "Pendiente" | "Aprobada" | "Observada" | "Rechazada",
  validador?: string,
  fechaValidacion?: string,
  campoObservado?: string,  // Campo específico observado
  accionRequerida?: string,  // Qué hacer para corregir
  comentarios: [
    {
      id: string,
      comentario: string,
      campo?: string,           // Campo relacionado
      accionRequerida?: string, // Acción específica
      fecha: string,
      autor?: string           // Quién agregó el comentario
    }
  ]
}
```

### ProjectRecord (campos de validación)

```typescript
{
  // ... otros campos ...
  
  // Control de solicitud
  requiereValidacion: boolean,      // Proyecto requiere validación
  validacionSolicitada: boolean,    // Ejecutivo solicitó validación
  fechaSolicitudValidacion?: string,
  
  // Estado general
  estadoValidacionGeneral: ValidationStatus,
  
  // Validaciones por área
  validaciones: AreaValidationRecord[]
}
```

---

## 🎯 Reglas de Negocio Implementadas

### 1. Observado = Requiere corrección

- ✅ Ejecutivo puede editar todos los campos
- ✅ Puede guardar cambios
- ✅ Puede reenviar a validación con botón "Reenviar"
- ❌ NO puede exportar PDF hasta aprobación
- ❌ NO puede cargar precio hasta aprobación

### 2. Rechazado = Bloqueado

- ❌ NO puede editar
- ❌ NO puede reenviar
- ❌ NO puede exportar PDF
- ❌ NO puede cargar precio
- ✅ Solo puede ver motivo y consultar

### 3. Historial completo

- Comentarios anteriores se mantienen para trazabilidad
- Cada acción (observación, rechazo, reenvío) queda registrada
- Usuario y fecha siempre presentes

### 4. Re-envío automático

Cuando Ejecutivo reenvía después de observación:
- Estado del área → "Pendiente"
- Estado general → "En validación"
- Fecha de reenvío se registra
- Comentarios anteriores se conservan

---

## 🔐 Roles y Permisos

### Ejecutivo Comercial
- Ver proyectos observados
- Editar proyectos observados
- Reenviar a validación
- Ver proyectos rechazados (solo lectura)
- No puede reabrirlos

### Validador (Artes Gráficas, R&D Técnica, R&D Desarrollo)
- Ver proyectos en validación
- Agregar comentarios estructurados
- Marcar como Observada (con campo y acción)
- Marcar como Rechazada (con motivo)
- Marcar como Aprobada

### Administrador / Líder Comercial
- Reabrición de proyectos rechazados
- Cambio de estado manual si es necesario
- Auditoría y reportes

---

## 📱 Interfaz: Dónde Hacer Cada Cosa

### Ver Proyectos Observados
```
Proyectos → Filtro "Observados"
```

### Ver Observaciones Específicas
```
Proyecto (Detalle) → Sección "Observaciones y comentarios de validación"
```

### Editar y Reenviar
```
Proyecto (Detalle) → Botón "Editar" 
→ Realizar cambios 
→ Guardar 
→ Botón "Reenviar a validación"
```

### Ver Proyectos Rechazados
```
Proyectos → Filtro "Rechazados"
```

### Validar Proyecto (Para Validadores)
```
Validaciones → Seleccionar proyecto
→ Pestaña de área específica
→ Agregar comentario
→ Cambiar estado (Observada/Rechazada/Aprobada)
```

---

## ⚡ Ejemplo Práctico

**Proyecto PR-000001 - Cliente Alicorp**

1. **Ejecutivo solicita validación**
   - Estado: "En validación"
   - Validadores: Artes Gráficas, R&D Técnica, R&D Desarrollo

2. **Artes Gráficas observa**
   - Campo: "Archivo de arte"
   - Acción: "Adjuntar referencia visual"
   - Estado proyecto: "Observada"

3. **R&D Técnica aprueba**
   - Estado: "Aprobada"

4. **R&D Desarrollo rechaza**
   - Motivo: "Estructura no viable con las máquinas disponibles"
   - Estado: "Rechazada"

5. **Estado general: RECHAZADA** ❌
   - Proyecto bloqueado
   - Ejecutivo ve en Rechazados
   - Solo puede ver motivo

---

## 🔔 Notificaciones (Pendiente)

- [ ] Email cuando proyecto está observado
- [ ] Email cuando proyecto es rechazado
- [ ] Email cuando validación es aprobada
- [ ] Notificación en dashboard de cambios de estado

---

## 📚 Componentes Implementados

### Nuevos Componentes

1. **ValidationStatusCard**
   - Muestra estado de validación
   - Botón "Reenviar a validación" si aplica
   - Lista de acciones permitidas

2. **ValidationObservationsTable**
   - Tabla con todas las observaciones y rechazos
   - Columnas: Área, Estado, Campo, Comentario, Validador, Fecha, Acción

3. **ValidationDetailPage** (mejorado)
   - Interfaz para validadores
   - Agregar comentarios estructurados
   - Cambiar estado de áreas

### Funciones Agregadas

1. **validationRules.ts**
   - `getValidationPermissions()` - determina qué puede hacer el usuario
   - `getValidationStatusMessage()` - mensaje descriptivo del estado

2. **projectStorage.ts**
   - `getObservedProjects()` - proyectos observados
   - `getRejectedProjects()` - proyectos rechazados
   - `getProjectsInValidation()` - proyectos en validación
   - `getProjectsByValidationStatus()` - filtrar por estado

---

## ✅ Checklist de Implementación

- [x] Estados del proyecto expandidos (Observada, Rechazada, etc.)
- [x] Tabla de observaciones con campos específicos
- [x] Validación estructurada (campo observado + acción requerida)
- [x] Reglas de permisos (observado vs rechazado)
- [x] Componente ValidationStatusCard
- [x] Componente ValidationObservationsTable
- [x] Helper functions para filtros
- [x] Integración en ProjectDetailPage
- [x] Integración en ValidationDetailPage
- [ ] Filtros en ProjectListPage (siguiente)
- [ ] Lógica de re-envío en ProjectEditPage (siguiente)
- [ ] Notificaciones por email (futura)
- [ ] Reportes y auditoría (futura)

---

## 🚀 Próximos Pasos

1. **Agregar botón "Reenviar a validación" en ProjectEditPage**
   - Aparece solo si estado == "Observada"
   - Valida que hay cambios guardados
   - Actualiza estado a "En validación"

2. **Agregar filtros en ProjectListPage**
   - Pestaña "Observados"
   - Pestaña "Rechazados"
   - Pestaña "En validación"

3. **Notificaciones**
   - Email cuando proyecto es observado
   - Email cuando proyecto es aprobado
   - Email cuando proyecto es rechazado

4. **Reportes**
   - Proyectos observados pendientes de corrección
   - Proyectos rechazados por área
   - Tiempo promedio en validación
