-- Script de inicialización para la base de datos PostgreSQL
-- Este script se ejecuta automáticamente cuando se crea el contenedor

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurar timezone
SET timezone = 'UTC';

-- Crear un usuario adicional para desarrollo (opcional)
-- CREATE USER gestcard_dev WITH PASSWORD 'dev_password';
-- GRANT ALL PRIVILEGES ON DATABASE gestcard_db TO gestcard_dev;
