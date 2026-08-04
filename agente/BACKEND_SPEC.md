---
title: Backend ODISEO — Technical Specification
version: 1.0
status: ready-for-agent
date: 2026-08-01
---

# Backend ODISEO — Technical Specification

## Problem Statement

The current ODISEO frontend is fully functional but relies on:
- **Hardcoded data** in TypeScript files (60+ files with mocks, catalogs, seeds)
- **LocalStorage persistence** (no centralized server state)
- **Frontend-only validations** of complex business rules (DEVIN structures, material restrictions, dimensions)
- **No audit trail** for regulatory compliance
- **No role-based access control** at data layer (enforced only in UI)
- **Manual SKU generation** without deterministic backend logic

This creates:
- **Data integrity risks**: No database constraints, multiple sources of truth
- **Scalability issues**: Cannot scale to multiple concurrent users safely
- **Maintenance burden**: Catalog changes require frontend deployments
- **Compliance gaps**: No audit logging, no centralized permission enforcement

**Users affected**: Commercial executives, product managers, technical teams, admins who need to:
- Create/modify products with complex validation rules
- Request approval of product changes via workflows
- Share portfolios across teams
- Maintain audit trail for compliance
- Scale from pilot (5 users) to production (50+ users)

## Solution

Build a **REST API backend** (Node.js + NestJS + PostgreSQL/NEON + Prisma) that:

1. **Centralizes data** — Single source of truth in PostgreSQL via Prisma ORM
2. **Enforces validations** — Business rules (DEVIN, materials, dimensions, SKU generation) implemented as Domain Model methods
3. **Secures access** — JWT + role-based guards on all endpoints
4. **Audits operations** — Every create/update/delete logged with user, timestamp, changes
5. **Maintains backward compatibility** — API contracts match frontend expectations exactly
6. **Scales incrementally** — 11-stage roadmap, each stage builds on previous, independently deployable
7. **Enables compliance** — Audit trail, user attribution, permission enforcement at database level

The backend replaces mock services progressively—frontend stays unchanged, calls switch from `localStorage` to `fetch(API)` gradually per module.

---

## User Stories

### Authentication & Authorization

1. As a system, I want to validate JWT tokens on every authenticated request, so that only authorized users access protected endpoints.

2. As an admin, I want to assign roles to users (administrator, master_data, commercial, customer_service) at backend level, so that permissions are enforced consistently across all integrations.

3. As a commercial executive, I want to see only portfolios and products assigned to me, so that I cannot accidentally access competitors' data.

4. As an API consumer, I want clear error responses (401 Unauthorized, 403 Forbidden, 422 Unprocessable Entity) with validation details, so that I know what went wrong and how to fix it.

5. As a system auditor, I want to track every user action (create, update, delete) with timestamp, user ID, and changed fields, so that we meet compliance requirements for data integrity.

### Product Management (Core Domain)

6. As a product manager, I want to create a new product by specifying material, structure, dimensions, and format plan, so that I can build a product catalog.

7. As a system, I want to automatically generate a deterministic SKU based on product attributes (material code, structure type, format), so that SKUs are unique and consistent.

8. As a system, I want to validate product structure against DEVIN rules (405 valid combinations), so that only approved material layers are saved.

9. As a system, I want to enforce material restrictions by layer (VALIDADA flag, specific materials per layer), so that incompatible structures are rejected.

10. As a system, I want to validate dimensions (width, length, perimeter) against format plan constraints, so that only physically feasible products are created.

11. As a product manager, I want to modify an approved product and track the modification as a new version, so that I can iterate without losing history.

12. As a system, I want to provide a list of valid materials and structures per product classification (Producto Nuevo vs Producto Modificado), so that frontend can populate dropdowns correctly.

13. As a technical team member, I want to bulk import products from CSV/Excel, so that I can seed the catalog quickly.

### Product Requests & Workflow

