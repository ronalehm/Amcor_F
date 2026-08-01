# ODISEO Backend API

NestJS + Prisma + PostgreSQL/NEON REST API for ODISEO product management system.

## Quick Start

### Prerequisites
- Node.js 20+
- npm/yarn
- PostgreSQL database (local or NEON cloud)

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy `.env.example` to `.env.local` and update values:
```bash
cp .env.example .env.local
```

2. Set your PostgreSQL connection string in `.env.local`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/odiseo_db"
```

### Development

```bash
# Start dev server with watch mode
npm run dev

# Health check
curl http://localhost:3000/health
```

### Database

```bash
# Run migrations
npm run db:migrate:dev

# Open Prisma Studio
npm run db:studio

# Seed database (when implemented)
npm run db:seed
```

### Code Quality

```bash
# Lint
npm run lint
npm run lint:fix

# Format
npm run format

# Tests
npm run test
npm run test:watch
npm run test:cov
```

### Build & Deploy

```bash
# Build TypeScript
npm run build

# Start production
npm start
```

## Architecture

```
src/
├── domain/              # Business logic (entities, value objects)
├── application/         # Services, DTOs, use cases
├── infrastructure/      # Repositories, database, config
├── api/                 # Controllers, decorators, middleware
├── shared/              # Filters, interceptors, utilities
└── main.ts              # Entry point
```

## API Documentation

See `/agente/BACKEND_SPEC.md` for complete API specification.

## Implementation Status

- [x] Ticket 1: Project Setup & Infrastructure
  - [x] NestJS scaffolded
  - [x] Prisma configured
  - [x] Environment configuration
  - [x] Health check endpoint
  - [ ] Dependencies installed (run `npm install`)
  - [ ] Database migration tested

## Next Steps

- Ticket 2: Authentication Infrastructure (JWT + Guards)
- Ticket 3: Domain Layer (Product Entity & Validations)
- ...see TICKETS.md
