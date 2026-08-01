# Goal: Diagnóstico y Plan Técnico del Backend ODISEO

## Objetivo Principal

Completar un análisis técnico integral del repositorio actual para identificar la arquitectura, tecnología, datos, entidades, validaciones y reglas funcionales del Portal ODISEO. Entregar un plan técnico detallado con propuesta de arquitectura backend, modelo de dominio, esquema de base de datos, endpoints iniciales y roadmap de implementación incremental en 11 etapas.

**Resultado esperado:** Un reporte de diagnóstico y plan técnico documentado que sirva como base para la construcción incremental del backend sin alterar innecesariamente el frontend existente.

---

## Alcance (In Scope)

### Análisis del Repositorio

- [x] Estructura del proyecto y organización de carpetas
- [x] Stack tecnológico (lenguajes, frameworks, librerías principales)
- [x] Convenciones de código y patrones utilizados
- [x] Configuración actual (build, dev, test, deploy)
- [x] Dependencias principales y versiones

### Mapeo del Frontend

- [x] Identificación de todas las pantallas y componentes principales
- [x] Localización de datos hardcodeados en archivos TypeScript/JavaScript
- [x] Identificación de todos los mocks y servicios simulados
- [x] Mapeo de tipos e interfaces existentes
- [x] Documentación de hooks y estado local (localStorage, sessionStorage, etc.)

### Inventario de Entidades

- [x] Catálogo de todas las entidades identificadas (Customer, Portfolio, Product, ProductRequest, User, Role, Permission, etc.)
- [x] Atributos y propiedades de cada entidad
- [x] Relaciones entre entidades (1-to-many, many-to-many, etc.)
- [x] Estados y ciclo de vida de cada entidad
- [x] Identificadores únicos y claves

### Validaciones y Reglas de Negocio

- [x] Validaciones ya implementadas en el frontend
- [x] Reglas de negocio identificadas en flujos y formularios
- [x] Restricciones de campos (obligatorios, opcionales, formatos)
- [x] Restricciones dimensionales (ancho, largo, perímetro)
- [x] Validaciones de estructuras y materiales
- [x] Restricciones por formato de plano
- [x] Catálogos y combinaciones válidas

### Flujos Funcionales

- [x] Mapeo de pantalla a datos y operaciones requeridas
- [x] Identificación de endpoints que cada pantalla necesita
- [x] Contratos de datos esperados (input/output)
- [x] Flujos de navegación y cambios de estado
- [x] Puntos de integración con sistemas externos

### Catálogos y Datos Maestros

- [x] Todas las listas desplegables, select, radiobuttons identificados
- [x] Datos hardcodeados en archivos de configuración
- [x] Materiales, estructuras, formatos de plano
- [x] Usuarios, roles y permisos
- [x] Estados y clasificaciones

### Propuestas Técnicas

- [x] Modelo de dominio inicial (entidades, relaciones, invariantes)
- [x] Modelo de base de datos propuesto (tablas, columnas, constraints)
- [x] Endpoints core identificados (lista con métodos HTTP, rutas, responsabilidades)
- [x] Arquitectura de backend propuesta (capas, componentes, separación de responsabilidades)
- [x] Tecnología propuesta para backend, base de datos y persistencia
- [x] Decisiones arquitectónicas justificadas

### Roadmap de Implementación

- [x] 11 etapas de implementación secuenciadas
- [x] Dependencias entre etapas claramente documentadas
- [x] Descripción de entregables por etapa
- [x] Orden incremental verificable y funcional
- [x] Criterios de finalización por etapa

### Riesgos, Supuestos y Brechas

- [x] Definiciones funcionales faltantes o ambiguas
- [x] Inconsistencias detectadas en el frontend
- [x] Supuestos técnicos registrados
- [x] Riesgos identificados
- [x] Preguntas pendientes para stakeholders

---

## Fuera de Alcance (Out of Scope)

### Implementación de Código

- **NO:** Escribir código backend (controladores, servicios, repositorios, modelos)
- **NO:** Crear archivos de proyecto o estructura de carpetas reales
- **NO:** Configurar frameworks, bases de datos o dependencias
- **NO:** Implementar migraciones, seeds o datos iniciales
- **NO:** Escribir tests unitarios o de integración
- **NO:** Desplegar la aplicación