14. As a commercial executive, I want to create a product request that references an approved product or requests a new structure, so that I can initiate the approval workflow.

15. As a system, I want to enforce product request state machine (CREADO → EN_PROCESO → VALIDACION_TECNICA → APROBADO → RECHAZADO), so that requests follow defined workflows.

16. As a technical validator, I want to receive product requests in a queue and mark them as validated, so that approval process is tracked.

17. As a system, I want to prevent modification of product requests in terminal states (APROBADO, RECHAZADO), so that audit trail remains immutable.

### Portfolio Management

18. As a commercial executive, I want to create a portfolio with a collection of approved products, so that I can present a customer offering.

19. As a portfolio owner, I want to add/remove products from my portfolio, so that I can adjust offerings based on customer needs.

20. As a system, I want to prevent deletion of portfolios with associated datasheets, so that no orphaned records remain.

21. As a commercial executive, I want to filter portfolios by status (Borrador, Activo, Inactivo, Aprobado), so that I can find active offerings.

### Client Management

22. As a customer service representative, I want to create a client record with contact, segment, and RUC, so that I can track customer relationships.

23. As a system, I want to validate RUC format and uniqueness, so that duplicate clients are prevented.

24. As a system, I want to associate portfolios with clients, so that I can track customer offerings.

25. As a customer service rep, I want to view all portfolios assigned to a client, so that I understand customer relationship history.

### User & Permission Management

26. As an admin, I want to create user accounts with email, password, full name, and role assignment, so that team members can access the system.

27. As a system, I want to enforce password requirements (min 8 chars, complexity) at backend level, so that accounts are secure.

28. As an admin, I want to lock/unlock user accounts and track status (active, inactive, pending_validation, pending_sync), so that I control access.

29. As a system, I want to assign commercial executives to users for SI (Seguridad Informatica) mirror functionality, so that I can synchronize data access across portals.

30. As a user, I want to reset my password via email link, so that I regain access if I forget credentials.

### Catalog Management (Master Data)

31. As an admin, I want to manage material catalog (name, density, VALIDADA flag, chemical properties) via API endpoints, so that I can maintain technical specifications.

32. As an admin, I want to manage structure types (sandwich, monolayer, custom layers) with layer configuration, so that I can define valid product architectures.

33. As a system, I want to manage dimension restriction rules (per format plan: min/max width, length, perimeter), so that I can enforce physical constraints.

34. As an admin, I want to view all catalog options with counts of products using each option, so that I understand catalog utilization.

35. As a system, I want to prevent deletion of catalog items in use, so that data integrity is maintained.

36. As a system, I want to seed catalogs from hardcoded values on first backend deployment, so that system is ready without manual data entry.

### Datasheets & Documentation

37. As a commercial executive, I want to generate product datasheets (PDF or HTML) from product specifications, so that I can share with customers.

38. As a system, I want to track datasheet versions and creation date, so that I can audit document history.

39. As a product owner, I want to associate multiple datasheets with a product, so that I can have Spanish, English, and technical variants.

### Reporting & Analytics

40. As a system admin, I want to retrieve audit logs filtered by date range, user, entity type, so that I can investigate changes.

41. As a business analyst, I want to query products by segment, material, structure, creation date, so that I can analyze catalog composition.

42. As a manager, I want to see counts of products, portfolios, and requests by status, so that I can track pipeline health.

### Data Import/Export

43. As an admin, I want to export products to CSV with all attributes, so that I can perform external analysis.

44. As an admin, I want to bulk import products from CSV, validating each row against business rules, so that I can seed or migrate data.

45. As a system, I want to return detailed validation errors for failed imports (row, column, error reason), so that user can fix and retry.

### Integration Points

46. As a system, I want to support upsert operations (create or update if exists), so that imports can be idempotent.

47. As a future integrator, I want all endpoints documented with OpenAPI/Swagger, so that third parties can integrate easily.

