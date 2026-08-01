---
shaping: true
---

# Backend ODISEO — Shaping

## Frame

### Problem

Frontend ODISEO actual es funcional pero depende de mocks y datos hardcodeados. Necesita backend real que:
- Persista datos de clientes, portafolios, productos, solicitudes
- Implemente validaciones complejas (DEVIN, dimensiones, materiales, estructuras)
- Genere SKUs inteligentes
- Maneje catálogos maestros y combinaciones válidas
- Soporte roles, permisos y acceso de usuarios
- Escale con integridad de datos

### Outcome

Backend REST API completamente funcional que reemplace mocks progresivamente, manteniendo compatibilidad con frontend existente. Arquitectura limpia, extensible y con validaciones de negocio centralizadas.

---

## Requirements (R)

| ID | Requirement | Status |
|----|-------------|--------|
| R0 | Backend escrito en Node.js + NestJS | Core goal |
| R1 | Persistencia en PostgreSQL (NEON) con Prisma ORM | Core goal |
| R2 | Modelo de dominio rico con agregados y value objects | Core goal |
| R3 | Validaciones de negocio en schema Prisma + documentadas aparte | Core goal |
| R4 | 100% de pantallas frontend mapeadas a endpoints | Must-have |
| R5 | Endpoints con especificación detallada (método, ruta, params, body, response, códigos HTTP) | Must-have |
| R6 | Catálogos maestros con estructura, valores y relaciones documentadas | Must-have |
| R7 | Arquitectura de capas (Controllers → Services → Repositories → Domain) | Must-have |
| R8 | Estructura de carpetas y módulos definida | Must-have |
| R9 | Restricciones técnicas identificadas y documentadas | Must-have |
| R10 | Dependencias entre módulos/funcionalidades mapeadas | Must-have |

---

## A: Backend Node.js + NestJS + NEON + Prisma (DDD Ligero)

### Decisiones Técnicas

| Decisión | Elección | Justificación |
|----------|----------|---------------|
| Runtime | Node.js 20+ | Alineado con frontend React, ecosystem npm maduro |
| Framework | NestJS | Estructura inyección de dependencias, decoradores, modular |
| BD | NEON PostgreSQL serverless | Escalable, confiable, PostgreSQL probado, serverless para costos |
| ORM | Prisma | Type-safe, schema + runtime ORM, migraciones declarativas |
| Modelo dominio | Rico + DDD ligero | Lógica de negocio en entidades, agregados, invariantes |
| Patrón arquitectura | Capas (Controllers → Services → Repositories → Domain) | Separación clara de responsabilidades |
| Validaciones | Prisma schema + documento aparte | DB constraints + reglas de negocio |

### Partes de la Solución

| Parte | Mecanismo |
|-------|-----------|
| **A1** | **Estructura de proyecto** — `/src` con carpetas: `domain/`, `application/`, `infrastructure/`, `api/controllers`, `api/dto`, `database/migrations` |
| **A2** | **Entidades de dominio** — Clases con lógica (Product, Portfolio, ProductRequest, User, Role) con métodos de validación e invariantes |
| **A3** | **Agregados y value objects** — Product contiene Layers, Dimensions es value object, SKU inmutable |
| **A3.1** | **Validaciones DEVIN** — Implementadas en método `validateStructure()` de Product, reglas hardcodeadas en código |
| **A3.2** | **Generación de SKU** — Método `generateSKU()` en Product, lógica determinística basada en atributos |
| **A4** | **Prisma schema** — Define tablas, relaciones, constraints, índices, tipos |
| **A4.1** | **Schema Prisma estructura** — Campos con tipos (`String`, `Int`, `DateTime`), relaciones (@relation), constraints (`@unique`, `@db.VarChar()`) |
| **A4.2** | **Catálogos maestros** — Tablas: `Material`, `Structure`, `Format`, `User`, `Role`, `Permission` con valores reales |
| **A5** | **Servicios de aplicación** — Orquestan lógica de dominio + persistencia (ProductService, PortfolioService, etc.) |
| **A6** | **Repositorios** — Abstracción de acceso a datos, queries Prisma centralizadas |
| **A7** | **Controladores REST** — NestJS @Controller decorators, endpoints HTTP con validación de input (DTO), mapeo a servicios |
| **A7.1** | **DTOs de entrada** — Validación con `class-validator` (decorators) |
| **A7.2** | **Documentación de endpoints** — Tabla con: método HTTP, ruta, params, body ejemplo, response ejemplo, códigos HTTP (200, 400, 401, 404, 422), validaciones aplicadas |
| **A8** | **Módulos NestJS** — Cada feature es módulo (ProductsModule, PortfoliosModule, UsersModule) con controladores + servicios |
| **A9** | **Middleware de autenticación** — JWT tokens, guards NestJS, autorización por roles |
| **A10** | **Migraciones Prisma** — `prisma migrate dev/prod`, versionadas, reversibles |
| **A11** | **Seeders** — Poblar catálogos maestros (materiales, estructuras, usuarios iniciales) |

