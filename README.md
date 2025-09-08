# NestJS Starter Kit

A comprehensive NestJS starter kit with basic configuration, database setup, and utility classes.

## Features

- 🚀 NestJS Framework
- 🗄️ Prisma ORM with PostgreSQL support
- 📝 Full TypeScript support
- 🔧 Configuration management system
- 📊 Swagger API documentation
- 🧪 Jest testing framework
- 📏 ESLint + Prettier code standards
- 🔄 Pagination utility classes
- 📅 Date utility classes

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

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode
- `npm run start:debug` - Start in debug mode
- `npm run build` - Build the application
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run lint` - Run code linting
- `npm run type-check` - Run TypeScript type checking
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:deploy` - Deploy database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Project Structure

```
src/
├── core/                    # Core modules
│   ├── config/             # Configuration management
│   └── database/           # Database related
├── modules/                # Business modules
├── utils/                  # Utility classes
├── types/                  # Type definitions
├── constants/              # Constant definitions
├── enum/                   # Enum definitions
├── app.module.ts           # Main module
├── app.controller.ts       # Main controller
├── app.service.ts          # Main service
└── main.ts                 # Application entry point
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

All configurations are managed in the `src/core/config/` directory with class-validator validation.

### Utility Classes

- `pagination.ts` - Pagination related utility functions
- `validate-config.ts` - Configuration validation utilities

## License

MIT License