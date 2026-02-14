# NestJS Starter Kit

A comprehensive NestJS starter kit with Prisma ORM, TypeScript, CI/CD, and 100% test coverage.

## Features

- 🚀 NestJS 11 Framework
- 🗄️ Prisma 6 ORM with PostgreSQL support
- 📝 Full TypeScript strict mode
- 🔧 Configuration management with class-validator
- 📊 Swagger API documentation
- 🧪 Jest testing with 100% coverage
- 📏 ESLint + Prettier code standards
- 🐶 Husky + lint-staged pre-commit hooks (lint → typecheck → test)
- 🔄 GitHub Actions CI/CD (lint + test)
- 📦 Demo modules showcasing database design patterns

## Demo Modules

| Module         | Patterns                                            |
| -------------- | --------------------------------------------------- |
| **Users**      | Basic CRUD, pagination, relations                   |
| **Categories** | Self-referencing tree (parent/children)             |
| **Tags**       | Many-to-many implicit join, product count           |
| **Products**   | Soft delete, many-to-many tags, belongs-to category |
| **Orders**     | Order/OrderItem explicit join table, enum status    |

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables Setup

Copy `env.example` and rename it to `.env`, then modify the configuration:

```bash
cp env.example .env
```

Edit the `.env` file:

```env
# Database
dbConnectionString="postgresql://username:password@localhost:5432/database_name?schema=public"

# Application
NODE_ENV=development
APP_PORT=3000
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio (optional)
npm run prisma:studio
```

### 4. Start the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Available Scripts

| Script                    | Description                       |
| ------------------------- | --------------------------------- |
| `npm run start:dev`       | Start in development mode (watch) |
| `npm run build`           | Build the application             |
| `npm run start:prod`      | Start production build            |
| `npm run lint`            | Run ESLint with auto-fix          |
| `npm run type-check`      | Run TypeScript type checking      |
| `npm run test`            | Run tests                         |
| `npm run test:watch`      | Run tests in watch mode           |
| `npm run test:cov`        | Run tests with coverage report    |
| `npm run prisma:generate` | Generate Prisma client            |
| `npm run prisma:migrate`  | Create database migration         |
| `npm run prisma:deploy`   | Deploy database migrations        |
| `npm run prisma:studio`   | Open Prisma Studio GUI            |

## Pre-commit Hooks

Husky runs the following checks on every commit:

1. **lint-staged** — ESLint `--fix` on staged `*.ts` files
2. **type-check** — `tsc --noEmit` full project typecheck
3. **test** — Jest unit tests

## CI/CD

GitHub Actions runs on push/PR to `main`:

- **Lint job** — ESLint + TypeScript type check
- **Test job** — Jest with coverage report

## Project Structure

```
src/
├── core/                    # Core modules
│   ├── config/             # App configuration (class-validator)
│   └── database/           # Prisma service & database config
├── modules/                # Business modules
│   ├── users/              # User CRUD with pagination
│   ├── categories/         # Self-referencing category tree
│   ├── tags/               # Tags with many-to-many products
│   ├── products/           # Products with soft delete & tags
│   └── orders/             # Orders with line items & status
├── utils/                  # Pagination & config validation
├── types/                  # Global type definitions
├── app.module.ts           # Root module
├── app.controller.ts       # Health check controller
├── app.service.ts          # App service
└── main.ts                 # Bootstrap entry point
```

## API Documentation

After starting the application, you can access the Swagger API documentation:

- Development: http://localhost:3000/api-docs

## Database

This project uses Prisma as ORM with PostgreSQL database support.

### Adding Models

1. Define models in `prisma/schema.prisma`
2. Run `npm run prisma:migrate` to create migrations
3. Run `npm run prisma:generate` to generate client

## Development Guide

### Adding Modules

```bash
# Use NestJS CLI to generate modules
nest generate module modules/your-module
nest generate controller modules/your-module
nest generate service modules/your-module
```

### Configuration Management

All configurations are managed in `src/core/config/` with class-validator validation.

### Utility Classes

- `pagination.ts` — Pagination helper (`createPaginationResult`, `getSkip`)
- `validate-config.ts` — Environment variable validation with class-validator

## Tech Stack

| Category  | Technology               |
| --------- | ------------------------ |
| Framework | NestJS 11                |
| ORM       | Prisma 6                 |
| Language  | TypeScript 5 (strict)    |
| Testing   | Jest + ts-jest           |
| Linting   | ESLint 9 + Prettier      |
| Git Hooks | Husky 9 + lint-staged    |
| CI/CD     | GitHub Actions           |
| API Docs  | Swagger (nestjs/swagger) |

## License

MIT License