### Restricciones Técnicas

| Restricción | Implicación |
|-------------|------------|
| NEON tiene límite de conexiones | Pool de conexiones Prisma configurado, máx 10-20 simultáneas |
| Prisma no soporta algunos tipos SQL avanzados | Validaciones complejas en código, no en CHECK constraints |
| Frontend no puede cambiar formato datos | API debe retornar exactamente lo que frontend espera |
| Validaciones DEVIN son reglas de negocio inmutables | Codificadas, no configurables |

### Dependencias Técnicas

| Dependencia | Bloqueador | Desbloqueador |
|-------------|-----------|---------------|
| Servicio autenticación | Protege todos los endpoints autenticados | JWT middleware implementado primero |
| Schema Prisma | Base para repositorios y servicios | Definir completo antes de endpoints |
| Entidades de dominio | Lógica de validación centralizada | Modelado antes de servicios |
| Catálogos maestros | Seed data para tests y dev | Valores extraídos del frontend |

---

## Fit Check: R × A

| ID | Requirement | Status | A |
|----|-------------|--------|---|
| R0 | Backend escrito en Node.js + NestJS | Core goal | ✅ |
| R1 | Persistencia en PostgreSQL (NEON) con Prisma ORM | Core goal | ✅ |
| R2 | Modelo de dominio rico con agregados y value objects | Core goal | ✅ |
| R3 | Validaciones de negocio en schema Prisma + documentadas aparte | Core goal | ✅ |
| R4 | 100% de pantallas frontend mapeadas a endpoints | Must-have | ✅ |
| R5 | Endpoints con especificación detallada | Must-have | ✅ |
| R6 | Catálogos maestros documentados | Must-have | ✅ |
| R7 | Arquitectura de capas definida | Must-have | ✅ |
| R8 | Estructura de carpetas definida | Must-have | ✅ |
| R9 | Restricciones técnicas identificadas | Must-have | ✅ |
| R10 | Dependencias entre módulos mapeadas | Must-have | ✅ |

**Notas:**
- Todas las decisiones técnicas están explícitas
- Shape A satisface todos los requerimientos

---

## Estructura de Carpetas Propuesta

```
/backend
├── src/
│   ├── domain/                    # Lógica de negocio pura
│   │   ├── entities/              # Product, Portfolio, ProductRequest, User, Role
│   │   ├── aggregates/            # Agregados complejos
│   │   ├── value-objects/         # Dimensions, SKU, etc.
│   │   └── repositories/          # Interfaces (contrato, no implementación)
│   ├── application/               # Servicios de aplicación
│   │   ├── services/              # ProductService, PortfolioService, etc.
│   │   └── dto/                   # DTOs de entrada/salida
│   ├── infrastructure/            # Implementación técnica
│   │   ├── repositories/          # Implementación Prisma de interfaces
│   │   ├── database/              # Seeders, migrations
│   │   └── config/                # Configuración (env, DB, etc.)
│   ├── api/                       # Controladores REST
│   │   ├── controllers/           # Endpoints por módulo
│   │   ├── decorators/            # Decoradores custom
│   │   └── middleware/            # Auth, logging, etc.
│   ├── modules/                   # Módulos NestJS
│   │   ├── products.module.ts
│   │   ├── portfolios.module.ts
│   │   └── users.module.ts
│   ├── app.module.ts              # Root module
│   └── main.ts                    # Entry point
├── prisma/
│   ├── schema.prisma              # Definición de DB
│   └── migrations/                # Versionadas
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## Modelo de Dominio (Alto Nivel)

### Agregados Principales

| Agregado | Value Objects | Métodos de Dominio | Invariantes |
|----------|----------------|-------------------|------------|
| **Product** | Dimensions, SKU, Layer | `validateStructure()`, `generateSKU()`, `addLayer()` | Siempre tiene Material válido, Estructura validada |
| **Portfolio** | — | `addProduct()`, `removeProduct()` | Pertenece a Customer, no puede estar vacío |
| **ProductRequest** | Status, Timeline | `changeStatus()`, `assignUser()` | Estado sigue ciclo de vida definido |
| **User** | — | `assignRole()`, `checkPermission()` | Tiene al menos un Role |
| **Role** | — | `addPermission()` | Define conjunto de permisos |

---

## Próximos Pasos

1. **Crear documento de diagnóstico formal** — Compilar inventario de entidades, endpoints, validaciones, catálogos
2. **Definir schema Prisma completo** — Todas las tablas, relaciones, constraints
3. **Especificar endpoints** — Método, ruta, params, body, response, códigos HTTP
4. **Identificar etapas de implementación** — Derivadas de dependencias técnicas
5. **Comenzar Stage 1: Setup inicial** — Proyecto NestJS, Prisma config, DB setup

---

**Estado**: Aprobado para implementación  
**Última actualización**: 2026-08-01  
**Responsable**: Backend implementation team
