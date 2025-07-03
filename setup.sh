#!/bin/bash

# Script de inicio rápido para GestCard Backend
# Este script configura todo lo necesario para ejecutar la aplicación

echo "🚀 Iniciando configuración de GestCard Backend..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker Desktop."
    exit 1
fi

# Verificar si Docker Compose está disponible
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está disponible."
    exit 1
fi

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+."
    exit 1
fi

# Verificar si pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm no está instalado. Instalando..."
    npm install -g pnpm
fi

echo "✅ Verificaciones completadas"

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
else
    echo "✅ Archivo .env ya existe"
fi

echo "📦 Instalando dependencias..."
pnpm install

echo "🐳 Levantando PostgreSQL con Docker..."
docker-compose up -d postgres

echo "⏳ Esperando que PostgreSQL esté listo..."
sleep 10

# Verificar si PostgreSQL está listo
until docker exec gestcard-postgres pg_isready -U postgres; do
    echo "⏳ Esperando PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL está listo"

echo "👤 Creando usuario administrador..."
npm run seed:admin

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Ejecutar: npm run dev"
echo "   2. Abrir: http://localhost:3000/api/docs"
echo "   3. Login con: admin@gestcard.com / Admin123!"
echo ""
echo "🔧 Servicios disponibles:"
echo "   - API: http://localhost:3000"
echo "   - Swagger: http://localhost:3000/api/docs"
echo "   - pgAdmin: http://localhost:8080 (admin@gestcard.com/admin123)"
echo ""
echo "🐳 Comandos Docker útiles:"
echo "   - Detener DB: npm run docker:down"
echo "   - Ver logs: npm run docker:logs"
echo "   - Reset DB: npm run docker:reset"
echo ""