48. As an external system (e.g., ERP), I want to query approved products via API with filtering and pagination, so that I can sync master data.

---

## Implementation Decisions

### Architecture & Layering

**Decision 1: Layered Architecture (Controller → Service → Repository → Domain)**

- **Controller Layer** (`api/controllers/`): HTTP request handling, DTO validation (class-validator), exception catching, response serialization
- **Application Service Layer** (`application/services/`): Business logic orchestration, audit logging, transaction coordination
- **Domain Layer** (`domain/entities/`, `domain/aggregates/`, `domain/value-objects/`): Rich model with methods (generateSKU, validateStructure, etc.), invariant enforcement
- **Repository Layer** (`infrastructure/repositories/`): Data access abstraction, Prisma mapping, query centralization
- **Middleware Layer** (`api/middleware/`): Cross-cutting concerns (JWT auth, logging, error handling)

*Rationale*: Clear separation of concerns, testability, business logic not scattered across layers, easy to add decorators (logging, caching) later.

---

### Technology Choices

**Decision 2: Node.js 20+ + NestJS Framework**

Stack choice:
- **Runtime**: Node.js 20+ (LTS, aligns with frontend ecosystem, npm maturity)
- **Framework**: NestJS (dependency injection, decorators, module system, built-in guards/interceptors)
- **Database**: PostgreSQL via NEON (serverless, scalable, transactional, free tier suitable for pilot)
- **ORM**: Prisma 5+ (type-safe, declarative schema, migrations, excellent DX)
- **Validation**: class-validator + custom domain validators
- **Authentication**: JWT (stateless, scalable, frontend-friendly)
- **Logging**: Winston or Pino + audit trail table

*Rationale*: 
- NestJS provides structure for medium-to-large team
- Prisma integrates cleanly with TypeScript, migrations are version-controlled
- NEON PostgreSQL is free tier for pilot, scales seamlessly
- JWT is stateless (no session server needed)

---

### Domain Model & Rich Entities

**Decision 3: Rich Domain Model with Aggregates & Value Objects**

Core aggregates:

| Aggregate | Root Entity | Value Objects | Key Methods |
|-----------|------------|----------------|------------|
| **Product** | Product | Dimensions (width, length, perimeter), SKU, Layer | `generateSKU()`, `validateStructure()`, `addLayer()` |
| **ProductRequest** | ProductRequest | Status (enum), Timeline | `changeStatus()`, `assignValidator()` |
| **Portfolio** | Portfolio | — | `addProduct()`, `removeProduct()` |
| **User** | User | — | `assignRole()`, `checkPermission()` |
| **Commercial Executive** | CommercialExecutive | — | `assignUser()` |

*Rationale*: 
- Encapsulates business logic (validations, state transitions) in entities
- Prevents anemic models where logic lives in services
- Easier to test domain logic independently

Example: `Product.generateSKU()` is deterministic method on entity, not scattered service logic.

---

### Validation Strategy

**Decision 4: Multi-Level Validation (DTO + Domain + Database)**

| Level | Tool | Responsibility |
|-------|------|-----------------|
| **DTO** | class-validator decorators | Input format (required, email format, enum) |
| **Domain** | Entity methods + Prisma constraints | Business rules (DEVIN 405 valid combos, material VALIDADA flag, dimension ranges) |
| **Database** | Prisma schema constraints | Uniqueness (SKU, RUC), Foreign keys, NOT NULL |

Example validation flow for create product:
1. DTO validator checks `{name, materialId, structureId, dimensions}` are present and typed
2. ProductService calls `Product.validateStructure()` which checks:
   - Material is VALIDADA
   - Layer materials are valid per DEVIN rules
   - Dimensions fall within format plan constraints
3. Prisma inserts → database constraints enforced (unique SKU, FK integrity)

*Rationale*: Fail fast at DTO level, enforce business rules at domain level, database as safety net.

---

### SKU Generation

