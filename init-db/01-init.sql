-- Script de inicialización para la base de datos PostgreSQL
-- Este script se ejecuta automáticamente cuando se crea el contenedor

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurar timezone
SET timezone = 'UTC';

-- Crear tabla de skills
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
CREATE INDEX IF NOT EXISTS idx_skills_created_at ON skills(created_at);

-- Insertar algunas skills de ejemplo
INSERT INTO skills (name) VALUES
    ('JavaScript'),
    ('TypeScript'),
    ('React'),
    ('Node.js'),
    ('Python'),
    ('SQL'),
    ('Docker'),
    ('Git')
ON CONFLICT (name) DO NOTHING;

-- Crear un usuario adicional para desarrollo (opcional)
-- CREATE USER gestcard_dev WITH PASSWORD 'dev_password';
-- GRANT ALL PRIVILEGES ON DATABASE gestcard_db TO gestcard_dev;
