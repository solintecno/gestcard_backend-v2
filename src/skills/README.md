# Skills Module

Este módulo gestiona las habilidades/skills en el sistema GestCard.

## Características

- ✅ **CRUD completo**: Crear, leer, actualizar y eliminar skills
- ✅ **Paginación**: Lista paginada de skills con filtros
- ✅ **Búsqueda**: Búsqueda por nombre de skill
- ✅ **Filtros**: Por categoría y estado
- ✅ **Validaciones**: Nombres únicos y validación de datos
- ✅ **Roles**: Solo administradores pueden crear, editar y eliminar
- ✅ **Documentación**: Swagger/OpenAPI completamente documentado

## Endpoints

### GET `/skills`
Obtiene lista paginada de skills con filtros opcionales.

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10, máx: 100)
- `search` (opcional): Buscar por nombre

**Ejemplo:**
```
GET /skills?page=1&limit=10&search=JavaScript
```

### GET `/skills/:id`
Obtiene una skill específica por ID.

### POST `/skills`
Crea una nueva skill. **Requiere rol ADMIN**.

**Body:**
```json
{
  "name": "React"
}
```

### PUT `/skills/:id`
Actualiza una skill existente. **Requiere rol ADMIN**.

### DELETE `/skills/:id`
Elimina una skill. **Requiere rol ADMIN**.

## Modelo de Datos

### Skill Entity
```typescript
{
  id: string;           // UUID generado automáticamente
  name: string;         // Nombre único de la skill
  createdAt: Date;      // Fecha de creación
  updatedAt: Date;      // Fecha de última actualización
}
```

## Validaciones

- **name**: Requerido, máximo 255 caracteres, único

## Arquitectura

El módulo sigue el patrón **CQRS (Command Query Responsibility Segregation)**:

### Commands (Escritura)
- `CreateSkillCommand` → `CreateSkillHandler`
- `UpdateSkillCommand` → `UpdateSkillHandler`
- `DeleteSkillCommand` → `DeleteSkillHandler`

### Queries (Lectura)
- `GetSkillsQuery` → `GetSkillsHandler`
- `GetSkillByIdQuery` → `GetSkillByIdHandler`

## Seguridad

- **Autenticación**: Requiere JWT token válido
- **Autorización**: 
  - Cualquier usuario autenticado puede listar y ver skills
  - Solo usuarios con rol `ADMIN` pueden crear, editar y eliminar skills

## Base de Datos

### Tabla: `skills`
```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Índices
- `idx_skills_name`: Para búsquedas por nombre
- `idx_skills_created_at`: Para ordenamiento temporal

## Datos de Ejemplo

El sistema incluye skills de ejemplo:
- JavaScript, TypeScript, React, Node.js
- Python, SQL, Docker, Git

## Testing

Para probar el módulo:

1. **Listar skills:**
   ```bash
   curl -H "Authorization: Bearer <token>" \
        "http://localhost:3000/skills?page=1&limit=5"
   ```

2. **Crear skill (como admin):**
   ```bash
   curl -X POST \
        -H "Authorization: Bearer <admin_token>" \
        -H "Content-Type: application/json" \
        -d '{"name":"Vue.js"}' \
        "http://localhost:3000/skills"
   ```

3. **Buscar skills:**
   ```bash
   curl -H "Authorization: Bearer <token>" \
        "http://localhost:3000/skills?search=Java"
   ```