**Decision 5: Deterministic SKU Generation on Product Entity**

SKU algorithm (deterministic, no UUIDs):
```
SKU = [MATERIAL_PREFIX][STRUCTURE_ID][FORMAT][SEQUENCE]
Example: "ST-SANDWICH-A3-001"
- ST = Steel (material)
- SANDWICH = Structure type
- A3 = Format plan
- 001 = Sequence number (auto-increment per material+structure combo)
```

*Rationale*:
- SKUs are human-readable and business-meaningful
- Deterministic (same input always produces same SKU)
- Supports bulk import (can generate SKU before insert)
- No need for external SKU service

---

### Database Schema (Prisma)

**Decision 6: Relational Schema with Prisma Declarative Approach**

Core tables (non-exhaustive):

```prisma
model Product {
  id           String   @id @default(cuid())
  sku          String   @unique
  name         String
  materialId   String
  structureId  String
  material     Material @relation(fields: [materialId], references: [id])
  structure    Structure @relation(fields: [structureId], references: [id])
  layers       Layer[]
  dimensions   Dimensions?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  createdById  String
  createdBy    User @relation("ProductCreatedBy", fields: [createdById], references: [id])
}

model Layer {
  id          String @id @default(cuid())
  productId   String
  product     Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  materialId  String
  material    Material @relation(fields: [materialId], references: [id])
  thickness   Float
  order       Int
}

model Material {
  id        String @id @default(cuid())
  name      String @unique
  density   Float
  validada  Boolean @default(false)
  products  Product[]
  layers    Layer[]
}

model ProductRequest {
  id        String @id @default(cuid())
  status    Status @default(CREADO)  // CREADO, EN_PROCESO, VALIDACION_TECNICA, APROBADO, RECHAZADO
  productId String
  product   Product @relation(fields: [productId], references: [id])
  requestedBy String
  user      User @relation(fields: [requestedBy], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model User {
  id          String @id @default(cuid())
  email       String @unique
  passwordHash String
  fullName    String
  roleId      String
  role        Role @relation(fields: [roleId], references: [id])
  status      UserStatus @default(ACTIVE)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model AuditLog {
  id        String @id @default(cuid())
  userId    String
  user      User @relation(fields: [userId], references: [id])
  action    String  // CREATE, UPDATE, DELETE
  entity    String  // Product, User, Portfolio
  entityId  String
  changes   Json    // {before: {}, after: {}}
  timestamp DateTime @default(now())
}
```

*Rationale*:
- Normalized schema (reduces duplication, enforces integrity)
- Declarative Prisma syntax is self-documenting
- Migrations are version-controlled
- Easily add indexes, constraints later

---

### Authentication & Authorization

**Decision 7: JWT + Role-Based Guards**

- **Auth Flow**: Login endpoint issues JWT, frontend stores in memory/sessionStorage
- **Protected Endpoints**: @UseGuards(JwtAuthGuard) on controller methods
- **Roles**: User has one Role with multiple Permissions (e.g., Role.COMMERCIAL can create portfolios but not manage users)
- **Audit**: Every endpoint logs user ID from JWT payload to audit_log

*Rationale*:
- Stateless (no session server needed, scales horizontally)
- Frontend-friendly (bearer token in Authorization header)
- Permissions are data-driven (stored in db, not hardcoded)

---

### Endpoints Strategy

**Decision 8: RESTful Endpoints with Consistent Contracts**

Endpoint pattern:
```
POST /products                      Create product
GET  /products                      List (paginated, filterable)
GET  /products/:id                  Get single
PATCH /products/:id                 Update
DELETE /products/:id                Delete (soft-delete for audit)

POST /product-requests              Create request
GET  /product-requests/:id          Get single
PATCH /product-requests/:id/status  Change status
GET  /product-requests              List by status/user
```

