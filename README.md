# NestJS Starter Kit

[![CI](https://github.com/yen0304/nestjs-starter-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/yen0304/nestjs-starter-kit/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/yen0304/nestjs-starter-kit/graph/badge.svg)](https://codecov.io/gh/yen0304/nestjs-starter-kit)

A production-ready NestJS starter kit with Prisma ORM, TypeScript strict mode, 100% test coverage, and full CI/CD pipeline.

## Tech Stack

| Category  | Technology                  |
| --------- | --------------------------- |
| Framework | NestJS 11.1                 |
| ORM       | Prisma 6.19 + PostgreSQL    |
| Language  | TypeScript 5.8 (strict)     |
| Testing   | Jest 29 + ts-jest (100 cov) |
| Linting   | ESLint 9 + Prettier         |
| Git Hooks | Husky 9 + lint-staged       |
| CI/CD     | GitHub Actions + Codecov    |
| API Docs  | Swagger (nestjs/swagger)    |
| Container | Docker multi-stage build    |

## Demo Modules

5 modules demonstrating common database design patterns with Prisma:

| Module         | DB Patterns                                                   | Endpoints                   |
| -------------- | ------------------------------------------------------------- | --------------------------- |
| **Users**      | Basic CRUD, pagination, relations                             | `POST GET GET:id`           |
| **Categories** | Self-referencing tree (`parentId` → parent/children)          | `POST GET GET:id PATCH DEL` |
| **Tags**       | Many-to-many implicit join, `_count` aggregation              | `POST GET GET:id PATCH DEL` |
| **Products**   | Soft delete (`deletedAt`), M2M tags, belongs-to category      | `POST GET GET:id PATCH DEL` |
| **Orders**     | Explicit join table (`OrderItem`), enum status, nested create | `POST GET GET:id PATCH`     |

## Quick Start

### Prerequisites

- Node.js >= 18
- PostgreSQL (or use Docker Compose)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

```bash
cp env.example .env
```

```env
dbConnectionString="postgresql://postgres:password@localhost:5432/nestjs_starter?schema=public"
NODE_ENV=development
APP_PORT=3000
```

### 3. Database Setup

```bash
npx prisma generate        # Generate Prisma client
npx prisma migrate dev     # Run migrations
npx prisma studio          # Open GUI (optional)
```

### 4. Run

```bash
npm run start:dev           # Development (watch mode)
```

### Docker Compose (alternative)

```bash
docker compose up -d        # Starts app + PostgreSQL
curl http://localhost:3000/api/health
```

## Available Scripts

| Script                    | Description                       |
| ------------------------- | --------------------------------- |
| `npm run start:dev`       | Start in development mode (watch) |
| `npm run build`           | Build the application             |
| `npm run start:prod`      | Start production build            |
| `npm run lint`            | ESLint with auto-fix              |
| `npm run type-check`      | TypeScript type checking          |
| `npm run test`            | Run unit tests                    |
| `npm run test:cov`        | Run tests with coverage report    |
| `npm run prisma:generate` | Generate Prisma client            |
| `npm run prisma:migrate`  | Create database migration         |
| `npm run prisma:deploy`   | Deploy migrations (production)    |
| `npm run prisma:studio`   | Open Prisma Studio GUI            |

## Pre-commit Hooks

Husky runs three checks on every commit:

1. **lint-staged** — `eslint --fix` on staged `*.ts` files
2. **type-check** — `tsc --noEmit` full project type check
3. **test** — Jest unit test suite (85 tests)

## CI/CD

GitHub Actions runs on push / PR to `main`:

| Job      | Steps                                     |
| -------- | ----------------------------------------- |
| **Lint** | ESLint → TypeScript type check            |
| **Test** | Prisma generate → Jest coverage → Codecov |

Coverage reports are uploaded to [Codecov](https://codecov.io/gh/yen0304/nestjs-starter-kit) on every push.

## Project Structure

```
src/
├── core/
│   ├── config/              # App config with class-validator
│   │   └── app.config.ts
│   └── database/            # Prisma service + DB config
│       ├── prisma.service.ts
│       └── config/
├── modules/
│   ├── users/               # Basic CRUD + pagination
│   ├── categories/          # Self-referencing tree
│   ├── tags/                # M2M + _count aggregation
│   ├── products/            # Soft delete + M2M tags
│   └── orders/              # Nested create + enum status
├── utils/
│   ├── pagination.ts        # createPaginationResult, getSkip
│   └── validate-config.ts   # ENV validation helper
├── types/
│   └── all-config.type.ts
├── app.module.ts
├── app.controller.ts        # GET / (hello) + GET /health
├── app.service.ts
└── main.ts                  # Bootstrap, CORS, Swagger, ValidationPipe
```

## Database Schema

```
User ──< Product >── Tag
  │         │
  │         └── Category (self-referencing tree)
  │
  └──< Order ──< OrderItem >── Product
```

- **User** → has many Products, Orders
- **Category** → self-referencing via `parentId`, has many Products
- **Tag** ↔ **Product** (implicit M2M)
- **Product** → soft delete (`deletedAt`), belongs to Category + User
- **Order** → has many OrderItems (explicit join), `OrderStatus` enum
- **OrderItem** → unique constraint `[orderId, productId]`, cascade delete

## Development Guide

### Adding a New Module

```bash
nest g module modules/your-module
nest g controller modules/your-module
nest g service modules/your-module
```

### Adding Prisma Models

1. Define models in `prisma/schema.prisma`
2. `npx prisma migrate dev --name your_migration`
3. `npx prisma generate`

### Configuration

Environment variables are validated at startup using `class-validator` schemas in `src/core/config/`. Add new config schemas following the same pattern as `app.config.ts`.

## License

MIT