### Modificaciones al Frontend

- **NO:** Cambiar componentes React existentes
- **NO:** Refactorizar el código del frontend
- **NO:** Eliminar datos hardcodeados (será progresivo después en implementación)
- **NO:** Modificar estilos o UI
- **NO:** Cambiar la arquitectura del frontend

### Integración Inmediata

- **NO:** Conectar el frontend a un backend real
- **NO:** Implementar autenticación/autorización funcional
- **NO:** Crear integraciones con sistemas externos reales
- **NO:** Configurar CI/CD pipelines
- **NO:** Establecer estrategia de despliegue

### Documentación Operativa

- **NO:** Guías de instalación o despliegue (estas se harán en fase de implementación)
- **NO:** Manuales de usuario
- **NO:** Procedimientos de operación o mantenimiento
- **NO:** Runbooks o escalación de incidentes

### Decisiones de Negocio

- **NO:** Definir requerimientos funcionales nuevos
- **NO:** Cambiar reglas de negocio establecidas
- **NO:** Resolver ambigedades de negocio (eso corresponde a stakeholders)
- **NO:** Tomar decisiones sobre prioridades de features

---

## Dependencias

### Acceso y Recursos

1. **Acceso al Repositorio**
   - Acceso completo de lectura al código fuente del frontend
   - Capacidad de ejecutar el proyecto localmente
   - Acceso a documentación del proyecto (si existe)

2. **Información de Stakeholders**
   - Clarificación de requerimientos ambiguos
   - Definición de reglas de negocio no documentadas
   - Decisiones sobre campos y validaciones opcionales
   - Confirmación de flujos funcionales

3. **Entorno de Desarrollo**
   - Node.js/npm instalado (para inspeccionar dependencias)
   - Editor de código para lectura
   - Acceso a git (para revisar historia)

### Conocimiento y Contexto

1. **Memoria del Proyecto** (Ya disponible)
   - Clasificación y estructura de modificaciones
   - Validaciones DEVIN y combinaciones
   - Generación de SKU y flujos
   - Acceso de usuarios ODISEO
   - Perfiles de rol y separación de responsabilidades
   - Catalogs y consolidación

2. **Documentación Existente**
   - CLAUDE.md o documentación de proyecto (si existe)
   - Comentarios en el código
   - Commit messages con contexto funcional
   - Issues o tickets de requisitos

### Hitos Previos Completados

- ✓ Frontend funcional en React
- ✓ Mocks de clientes, portafolios, productos, solicitudes
- ✓ Interfaces TypeScript/tipos definidos
- ✓ Flujos de usuario implementados
- ✓ Validaciones del frontend en funcionamiento
- ✓ Catálogos hardcodeados disponibles

---

## Criterios de Aceptación

El objetivo se considerará **COMPLETADO** cuando se cumplan todos estos criterios:

### Documentación Entregada

- [ ] Reporte de diagnóstico en formato markdown o documento estructurado
- [ ] Inventario de entidades con atributos y relaciones
- [ ] Mapeo de pantallas a endpoints requeridos
- [ ] Listado de validaciones y reglas de negocio identificadas
- [ ] Propuesta de modelo de dominio con diagrama o descripción textual
- [ ] Propuesta de esquema de base de datos
- [ ] Lista de endpoints iniciales (método, ruta, responsabilidad)

### Propuesta Técnica

- [ ] Arquitectura backend propuesta documentada (capas, componentes)
- [ ] Justificación de decisiones tecnológicas (framework, BD, ORM)
- [ ] Patrones y convenciones recomendadas alineados con proyecto actual
- [ ] Propuesta de estructura de carpetas para backend

### Roadmap de Implementación

- [ ] 11 etapas claramente definidas con orden secuencial
- [ ] Dependencias entre etapas documentadas
- [ ] Entregables por etapa especificados
- [ ] Criterios de aceptación por etapa definidos
- [ ] Esfuerzo estimado por etapa (opcional pero útil)

### Análisis de Riesgos

