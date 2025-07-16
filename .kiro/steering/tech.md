# Technology Stack

## Core Framework
- **NestJS 11.x**: Node.js framework with TypeScript, decorators, and dependency injection
- **TypeScript 5.7**: Strict typing with ES2023 target
- **Node.js 18+**: Runtime environment

## Database & ORM
- **PostgreSQL 13+**: Primary database
- **TypeORM 0.3.x**: Object-relational mapping with decorators
- **Database migrations**: TypeORM CLI for schema management

## Architecture Patterns
- **CQRS**: Command Query Responsibility Segregation using `@nestjs/cqrs`
- **Commands**: Write operations (Create, Update, Delete)
- **Queries**: Read operations (Get, List, Search)
- **Handlers**: Business logic implementation for commands/queries

## Authentication & Security
- **JWT**: JSON Web Tokens with `@nestjs/jwt`
- **Passport**: Authentication middleware with JWT strategy
- **bcryptjs**: Password hashing (12 rounds)
- **Role-based access**: Admin/User roles with guards

## Validation & Documentation
- **class-validator**: DTO validation with decorators
- **class-transformer**: Object transformation and serialization
- **Swagger/OpenAPI**: API documentation with `@nestjs/swagger`
- **Global validation pipe**: Automatic request validation

## Development Tools
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **Jest**: Unit and e2e testing
- **Docker**: Containerization for development and production

## Package Manager
- **pnpm**: Preferred package manager (faster than npm)

## Common Commands

### Development
```bash
# Start development server with hot reload
npm run dev

# Start with debug mode
npm run dev:verbose

# Build for production
npm run build

# Start production server
npm start:prod
```

### Database
```bash
# Start PostgreSQL with Docker
npm run docker:db

# Create admin user
npm run seed:admin

# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Docker
```bash
# Start database only
npm run docker:db

# Start all services (DB + pgAdmin)
npm run docker:all

# View logs
npm run docker:logs

# Stop services
npm run docker:down

# Reset database (removes data)
npm run docker:reset

# Complete setup (DB + admin user)
npm run setup
```

### Code Quality
```bash
# Lint and fix code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Environment Variables
Required variables in `.env`:
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `PORT`, `NODE_ENV`