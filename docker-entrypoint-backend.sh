#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h "${DB_HOST}" -p "${DB_PORT}" -U "${DB_USER}"; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - executing migrations"

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create media directories if they don't exist (won't fail if already exists)
mkdir -p /app/media/profiles 2>/dev/null || echo "Media directories already exist"
mkdir -p /app/media/documents 2>/dev/null || echo "Media directories already exist"

echo "Starting Django server..."
exec "$@"