- [ ] Riesgos identificados con probabilidad e impacto
- [ ] Supuestos técnicos y funcionales documentados
- [ ] Definiciones faltantes o ambiguas registradas
- [ ] Preguntas pendientes para stakeholders listadas
- [ ] Inconsistencias detectadas reportadas

### Calidad del Diagnóstico

- [ ] Análisis basado en código real, no en asunciones
- [ ] Todos los datos hardcodeados localizados y documentados
- [ ] Todos los mocks identificados
- [ ] Validaciones existentes en frontend documentadas
- [ ] Reglas de negocio inferidas del frontend comportamiento
- [ ] No hay invención de requisitos no respaldados por el frontend

---

## Hitos y Validación

### Etapa 1: Análisis Inicial (Start)
**Objetivo:** Entender la estructura y tecnología del proyecto

- Revisar estructura de carpetas
- Identificar stack tecnológico
- Localizar archivos de configuración
- Documentar convenciones

**Validación:** Documento inicial con overview técnico completado

### Etapa 2: Mapeo de Datos (In Progress)
**Objetivo:** Localizar y catalogar todos los datos, mocks y servicios

- Identificar archivos con datos hardcodeados
- Documentar mocks y servicios simulados
- Crear inventario de entidades
- Mapear tipos e interfaces

**Validación:** Inventario completo de datos y mocks

### Etapa 3: Mapeo de Flujos (Pending)
**Objetivo:** Entender flujos funcionales y mapeo pantalla-a-datos

- Revisar cada pantalla y sus operaciones
- Documentar datos requeridos y esperados
- Identificar endpoints necesarios
- Mapear contratos de datos

**Validación:** Matriz pantalla-endpoint-datos completada

### Etapa 4: Validaciones y Reglas (Pending)
**Objetivo:** Documentar todas las validaciones y reglas de negocio

- Listar validaciones del frontend
- Identificar reglas de negocio
- Documentar catálogos y restricciones
- Crear matriz de validaciones

**Validación:** Catálogo completo de validaciones y reglas

### Etapa 5: Propuesta Técnica (Pending)
**Objetivo:** Definir arquitectura, modelo de datos y endpoints

- Proponer modelo de dominio
- Diseñar esquema de base de datos
- Listar endpoints iniciales
- Proponer arquitectura backend
- Justificar decisiones tecnológicas

**Validación:** Documentación técnica aprobada por usuario

### Etapa 6: Roadmap y Riesgos (Pending)
**Objetivo:** Crear plan de implementación y análisis de riesgos

- Definir 11 etapas de implementación
- Documentar dependencias
- Identificar riesgos y supuestos
- Listar definiciones faltantes
- Preparar preguntas para stakeholders

**Validación:** Plan de implementación y riesgos documentado

### Etapa 7: Entrega Final (Pending)
**Objetivo:** Consolidar diagnóstico en reporte final

- Compilar todos los análisis
- Crear documento ejecutivo
- Verificar completitud y calidad
- Entregar a usuario para aprobación

**Validación:** Reporte final aprobado por usuario

---

## Definiciones de Términos

- **Hardcodeados:** Datos definidos directamente en código fuente (constantes, literales)
- **Mocks:** Servicios simulados que replican comportamiento de APIs reales
- **Entidades:** Objetos de dominio (Customer, Product, etc.)
- **Validaciones:** Reglas que verifican conformidad de datos
- **Catálogos:** Listas de opciones válidas (materiales, estructuras, estados)
- **Contrato de datos:** Formato esperado de input/output (JSON schema, tipos)
- **Endpoints:** Rutas HTTP que expone el API
- **Arquitectura:** Organización de componentes y sus responsabilidades

---

## Notas Importantes

- Este diagnóstico **NO incluye implementación de código**
- El frontend se usa como **fuente de verdad funcional**
- Los datos y reglas identificadas **deben estar respaldados por el código del frontend**
- Los supuestos se documentan claramente para validación posterior
- El roadmap de implementación será incremental y verificable
- La propuesta técnica es compatible con convenciones existentes del proyecto

---

**Creado:** 2026-08-01  
**Estado:** En Progreso  
**Próximo Paso:** Iniciar análisis del repositorio (Etapa 2)