Response contract (always same structure):
```json
{
  "data": {...},              // The entity or list
  "meta": {                   // Pagination/filtering info
    "total": 100,
    "page": 1,
    "limit": 10
  },
  "errors": null              // Null on success, array of strings on error
}
```

Error response:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "materialId": "Material VALIDADA flag is false"
  }
}
```

*Rationale*:
- Consistent contracts make frontend integration predictable
- Pagination built-in (scale to 10k+ products)
- Soft deletes preserve audit trail

---

### Module Organization (NestJS)

**Decision 9: Feature Modules Encapsulate Controllers + Services**

```
src/
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── products/
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── products.repository.ts
│   │   └── products.module.ts
│   ├── portfolios/
│   ├── users/
│   ├── product-requests/
│   └── catalogs/
├── domain/
│   ├── entities/
│   │   ├── product.entity.ts
│   │   ├── portfolio.entity.ts
│   │   └── ...
│   ├── value-objects/
│   │   ├── dimensions.vo.ts
│   │   ├── sku.vo.ts
│   └── exceptions/
│       └── domain-exception.ts
├── infrastructure/
│   ├── repositories/
│   │   ├── product.repository.ts
│   │   └── ...
│   └── database/
│       ├── migrations/
│       └── seeders/
├── shared/
│   ├── filters/
│   ├── interceptors/
│   ├── decorators/
│   └── utils/
└── app.module.ts
```

*Rationale*:
- Each module is independent (Controller → Service → Repository)
- Encapsulation (other modules use service interfaces, not internal repositories)
- Easy to test in isolation
- Scales to 50+ features without monolith problems

---

### Seeding & Initial Data

**Decision 10: Seed Database from Hardcoded Values on Deployment**

- Extract all hardcoded catalogs from frontend (materials, structures, format plans, executives, users)
- Create Prisma seeders that run on first deploy
- Seed data is idempotent (upsert on unique constraints)
- Catalogs are then editable via admin endpoints

```typescript
// prisma/seeders/materials.seeder.ts
async function seedMaterials() {
  const materials = [
    { name: 'Steel', density: 7.85, validada: true },
    { name: 'Aluminum', density: 2.7, validada: true },
    // ... 60+ more from frontend hardcode
  ];
  
  for (const mat of materials) {
    await prisma.material.upsert({
      where: { name: mat.name },
      update: mat,
      create: mat,
    });
  }
}
```

*Rationale*:
- No manual database seeding after deploy
- Catalogs source of truth moves from frontend constants to backend database
- Auditable changes (who updated materials)

---

### Incremental Implementation (11 Stages)

**Decision 11: Vertical Slice Approach, Each Stage Independently Demable**

| Stage | Focus | Deliverable | Frontend Impact |
|-------|-------|-------------|-----------------|
| **1** | Auth + Setup | JWT guard works, 401 on invalid token | Nothing (backend-only) |
| **2** | Product Entity + Domain | SKU generates, DEVIN validation works | Nothing (still using mocks) |
| **3** | Database + Repositories | Save to DB, retrieve, soft deletes | Nothing (still using mocks) |
| **4** | Product CRUD Endpoints | POST/GET/PATCH /products works | Switch ProductListPage to fetch API |
| **5** | Portfolio CRUD | POST/GET/PATCH /portfolios | Switch PortfolioEditPage to fetch API |
| **6** | ProductRequest Workflow | State machine, status transitions | Switch RequestQueue to fetch API |
| **7** | Catalogs + Seeders | Material/Structure endpoints, seeded data | Catalogs now dynamic from backend |
| **8** | User & Role Management | User CRUD, permission guards | Switch UserListPage to fetch API |
| **9** | Client Management | Client CRUD, segment/RUC validation | Switch ClientListPage to fetch API |
| **10** | Datasheet Generation | PDF/HTML generation, versioning | Switch DatasheetEditPage to fetch API |
| **11** | Audit Logging + Reporting | Full audit trail, analytics endpoints | Admin dashboard can query audit logs |

Each stage:
- Has clear entry/exit criteria
- Can be deployed independently (feature flags optional)
- Includes database migrations
- Includes endpoint specs
- Includes integration tests

*Rationale*:
- Reduces risk (small, verifiable increments)
- Enables parallel work (frontend dev can mock stage 4 while we build stage 3)
- Demonstrates progress to stakeholders each sprint

---

### Catalog & Reference Data

**Decision 12: Centralized Catalog Management (POST, PUT, DELETE)**

Admin endpoints for catalogs:
```
POST   /catalogs/materials          Create material
GET    /catalogs/materials          List all (with product counts)
GET    /catalogs/materials/:id      Get single
PATCH  /catalogs/materials/:id      Update
DELETE /catalogs/materials/:id      Delete (only if no products use it)

