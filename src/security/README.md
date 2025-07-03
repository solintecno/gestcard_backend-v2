# Módulo de Seguridad

Este módulo proporciona funcionalidades de seguridad centralizadas para la aplicación, incluyendo autenticación JWT, autorización basada en roles, y guards para proteger endpoints.

## Componentes

### Services

#### TokenService
Servicio para el manejo de tokens JWT (generación, validación, decodificación).

**Métodos principales:**
- `generateTokenPair(user: User)`: Genera un par de tokens (access y refresh)
- `generateAccessToken(payload: JwtPayload)`: Genera un access token
- `generateRefreshToken(payload: JwtPayload)`: Genera un refresh token
- `validateToken(token: string, isRefreshToken?: boolean)`: Valida un token
- `decodeToken(token: string)`: Decodifica un token sin validar
- `isTokenExpired(token: string)`: Verifica si un token ha expirado

### Guards

#### JwtAuthGuard
Guard que extiende de `AuthGuard('jwt')` y maneja la autenticación JWT.
- Permite rutas públicas marcadas con `@Public()`
- Proporciona logging detallado de errores de autenticación

#### RolesGuard
Guard para autorización basada en roles.
- Verifica que el usuario tenga los roles requeridos
- Se combina con el decorador `@Roles()`

### Decorators

#### @Public()
Marca endpoints como públicos (sin necesidad de autenticación).

```typescript
@Public()
@Post('login')
async login() {
  // Endpoint público
}
```

#### @Roles(...roles)
Especifica los roles requeridos para acceder a un endpoint.

```typescript
@Roles(UserRole.ADMIN)
@Get('admin-data')
async getAdminData() {
  // Solo administradores
}
```

#### @CurrentUser()
Inyecta el usuario actual autenticado como parámetro.

```typescript
@Get('profile')
async getProfile(@CurrentUser() user: User) {
  return user;
}
```

### Strategies

#### JwtStrategy
Estrategia de Passport para validar tokens JWT y cargar el usuario.

## Uso

### 1. Importar el módulo

```typescript
@Module({
  imports: [SecurityModule],
  // ...
})
export class AppModule {}
```

### 2. Proteger controladores

```typescript
@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApiController {
  
  @Public()
  @Post('login')
  async login() {
    // Endpoint público
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: User) {
    // Endpoint protegido
  }

  @Roles(UserRole.ADMIN)
  @Get('admin')
  async adminOnly() {
    // Solo administradores
  }
}
```

### 3. Generar tokens

```typescript
constructor(private tokenService: TokenService) {}

async login(user: User) {
  const tokens = await this.tokenService.generateTokenPair(user);
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}
```

## Variables de Entorno

El módulo requiere las siguientes variables de entorno:

```env
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRES_IN=7d
```

## Flujo de Autenticación

1. Usuario se autentica (login)
2. Se genera un par de tokens (access + refresh)
3. Cliente incluye el access token en headers: `Authorization: Bearer <token>`
4. `JwtAuthGuard` valida el token en cada request
5. `JwtStrategy` carga el usuario desde la base de datos
6. `RolesGuard` verifica permisos si se especifican roles
7. Usuario está disponible en el controlador via `@CurrentUser()`

## Seguridad

- Los access tokens tienen vida corta (15 minutos por defecto)
- Los refresh tokens tienen vida larga (7 días por defecto)
- Se valida que el usuario esté activo en cada request
- Logging detallado para auditoría de seguridad
- Manejo seguro de errores sin exponer información sensible
