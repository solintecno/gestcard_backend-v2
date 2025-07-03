# Módulo de Autenticación

Este módulo implementa un sistema completo de autenticación usando CQRS (Command Query Responsibility Segregation), TypeORM y PostgreSQL.

## Características

- **Registro de usuarios** con validación de email único
- **Autenticación JWT** con estrategias Passport
- **Sistema de roles** (ADMIN, USER)
- **Recuperación de contraseña** con tokens temporales
- **Protección de rutas** con guards personalizados
- **CQRS Pattern** para separación de comandos y consultas
- **Validación de datos** con class-validator
- **Encriptación de contraseñas** con bcryptjs

## Configuración

### Variables de Entorno (.env)

```env
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=gestcard_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development
```

### Base de Datos

1. Crear la base de datos PostgreSQL:
```sql
CREATE DATABASE gestcard_db;
```

2. Las tablas se crearán automáticamente al iniciar la aplicación (modo desarrollo).

3. Crear usuario administrador inicial:
```bash
npm run seed:admin
```

## Endpoints de la API

### Autenticación

#### POST /auth/register
Registra un nuevo usuario.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user" // opcional, por defecto "user"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST /auth/login
Autentica un usuario y devuelve un token JWT.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "accessToken": "jwt-token-here"
}
```

#### POST /auth/forgot-password
Inicia el proceso de recuperación de contraseña.

**Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /auth/reset-password
Restablece la contraseña usando un token de recuperación.

**Body:**
```json
{
  "token": "reset-token",
  "password": "newpassword123"
}
```

### Rutas Protegidas

#### GET /auth/profile
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer jwt-token-here
```

#### GET /auth/admin-only
Endpoint exclusivo para administradores.

**Headers:**
```
Authorization: Bearer jwt-token-here
```

## Uso en el Código

### Guards

```typescript
import { JwtAuthGuard, RolesGuard } from './auth/guards';
import { Roles } from './auth/decorators';
import { UserRole } from './shared/enums';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  // Solo accesible para administradores
}
```

### Obtener Usuario Actual

```typescript
import { GetUser } from './auth/decorators';
import { User } from './auth/entities';

@Get('my-data')
@UseGuards(JwtAuthGuard)
async getMyData(@GetUser() user: User) {
  return { userId: user.id, email: user.email };
}
```

### CQRS Commands y Queries

```typescript
// En un servicio
constructor(
  private readonly commandBus: CommandBus,
  private readonly queryBus: QueryBus,
) {}

// Ejecutar comando
const user = await this.commandBus.execute(
  new RegisterUserCommand(registerDto)
);

// Ejecutar query
const user = await this.queryBus.execute(
  new GetUserByIdQuery(userId)
);
```

## Estructura del Módulo

```
src/auth/
├── commands/           # Comandos CQRS
├── queries/           # Consultas CQRS
├── handlers/          # Manejadores de comandos y consultas
├── dto/              # Data Transfer Objects
├── entities/         # Entidades de TypeORM
├── guards/           # Guards de autenticación y autorización
├── strategies/       # Estrategias de Passport
├── decorators/       # Decoradores personalizados
├── auth.controller.ts # Controlador principal
├── auth.module.ts    # Módulo de autenticación
└── index.ts          # Exportaciones
```

## Seguridad

- Las contraseñas se encriptan con bcryptjs (salt rounds: 12)
- Los tokens JWT tienen expiración configurable
- Validación de entrada con class-validator
- Protección contra inyección SQL con TypeORM
- Headers de seguridad con CORS habilitado

## Testing

Para probar la API, puedes usar las siguientes credenciales por defecto:

**Administrador:**
- Email: admin@gestcard.com
- Password: Admin123!

## Scripts Útiles

```bash
# Iniciar en desarrollo
npm run start:dev

# Crear usuario administrador
npm run seed:admin

# Generar migración
npm run migration:generate -- src/database/migrations/MigrationName

# Ejecutar migraciones
npm run migration:run
```
