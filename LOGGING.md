# Configuración de Logs en GestCard Backend

Este documento describe el sistema de logging implementado en la aplicación GestCard Backend.

## Características del Sistema de Logging

### 1. Logger Nativo de NestJS
- Utiliza el Logger nativo de NestJS para consistencia
- Logs estructurados con contexto y timestamps automáticos
- Diferentes niveles de log: `log`, `debug`, `warn`, `error`, `verbose`

### 2. Logging Automático en HTTP
- **Interceptor Global**: Captura automáticamente todas las peticiones HTTP
- **Request ID único**: Cada petición tiene un UUID para tracking
- **Información de usuario**: Identifica el usuario que realiza la petición
- **Tiempo de respuesta**: Mide la duración de cada operación
- **Headers y payload**: Registra datos de entrada y salida (truncados si son muy largos)

### 3. Logging en Handlers CQRS
Todos los handlers (Commands y Queries) incluyen:
- **Tiempo de inicio y duración** de cada operación
- **Datos de entrada** (con información sensible enmascarada)
- **Resultados de operaciones** de base de datos
- **Manejo de errores** con stack traces completos
- **Contexto de usuario** cuando está disponible

### 4. Logging en Autenticación
- **Intentos de login**: Exitosos y fallidos
- **Validación JWT**: Verificación de tokens
- **Registro de usuarios**: Proceso completo de creación
- **Recuperación de contraseña**: Tracking del proceso

### 5. Logging en Base de Datos
- **TypeORM logging**: Habilitado en desarrollo
- **Consultas SQL**: Tiempo de ejecución de queries
- **Conexiones**: Estado de la conexión a BD

## Ejemplos de Logs

### Petición HTTP Exitosa
```
[LoggingInterceptor] [a1b2c3d4-e5f6-7890-abcd-ef1234567890] POST /auth/login - User: Anonymous - Body: {"email":"user@example.com","password":"[HIDDEN]"} - Query: {} - Params: {}
[LoginUserHandler] Login attempt for email: user@example.com
[LoginUserHandler] User found: 123e4567-e89b-12d3-a456-426614174000
[LoginUserHandler] Password verification successful for user: 123e4567-e89b-12d3-a456-426614174000
[LoginUserHandler] JWT token generated for user: 123e4567-e89b-12d3-a456-426614174000
[LoginUserHandler] Login successful for user: 123e4567-e89b-12d3-a456-426614174000 (user@example.com) in 234ms
[AuthController] Login completed successfully for: user@example.com in 245ms
[LoggingInterceptor] [a1b2c3d4-e5f6-7890-abcd-ef1234567890] POST /auth/login - 200 - 245ms - User: Anonymous
```

### Error de Autenticación
```
[LoggingInterceptor] [b2c3d4e5-f6g7-8901-bcde-f23456789012] POST /auth/login - User: Anonymous - Body: {"email":"wrong@example.com","password":"[HIDDEN]"} - Query: {} - Params: {}
[LoginUserHandler] Login attempt for email: wrong@example.com
[LoginUserHandler] Login failed - User not found: wrong@example.com
[LoginUserHandler] Login failed for wrong@example.com after 123ms: Invalid credentials
[AuthController] Login failed for wrong@example.com after 125ms: Invalid credentials
[AllExceptionsFilter] Client Error - POST /auth/login - Status: 401 - Message: Invalid credentials
[LoggingInterceptor] [b2c3d4e5-f6g7-8901-bcde-f23456789012] POST /auth/login - 401 - 125ms - User: Anonymous - Error: Invalid credentials
```

### Operación de Base de Datos
```
[TypeORM] query: SELECT "User"."id" AS "User_id", "User"."email" AS "User_email", "User"."firstName" AS "User_firstName", "User"."lastName" AS "User_lastName", "User"."role" AS "User_role", "User"."isActive" AS "User_isActive", "User"."createdAt" AS "User_createdAt", "User"."updatedAt" AS "User_updatedAt" FROM "user" "User" WHERE "User"."email" = $1 -- PARAMETERS: ["user@example.com"]
[GetUserByEmailHandler] User found: 123e4567-e89b-12d3-a456-426614174000 (user@example.com) in 45ms
```

## Configuración de Logs por Entorno

### Desarrollo
- **Nivel**: `debug` y superior
- **TypeORM logging**: Habilitado
- **Stack traces**: Completos
- **Request/Response data**: Completo

### Producción
- **Nivel**: `log` y superior
- **TypeORM logging**: Deshabilitado
- **Stack traces**: Solo para errores
- **Request/Response data**: Limitado por seguridad

## Filtrado y Búsqueda de Logs

### Por Request ID
```bash
grep "a1b2c3d4-e5f6-7890-abcd-ef1234567890" application.log
```

### Por Usuario
```bash
grep "user@example.com" application.log
```

### Por Endpoint
```bash
grep "POST /auth/login" application.log
```

### Por Errores
```bash
grep "ERROR" application.log
```

### Por Handler
```bash
grep "LoginUserHandler" application.log
```

## Métricas y Monitoreo

Los logs incluyen métricas útiles para monitoreo:
- **Duración de requests** (para identificar endpoints lentos)
- **Tasa de errores** por endpoint
- **Patrones de uso** por usuario
- **Intentos de autenticación** fallidos
- **Performance de base de datos**

## Seguridad en Logs

- **Passwords**: Nunca se registran en logs
- **Tokens**: Solo se muestra una porción truncada
- **Datos sensibles**: Enmascarados o excluidos
- **PII**: Minimizado según políticas de privacidad
