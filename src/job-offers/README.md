# Job Offers Module

Este módulo maneja la gestión de ofertas de trabajo en el sistema. Implementa un CRUD completo con paginación y control de acceso.

## Características

- **CRUD completo**: Crear, leer, actualizar y eliminar ofertas de trabajo
- **Paginación**: Lista paginada de ofertas con filtros
- **Control de acceso**: 
  - Endpoints públicos para listar y ver ofertas
  - Endpoints protegidos para administradores (crear, actualizar, eliminar)
- **Filtros avanzados**: Búsqueda por texto, ubicación, empresa, tipo de empleo, salario, etc.
- **Arquitectura CQRS**: Separación de comandos y consultas

## Endpoints

### Públicos
- `GET /job-offers` - Listar ofertas con paginación y filtros
- `GET /job-offers/:id` - Obtener una oferta específica

### Solo Administradores
- `POST /job-offers` - Crear nueva oferta
- `PUT /job-offers/:id` - Actualizar oferta existente
- `DELETE /job-offers/:id` - Eliminar oferta

## Filtros disponibles

- `search`: Búsqueda en título y descripción
- `location`: Filtrar por ubicación
- `company`: Filtrar por empresa
- `employmentType`: Tipo de empleo (FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP)
- `status`: Estado (ACTIVE, INACTIVE, CLOSED)
- `minSalary`: Salario mínimo
- `maxSalary`: Salario máximo
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10, max: 100)

## Estructura de la entidad

```typescript
{
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: number;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  status: 'ACTIVE' | 'INACTIVE' | 'CLOSED';
  requirements: string[];
  benefits: string[];
  experienceLevel?: string;
  applicationDeadline?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Ejemplo de uso

### Listar ofertas con filtros
```bash
GET /job-offers?page=1&limit=10&search=developer&location=Madrid&employmentType=FULL_TIME&minSalary=30000
```

### Crear nueva oferta (Admin)
```bash
POST /job-offers
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Senior Developer",
  "description": "Buscamos un desarrollador senior...",
  "company": "Tech Corp",
  "location": "Madrid",
  "salary": 50000,
  "employmentType": "FULL_TIME",
  "requirements": ["JavaScript", "Node.js", "React"],
  "benefits": ["Seguro médico", "Trabajo remoto"],
  "experienceLevel": "Senior",
  "applicationDeadline": "2025-12-31"
}
```