POST   /catalogs/structures
GET    /catalogs/structures
...
```

*Rationale*:
- Catalogs are master data, not application configuration
- Changes persist to database (audit trail)
- Frontend fetches on startup, caches locally, polls for updates periodically

---

## Testing Decisions

### Testing Philosophy

**Principle**: Test external behavior (HTTP contracts), not implementation details.

- **Do test**: Endpoint returns correct status code + data shape, validations reject invalid input, audit log records action
- **Do not test**: Internal service methods, private helper functions, exact error message wording

### Test Seams

**Seam 1: Controller Layer** (Highest Seam)
- **Test what**: POST /products with invalid DTO → 400 Bad Request with validation errors
- **Test what**: POST /products without JWT → 401 Unauthorized
- **How**: Integration test hitting real NestJS app + in-memory database
- **Tool**: jest + supertest (or similar)

**Seam 2: Service Layer** (If needed)
- **Test what**: ProductService.create() validates structure, calls repository, returns Product
- **How**: Unit test with mocked repository
- **Only if**: Service has non-trivial orchestration logic

**Seam 3: Repository Layer** (Optional)
- **Test what**: ProductRepository.save() transforms entity to Prisma shape, handles unique constraint violations
- **How**: Unit test with mocked Prisma client
- **Only if**: Repository has complex query logic

**Recommendation**: Start with Seam 1 (integration tests). Move to lower seams only when integration tests become slow or flaky.

---

### Test Modules

| Module | Test Type | Existing Prior Art |
|--------|-----------|-------------------|
| **Products** | Integration (CRUD + validations) | [ProductListPage.test.tsx](src/modules/products/pages/__tests__/ProductListPage.test.tsx) if it exists, or adapt from ClientListPage |
| **ProductRequests** | Integration (state machine) | None yet, but use ProductList pattern |
| **Portfolios** | Integration (CRUD + product relationship) | [PortfolioEditPage](src/modules/portfolio/pages/PortfolioEditPage.tsx) pattern |
| **Users** | Integration (role assignment, permissions) | [UserListPage](src/modules/users/pages/UserListPage.tsx) pattern |
| **Auth** | Integration (JWT validation, guards) | [LoginPage](src/modules/auth/pages/LoginPage.tsx) has login flow |
| **Catalogs** | Integration (CRUD + deletion constraints) | None yet |
| **Audit** | Query test (filters by date/user/entity) | None yet, but simple SELECT queries |

### Test Infrastructure

**Database for Tests**: Use containerized PostgreSQL or SQLite in-memory
- **Option A** (Recommended): Testcontainers-js (spins up real PostgreSQL in Docker)
- **Option B**: SQLite in-memory (faster, but slightly different SQL dialect)

Each test:
1. Start fresh database
2. Run migrations
3. Execute test
4. Tear down

---

## Out of Scope

### Code Implementation
- Writing NestJS controller/service/repository code
- Creating Prisma schema file or migrations
- Setting up GitHub Actions CI/CD
- Configuring environment variables (only documented, not deployed)

### Frontend Changes
- Modifying React components or pages
- Removing hardcoded data (happens gradually, tied to each stage)
- Changing CSS/styles
- Refactoring frontend architecture

### External Integrations
- Connecting to SAP, ERP, or legacy systems (future stage)
- Email service for password reset (documented, not implemented)
- PDF generation library selection (noted as future)
- Payment/billing systems

### Operational Concerns
- Production deployment strategy (k8s, serverless, etc.)
- Monitoring & alerting setup
- Disaster recovery & backup strategy
- Load testing & performance tuning

### Compliance & Security (Phase 2)
- GDPR/data deletion requirements
- Encryption at rest
- Rate limiting & DDoS protection
- CORS configuration for multiple frontends

---

## Further Notes

### Backward Compatibility

Frontend makes zero API calls until stage 4. Until then, all data flows from `localStorage` → mock services. No breaking changes possible.

Stage 4 and beyond: Frontend services switch from `localStorage` to `fetch(API)` per module. Old localStorage entries remain (no harm), new data goes to API.

### Audit Logging Requirements

Every data-mutating operation (create, update, delete) logs to `AuditLog` table:
```json
{
  "userId": "user-123",
  "action": "UPDATE",
  "entity": "Product",
  "entityId": "prod-456",
  "changes": {
    "before": { "name": "Old Name" },
    "after": { "name": "New Name" }
  },
  "timestamp": "2026-08-01T14:30:00Z"
}
```

Enables compliance queries: "Show me all changes to product X by user Y since date Z."

### Error Handling Strategy

**409 Conflict**: SKU already exists, RUC already registered
**422 Unprocessable Entity**: Business rule violation (DEVIN validation, dimension out of range, material not VALIDADA)
**400 Bad Request**: DTO validation failure (required field missing, type mismatch)
**401 Unauthorized**: Missing/invalid JWT
**403 Forbidden**: Valid JWT but insufficient permissions for this resource
**404 Not Found**: Resource doesn't exist

### Scalability Considerations

**Connection pooling**: Prisma configured for 10-20 max connections (NEON free tier limit)
**Pagination**: All list endpoints return max 50 items per page, cursor-based pagination for large result sets
**Indexing**: Indexes on foreign keys, unique constraints, frequently filtered fields (createdBy, status)
**Caching** (future): Redis layer for catalog reads, invalidation on update

### Dependency Injection Pattern

All services and repositories injected via NestJS `@Injectable()` decorator:
```typescript
@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}
}
```

No static methods or singletons—enables testing with mocks.

### Migrating from Mocks to API

For each stage:
1. Implement backend endpoints (stage N)
2. Frontend service code already has abstraction layer (localStorage vs fetch doesn't matter to components)
3. Switch service implementation from localStorage to fetch(API)
4. Update tests to use mock API responses (same shape as localStorage)

Example:
```typescript
// Before (localStorage)
const getProducts = () => JSON.parse(localStorage.getItem('products') || '[]');

// After (fetch)
const getProducts = async () => {
  const res = await fetch('/api/products', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

// Component code unchanged — calls getProducts() either way
```

---

## Glossary

- **DEVIN**: Material structure validation rules (405 valid combinations of material + structure + format)
- **VALIDADA**: Boolean flag on Material indicating it's approved for use
- **Agregado**: DDD term for cluster of objects treated as single unit (Product + Layers)
- **Value Object**: Immutable object (SKU, Dimensions) with no identity
- **Soft Delete**: Mark as deleted without removing data (preserves audit trail)
- **DTO**: Data Transfer Object (shape of API request/response body)
- **JWT**: JSON Web Token (stateless authentication)
- **Seeder**: Script that populates database with initial/reference data
- **Audit Trail**: Log of all data changes with user and timestamp

---

**Status**: ✅ Ready for backend implementation (Stage 1)  
**Created**: 2026-08-01  
**Next**: Create detailed Stage 1 implementation plan (Auth + Setup)
