# Getting Started with ODISEO Backend

## Prerequisites

- **Node.js**: 20+ (https://nodejs.org)
- **npm**: 10+ (comes with Node.js)
- **PostgreSQL**: Or use NEON cloud PostgreSQL (free tier available)
- **Git**: For version control

## Setup (First Time)

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the example config:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your PostgreSQL connection string:

```env
# Using NEON (recommended for development)
DATABASE_URL="postgresql://neondb_owner:YOURPASSWORD@ep-xxxxx.us-east-1.neon.tech/neondb?sslmode=require"

# Or local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/odiseo_db"

JWT_SECRET="dev-key-change-in-production"
```

### 3. Initialize Database

```bash
# Create tables from Prisma schema
npm run db:migrate:dev

# Open database admin UI (optional)
npm run db:studio
```

### 4. Start Development Server

```bash
npm run dev
```

You should see:
```
✓ Application is running on http://localhost:3000
✓ Environment: development
```

### 5. Test Health Endpoint

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-08-01T20:30:00.000Z",
  "environment": "development"
}
```

## Common Tasks

### Run Tests

```bash
# Run all tests once
npm test

# Watch mode (re-run on changes)
npm test:watch

# With coverage
npm test:cov
```

### Lint & Format

```bash
# Check for errors
npm run lint

# Fix auto-fixable errors
npm run lint:fix

# Format code
npm run format
```

### Database Migrations

```bash
# Create a new migration (after editing schema.prisma)
npm run db:migrate:dev

# Deploy migrations to production DB
npm run db:migrate:prod
```

### Build for Production

```bash
# Compile TypeScript
npm run build

# Run compiled output
npm start
```

## Project Structure

```
backend/
├── src/
│   ├── main.ts                    # Entry point
│   ├── app.module.ts              # Root module
│   ├── api/                       # Controllers, guards, middleware
│   ├── application/               # Services, DTOs
│   ├── domain/                    # Entities, business logic
│   ├── infrastructure/            # Repositories, database
│   └── shared/                    # Utilities, constants
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Version-controlled migrations
├── dist/                          # Compiled JavaScript (created by build)
├── package.json
├── tsconfig.json
├── jest.config.js
└── .env.local                     # Local secrets (gitignored)
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

**Quick overview**:
- **Controllers** (api/) → Handle HTTP requests
- **Services** (application/) → Orchestrate business logic
- **Entities** (domain/) → Define business rules
- **Repositories** (infrastructure/) → Access database
- **Prisma** → ORM and database abstraction

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret for signing JWT tokens | `dev-secret-key` |
| `JWT_EXPIRATION` | Token expiry time | `7d` |
| `NODE_ENV` | Environment | `development`, `production` |
| `PORT` | Server port | `3000` |
| `LOG_LEVEL` | Logging level | `debug`, `info`, `error` |

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error

```
Error: getaddrinfo ENOTFOUND postgres
```

- Check DATABASE_URL in .env.local
- Verify PostgreSQL is running
- Test connection: `psql $DATABASE_URL`

### Migration Fails

```bash
# Reset database (WARNING: deletes all data)
npm run db:reset

# Check migration status
npx prisma migrate status
```

### Build Errors

```bash
# Clear build cache
rm -rf dist node_modules/.prisma

# Reinstall
npm install

# Try build again
npm run build
```

## Next Steps

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
2. Check [../agente/BACKEND_SPEC.md](../agente/BACKEND_SPEC.md) for API specification
3. Look at [TICKETS.md](../agente/TICKETS.md) for implementation roadmap
4. Start with Ticket 2: Authentication Infrastructure

## Resources

- **NestJS Docs**: https://docs.nestjs.com
- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL**: https://www.postgresql.org/docs
- **NEON**: https://neon.tech (free PostgreSQL hosting)

## Questions?

Refer to the spec at `/agente/BACKEND_SPEC.md` or check the README at `./README.md`.
