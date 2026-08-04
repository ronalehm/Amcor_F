# Backend Architecture

## Overview

The ODISEO backend follows a layered, domain-driven architecture:

```
┌─────────────────────────────────────────────┐
│          REST API (Controllers)             │  @Controller, @Get, @Post, etc.
├─────────────────────────────────────────────┤
│     Application Services (Orchestration)    │  Business logic coordination
├─────────────────────────────────────────────┤
│        Domain Layer (Business Rules)        │  Entities, Value Objects, Aggregates
├─────────────────────────────────────────────┤
│      Repositories (Data Abstraction)        │  Prisma ORM queries
├─────────────────────────────────────────────┤
│      Infrastructure (Prisma + PostgreSQL)   │  Persistence layer
└─────────────────────────────────────────────┘
```

## Directory Structure

```
src/
├── domain/                  # Business logic (NO dependencies on external libs)
│   ├── entities/            # Core domain objects (Product, User, Portfolio, etc.)
│   ├── aggregates/          # Complex entity clusters
│   ├── value-objects/       # Immutable objects (SKU, Dimensions, Money)
│   ├── repositories/        # Interfaces (contracts, not implementations)
│   └── exceptions/          # Domain-specific exceptions
│
├── application/             # Use cases, services, DTOs (knows about domain)
│   ├── services/            # ProductService, PortfolioService, etc.
│   ├── dto/                 # Data Transfer Objects (input/output)
│   └── commands/            # Use case commands (optional, for CQRS)
│
├── infrastructure/          # Technical details (Prisma, database)
│   ├── repositories/        # Prisma implementations of repository interfaces
│   ├── database/
│   │   ├── migrations/      # Prisma migrations (version-controlled)
│   │   └── seeders/         # Database seeders for test data
│   └── config/              # Configuration (env, logging, etc.)
│
├── api/                     # HTTP layer (Controllers, Guards, Interceptors)
│   ├── controllers/         # REST endpoint handlers
│   ├── decorators/          # Custom decorators (@IsAdmin, @CurrentUser, etc.)
│   ├── filters/             # Exception filters (handle errors globally)
│   ├── guards/              # Authorization guards (JwtAuthGuard, RolesGuard)
│   ├── interceptors/        # Request/response transformation, logging
│   └── middleware/          # Express middleware (CORS, logging, etc.)
│
├── shared/                  # Cross-cutting concerns
│   ├── constants/           # App-wide constants
│   ├── types/               # Shared TypeScript types/interfaces
│   ├── utils/               # Utility functions
│   └── validators/          # Custom class-validator decorators
│
├── app.module.ts            # Root NestJS module (imports all modules)
└── main.ts                  # Entry point (bootstrap)
```

## Key Principles

### 1. **Dependency Inversion**
- Controllers depend on Service interfaces, not implementations
- Services depend on Repository interfaces, not Prisma directly
- Dependencies injected via NestJS `@Injectable()`

### 2. **Domain-Driven Design (Light)**
- Domain entities hold business logic (validateStructure, generateSKU)
- Domain knows nothing about HTTP, databases, or frameworks
- Value Objects are immutable (SKU, Dimensions)

### 3. **Layering**
- Each layer has a single responsibility
- Upper layers depend on lower layers, never circular
- Easy to replace implementations (e.g., swap Prisma for another ORM)

### 4. **Validation Strategy**
- **DTO Level**: Input format (required fields, types, email format)
- **Domain Level**: Business rules (DEVIN, material validity, dimension constraints)
- **Database Level**: Constraints (unique, foreign keys, NOT NULL)

### 5. **Error Handling**
- Custom exceptions from domain (DomainException, ValidationError)
- Global exception filter catches and converts to HTTP responses
- Consistent error response shape

## Module Structure

Each feature is a NestJS Module (self-contained):

```typescript
@Module({
  controllers: [ProductsController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductsModule {}
```

Modules can be:
- Imported into AppModule
- Lazy-loaded (per route)
- Tested independently

## Database & Prisma

- **Schema**: `prisma/schema.prisma` (source of truth)
- **Migrations**: Auto-generated, version-controlled, reversible
- **Seeders**: Populate test/reference data
- **Client**: `@prisma/client` (type-safe ORM)

## Testing Strategy

- **Unit Tests**: Domain logic (entities, services)
- **Integration Tests**: Full HTTP request cycle (controller → service → repository)
- **Test Database**: SQLite in-memory or Testcontainers PostgreSQL

## Environment & Configuration

- **.env.example**: Template for required variables
- **.env.local**: Local development secrets (gitignored)
- **ConfigModule**: NestJS global configuration

## Build & Deployment

```bash
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled dist/main.js
npm run dev      # Watch mode for development
```

Output:
- `dist/` — Compiled JavaScript + source maps
- Ready for Docker, serverless, or traditional VM deployment
