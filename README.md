# GestCard Backend

API backend para el sistema de gestión de tarjetas GestCard, construido con NestJS, TypeORM y PostgreSQL.

## 🚀 Características

- **Autenticación completa** con JWT y roles de usuario
- **Arquitectura CQRS** para separación de comandos y consultas
- **Base de datos PostgreSQL** con TypeORM
- **Documentación Swagger** interactiva
- **Validación de datos** con class-validator
- **Manejo de errores** centralizado
- **Seguridad robusta** con bcryptjs y guards personalizados

## 📚 Documentación API

Una vez que la aplicación esté ejecutándose, accede a la documentación interactiva:

- **Swagger UI:** http://localhost:3000/api/docs

## 🛠️ Instalación y Configuración

### Prerequisitos

- Node.js 18+ 
- Docker y Docker Compose (recomendado)
- PostgreSQL 13+ (si no usas Docker)
- pnpm (recomendado) o npm

### Opción 1: Configuración con Docker (Recomendado)

```bash
# 1. Clonar e instalar dependencias
pnpm install

# 2. Configurar variables de entorno
cp .env.example .env  # Editar si es necesario

# 3. Levantar PostgreSQL con Docker
npm run docker:db

# 4. Crear usuario administrador
npm run seed:admin

# 5. Ejecutar la aplicación
npm run dev
```

### Opción 2: Configuración Manual

```bash
# 1. Instalar dependencias
pnpm install

# 2. Instalar y configurar PostgreSQL localmente
# Crear base de datos: createdb gestcard_db

# 3. Configurar variables de entorno (usar .env)

# 4. Crear usuario admin
npm run seed:admin

# 5. Ejecutar aplicación
npm run dev
```

## 🐳 Docker

### Comandos Docker Disponibles

```bash
# Solo base de datos PostgreSQL
npm run docker:db

# PostgreSQL + pgAdmin
npm run docker:all

# Ver logs
npm run docker:logs

# Detener servicios
npm run docker:down

# Reset completo (elimina datos)
npm run docker:reset

# Setup completo (DB + admin user)
npm run setup
```

### Servicios Docker

| Servicio | Puerto | Credenciales |
|----------|--------|--------------|
| **PostgreSQL** | 5432 | postgres/postgres |
| **pgAdmin** | 8080 | admin@gestcard.com/admin123 |

### Configuración de pgAdmin

1. Abrir http://localhost:8080
2. Login: `admin@gestcard.com` / `admin123`
3. Agregar servidor:
   - Host: `postgres`
   - Puerto: `5432` 
   - Usuario: `postgres`
   - Contraseña: `postgres`

### Docker Compose Completo

Para ejecutar toda la aplicación en contenedores:

```bash
# Construir y ejecutar app + DB
docker-compose -f docker-compose.full.yml --profile full-stack up -d

# Solo la base de datos
docker-compose up -d postgres
```

## 🔐 Autenticación

### Credenciales por Defecto

**Administrador:**
- Email: `admin@gestcard.com`
- Password: `Admin123!`

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Iniciar sesión |
| GET | `/auth/profile` | Obtener perfil (protegido) |
| GET | `/auth/admin-only` | Solo administradores |
| POST | `/auth/forgot-password` | Recuperar contraseña |
| POST | `/auth/reset-password` | Restablecer contraseña |

## 📖 Uso de Swagger

### Probar la API

1. **Acceder a Swagger:** http://localhost:3000/api/docs
2. **Registrar usuario:** Usar endpoint `POST /auth/register`
3. **Iniciar sesión:** Usar endpoint `POST /auth/login` y copiar el `accessToken`
4. **Autorizar:** Hacer clic en "Authorize" y pegar: `Bearer tu-token`
5. **Probar endpoints protegidos**

### Ejemplo de Registro

```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "user"
}
```

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── auth/                   # Módulo de autenticación
│   ├── commands/          # Comandos CQRS
│   ├── queries/           # Consultas CQRS
│   ├── handlers/          # Manejadores CQRS
│   ├── dto/              # Data Transfer Objects
│   ├── entities/         # Entidades TypeORM
│   ├── guards/           # Guards de autenticación
│   ├── strategies/       # Estrategias Passport
│   ├── decorators/       # Decoradores personalizados
│   └── auth.controller.ts # Controlador REST
├── common/               # Utilidades compartidas
├── shared/               # Enums y tipos compartidos
├── database/            # Configuración de BD
├── app.module.ts        # Módulo principal
└── main.ts             # Punto de entrada
```

### Patrón CQRS

- **Commands:** Operaciones que modifican estado (Register, Login, etc.)
- **Queries:** Operaciones de lectura (GetUser, ValidateUser, etc.)
- **Handlers:** Lógica de negocio para cada command/query

## 🔒 Seguridad

### Características de Seguridad

- **Encriptación de contraseñas** con bcryptjs (12 rounds)
- **Tokens JWT** con expiración configurable
- **Validación de entrada** con class-validator
- **Guards de autorización** basados en roles
- **Protección CORS** habilitada
- **Filtros de excepción** personalizados

### Roles de Usuario

```typescript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Iniciar en modo desarrollo
npm run start:debug        # Iniciar con debug

# Construcción
npm run build              # Construir para producción
npm run start:prod         # Ejecutar en producción

# Base de datos
npm run seed:admin         # Crear usuario administrador
npm run migration:generate # Generar migración
npm run migration:run      # Ejecutar migraciones

# Código
npm run lint               # Linter
npm run format             # Formatear código
```

## 🚀 Deployment

### Variables de Entorno de Producción

```env
NODE_ENV=production
DATABASE_HOST=your-prod-host
DATABASE_PORT=5432
DATABASE_USERNAME=your-prod-user
DATABASE_PASSWORD=your-secure-password
DATABASE_NAME=gestcard_prod
JWT_SECRET=your-very-secure-jwt-secret
JWT_EXPIRES_IN=1d
PORT=3000
```

### Docker (Opcional)

```bash
# Construir imagen
docker build -t gestcard-backend .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env gestcard-backend
```

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📞 Soporte

Para preguntas o soporte, contacta al equipo de desarrollo.

---

**Documentación adicional:**
- [Módulo de Autenticación](src/auth/README.md)
- [Guía de Swagger](src/auth/SWAGGER.md)
