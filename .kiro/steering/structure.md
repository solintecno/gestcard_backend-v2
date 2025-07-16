# Project Structure & Organization

## Root Directory Structure
```
├── src/                    # Source code
├── test/                   # E2E tests
├── dist/                   # Compiled output
├── init-db/               # Database initialization scripts
├── .kiro/                 # Kiro configuration
├── docker-compose.yml     # Docker services
├── Dockerfile            # Production container
└── package.json          # Dependencies and scripts
```

## Source Code Organization (`src/`)

### Module-Based Architecture
Each feature is organized as a self-contained NestJS module:

```
src/
├── [feature]/             # Feature modules (auth, candidates, job-offers, etc.)
│   ├── commands/          # CQRS commands (write operations)
│   ├── queries/           # CQRS queries (read operations)
│   ├── handlers/          # Command/query handlers (business logic)
│   ├── dto/              # Data Transfer Objects
│   ├── entities/         # TypeORM entities
│   ├── [feature].controller.ts  # REST API endpoints
│   ├── [feature].module.ts      # NestJS module definition
│   └── index.ts          # Barrel exports
├── common/               # Shared utilities
├── shared/               # Shared types and enums
├── security/             # Authentication & authorization
├── database/             # Database configuration & migrations
├── app.module.ts         # Root application module
└── main.ts              # Application bootstrap
```

## Feature Module Structure

### Standard Module Layout
Each feature module follows this consistent structure:

**Commands** (`commands/`)
- Write operations (Create, Update, Delete)
- Simple data containers passed to handlers
- Example: `CreateCandidateCommand`, `UpdateJobOfferCommand`

**Queries** (`queries/`)
- Read operations (Get, List, Search)
- Include filtering and pagination parameters
- Example: `GetCandidatesQuery`, `GetJobOfferByIdQuery`

**Handlers** (`handlers/`)
- Business logic implementation
- One handler per command/query
- Decorated with `@CommandHandler()` or `@QueryHandler()`
- Example: `CreateCandidateHandler`, `GetCandidatesHandler`

**DTOs** (`dto/`)
- Request/response data structures
- Validation decorators from `class-validator`
- Swagger documentation with `@ApiProperty()`
- Example: `CreateCandidateDto`, `CandidateResponseDto`

**Entities** (`entities/`)
- TypeORM database entities
- Decorators for columns, relationships, indexes
- Example: `Candidate`, `JobOffer`, `User`

## Naming Conventions

### Files
- **Commands**: `[action]-[entity].command.ts` (e.g., `create-candidate.command.ts`)
- **Queries**: `get-[entity/entities].query.ts` (e.g., `get-candidates.query.ts`)
- **Handlers**: `[action]-[entity].handler.ts` (e.g., `create-candidate.handler.ts`)
- **DTOs**: `[purpose]-[entity].dto.ts` (e.g., `create-candidate.dto.ts`)
- **Entities**: `[entity].entity.ts` (e.g., `candidate.entity.ts`)
- **Controllers**: `[feature].controller.ts` (e.g., `candidates.controller.ts`)
- **Modules**: `[feature].module.ts` (e.g., `candidates.module.ts`)

### Classes
- **Commands**: `[Action][Entity]Command` (e.g., `CreateCandidateCommand`)
- **Queries**: `Get[Entity/Entities]Query` (e.g., `GetCandidatesQuery`)
- **Handlers**: `[Action][Entity]Handler` (e.g., `CreateCandidateHandler`)
- **DTOs**: `[Purpose][Entity]Dto` (e.g., `CreateCandidateDto`)
- **Entities**: `[Entity]` (e.g., `Candidate`)

## Shared Components

### Common (`src/common/`)
- **dto/**: Shared DTOs (pagination, error responses)
- **filters/**: Global exception filters
- **interceptors/**: Global interceptors (logging)

### Shared (`src/shared/`)
- **enums.ts**: Application-wide enums (UserRole, JobOfferStatus, etc.)

### Security (`src/security/`)
- **guards/**: Authentication and authorization guards
- **decorators/**: Custom decorators (@CurrentUser, @Roles, @Public)
- **strategies/**: Passport strategies (JWT)
- **services/**: Token management services

### Database (`src/database/`)
- **data-source.ts**: TypeORM configuration
- **migrations/**: Database schema migrations
- **create-admin.ts**: Admin user seeding script

## Import/Export Patterns

### Barrel Exports
Each module uses `index.ts` files for clean imports:
```typescript
// src/auth/index.ts
export * from './entities';
export * from './dto';
export * from './commands';
export * from './queries';
```

### Module Dependencies
- Modules import only what they need
- Shared dependencies go through common modules
- Database entities are exported from feature modules
- Security module is imported by modules requiring authentication

## API Structure

### REST Endpoints
- Base path: `/api/v1`
- Feature-based routing: `/api/v1/candidates`, `/api/v1/job-offers`
- Swagger documentation: `/api/v1/docs`

### Controller Organization
- One controller per feature module
- Methods correspond to CQRS commands/queries
- Consistent HTTP status codes and response formats
- Swagger decorators for API documentation