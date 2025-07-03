# Docker PostgreSQL para GestCard

Este archivo contiene la configuración Docker para ejecutar PostgreSQL y pgAdmin en contenedores.

## 🐳 Servicios Incluidos

- **PostgreSQL 15**: Base de datos principal
- **pgAdmin 4**: Interfaz web para administrar PostgreSQL

## 🚀 Iniciar los Servicios

```bash
# Iniciar PostgreSQL y pgAdmin
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (cuidado: borra todos los datos)
docker-compose down -v
```

## 🔧 Configuración

### PostgreSQL
- **Host**: localhost
- **Puerto**: 5432
- **Base de datos**: gestcard_db
- **Usuario**: postgres
- **Contraseña**: postgres

### pgAdmin
- **URL**: http://localhost:8080
- **Email**: admin@gestcard.com
- **Contraseña**: admin123

## 📋 Comandos Útiles

```bash
# Conectar a PostgreSQL desde el contenedor
docker exec -it gestcard-postgres psql -U postgres -d gestcard_db

# Backup de la base de datos
docker exec gestcard-postgres pg_dump -U postgres gestcard_db > backup.sql

# Restaurar backup
docker exec -i gestcard-postgres psql -U postgres -d gestcard_db < backup.sql

# Ver estado de los contenedores
docker-compose ps

# Reiniciar solo PostgreSQL
docker-compose restart postgres
```

## 🗄️ Configurar pgAdmin

1. Abrir http://localhost:8080
2. Iniciar sesión con las credenciales arriba
3. Agregar servidor PostgreSQL:
   - **Host**: postgres (nombre del contenedor)
   - **Puerto**: 5432
   - **Usuario**: postgres
   - **Contraseña**: postgres

## 📁 Volúmenes

Los datos se persisten en volúmenes Docker:
- `postgres_data`: Datos de PostgreSQL
- `pgadmin_data`: Configuración de pgAdmin

## 🔧 Variables de Entorno

Las variables en `.env` están configuradas para conectar automáticamente:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=gestcard_db
```

## 🚨 Producción

⚠️ **Importante**: Esta configuración es solo para desarrollo. En producción:

1. Cambiar contraseñas
2. Usar secrets/variables de entorno seguras
3. Configurar redes privadas
4. Habilitar SSL/TLS
5. Configurar backups automáticos
