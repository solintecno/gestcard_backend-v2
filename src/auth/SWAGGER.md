# Documentación Swagger - Módulo de Autenticación

## Acceso a la Documentación

Una vez que la aplicación esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3000/api/docs
```

## Configuración de Autenticación en Swagger

### 1. Registro de Usuario

**Endpoint:** `POST /auth/register`

Ejemplo de payload:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "role": "user"
}
```

### 2. Inicio de Sesión

**Endpoint:** `POST /auth/login`

Ejemplo de payload:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

Respuesta esperada:
```json
{
  "message": "Login successful",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "user",
    "isActive": true,
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Configurar Autenticación JWT

1. Después de hacer login, copia el `accessToken` de la respuesta
2. En Swagger UI, haz clic en el botón "Authorize" (icono de candado)
3. Pega el token en el campo "Value" con el formato: `Bearer tu-token-aquí`
4. Haz clic en "Authorize"

Ahora podrás acceder a todos los endpoints protegidos.

## Endpoints Protegidos

### Perfil de Usuario
- **GET** `/auth/profile` - Requiere autenticación JWT
- **GET** `/auth/user-info` - Requiere autenticación JWT

### Solo Administradores
- **GET** `/auth/admin-only` - Requiere autenticación JWT + rol ADMIN

## Recuperación de Contraseña

### 1. Solicitar Token de Recuperación
**Endpoint:** `POST /auth/forgot-password`

```json
{
  "email": "usuario@ejemplo.com"
}
```

### 2. Restablecer Contraseña
**Endpoint:** `POST /auth/reset-password`

```json
{
  "token": "token-de-recuperacion",
  "password": "nueva-password123"
}
```

## Códigos de Respuesta

### Respuestas Exitosas
- **200 OK** - Operación exitosa
- **201 Created** - Recurso creado exitosamente

### Errores del Cliente
- **400 Bad Request** - Datos de entrada inválidos
- **401 Unauthorized** - Credenciales inválidas o token expirado
- **403 Forbidden** - Acceso denegado (falta de permisos)
- **404 Not Found** - Recurso no encontrado
- **409 Conflict** - Conflicto (ej: email ya existe)

### Errores del Servidor
- **500 Internal Server Error** - Error interno del servidor

## Ejemplos de Respuestas de Error

### Error 400 - Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/auth/register"
}
```

### Error 401 - Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/auth/login"
}
```

### Error 403 - Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/auth/admin-only"
}
```

## Modelos de Datos

### Usuario (UserResponseDto)
```typescript
{
  id: string;          // UUID único
  email: string;       // Email único
  firstName: string;   // Nombre
  lastName: string;    // Apellido
  role: UserRole;      // "admin" | "user"
  isActive: boolean;   // Estado activo
  emailVerified: boolean; // Email verificado
  createdAt: Date;     // Fecha de creación
  updatedAt: Date;     // Fecha de actualización
}
```

### Enum de Roles
```typescript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
```

## Pruebas con Swagger UI

### Flujo Completo de Prueba

1. **Registrar un usuario nuevo:**
   - Ir a `POST /auth/register`
   - Completar los datos requeridos
   - Ejecutar

2. **Iniciar sesión:**
   - Ir a `POST /auth/login`
   - Usar las credenciales del usuario registrado
   - Copiar el `accessToken` de la respuesta

3. **Autorizar en Swagger:**
   - Hacer clic en "Authorize"
   - Pegar el token con formato: `Bearer tu-token`
   - Confirmar

4. **Probar endpoints protegidos:**
   - `GET /auth/profile`
   - `GET /auth/user-info`

5. **Para probar endpoint de admin:**
   - Usar las credenciales por defecto: `admin@gestcard.com` / `Admin123!`
   - Seguir pasos 2-3
   - Probar `GET /auth/admin-only`

## Configuración Avanzada

### Variables de Entorno para Swagger
```env
# En desarrollo, Swagger está habilitado por defecto
NODE_ENV=development

# En producción, considera deshabilitar Swagger por seguridad
NODE_ENV=production
```

### Personalización de Swagger
El archivo `main.ts` contiene la configuración de Swagger que incluye:
- Título y descripción de la API
- Versionado
- Configuración de autenticación Bearer JWT
- Tags para organizar endpoints
- Opciones de UI personalizadas
