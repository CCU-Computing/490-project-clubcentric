# ClubCentric Docker Setup

This document explains how to run the ClubCentric application using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### 1. Build and Start Services

```bash
docker-compose up --build
```

This will:
- Build the frontend, backend, and database containers
- Start PostgreSQL database
- Run Django migrations
- Start the Django development server on http://localhost:8000
- Start the Vite development server on http://localhost:5173

### 2. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Database**: localhost:5432 (credentials in docker-compose.yml)

## Common Commands

### Start services (after initial build)
```bash
docker-compose up
```

### Start services in background
```bash
docker-compose up -d
```

### View logs
```bash
docker-compose logs -f
```

### View logs for specific service
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stop services
```bash
docker-compose down
```

### Stop services and remove volumes (⚠️ deletes database data)
```bash
docker-compose down -v
```

### Rebuild specific service
```bash
docker-compose up --build backend
```

### Execute commands in running container
```bash
# Django shell
docker-compose exec backend python manage.py shell

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Run migrations manually
docker-compose exec backend python manage.py migrate

# Install npm packages
docker-compose exec frontend npm install <package-name>
```

### Access container bash
```bash
docker-compose exec backend bash
docker-compose exec frontend bash
```

## Architecture

The Docker setup consists of three services running in isolated containers, communicating over a private network:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│    Backend      │────▶│   Database      │
│   (React)       │     │   (Django)      │     │  (PostgreSQL)   │
│   Port 5173     │     │   Port 8000     │     │   Port 5432     │
│                 │     │                 │     │                 │
│ - Vite dev      │     │ - REST API      │     │ - User data     │
│ - Auto HMR      │     │ - Auto migrate  │     │ - Clubs         │
│ - npm install   │     │ - Media files   │     │ - Persistent    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 1. Database (PostgreSQL)
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Data**: Persisted in `postgres_data` volume
- **Credentials** (defined in docker-compose.yml):
  - Database: clubcentric_db
  - User: clubuser
  - Password: clubpass

### 2. Backend (Django)
- **Port**: 8000
- **Volumes**:
  - `./backend` → `/app` (live code updates, includes media directory)
- **Features**:
  - Waits for database to be ready
  - Runs migrations automatically on startup
  - Non-root user for security
  - Media files stored in `./backend/media` on host

### 3. Frontend (React + Vite)
- **Port**: 5173
- **Volumes**:
  - `./frontend` → `/app` (live code updates)
- **Features**:
  - Hot module replacement (HMR) enabled
  - Non-root user for security
  - Dependencies installed automatically on first run

## Volume Permissions

The setup uses bind mounts and proper user configuration to avoid permission issues:

1. **Non-Root Users**: Containers run as non-root users (node/appuser with UID 1000)
2. **Bind Mounts**: All application code and data mounted from host (./backend, ./frontend)
3. **Named Volumes**: Only used for PostgreSQL database for better performance
4. **No Permission Conflicts**: Files created in containers match your host user permissions

## Troubleshooting

### Permission Denied Errors

If you encounter permission errors with files or directories:

1. **Reset and rebuild**:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

2. **Check file ownership on host**:
   ```bash
   ls -la backend/media
   ```
   Files should be owned by your user (not root)

3. **If media directory has wrong permissions**:
   ```bash
   sudo chown -R $USER:$USER backend/media
   ```

### Database Connection Issues

If backend can't connect to database:

1. Wait for database health check to pass:
   ```bash
   docker-compose logs db
   ```

2. Verify database is running:
   ```bash
   docker-compose ps
   ```

3. Check database connection manually:
   ```bash
   docker-compose exec backend python manage.py dbshell
   ```

### Frontend Not Loading

If frontend doesn't load or shows dependency errors:

1. **Check Vite is running and installing dependencies**:
   ```bash
   docker-compose logs -f frontend
   ```
   You should see npm installing packages (first run takes ~30-60 seconds)

2. **Verify the API URL** in browser developer tools (should be `http://localhost:8000`)

3. **Rebuild frontend** (will reinstall all dependencies):
   ```bash
   docker-compose down
   docker-compose up --build frontend
   ```

4. **Check for missing packages**: If you see errors about `@mui/material` or other packages:
   ```bash
   # These are installed automatically, but you can verify package.json is complete
   docker-compose exec frontend npm list
   ```

### Port Already in Use

If ports 5173 or 8000 are already in use:

1. Stop other services using these ports
2. Or modify ports in docker-compose.yml:
   ```yaml
   ports:
     - "3000:5173"  # Use port 3000 instead of 5173
   ```

## Development Workflow

### Making Code Changes

- **Backend**: Changes to Python files trigger Django's auto-reload
- **Frontend**: Changes to React files trigger Vite's HMR

### Installing Dependencies

**Backend**:
```bash
# Add to requirements.txt first, then:
docker-compose down
docker-compose up --build backend
```

**Frontend**:
```bash
# Add package to package.json first, then:

# Option 1: Install in running container (temporary, lost on rebuild)
docker-compose exec frontend npm install <package-name>

# Option 2: Rebuild container (recommended, permanent)
docker-compose down
docker-compose up --build frontend
```

**Note**: Frontend dependencies are installed fresh on each build from `package.json`. For permanent changes, always add to `package.json` and rebuild.

### Database Migrations

Migrations run automatically on container start. To create new migrations:

```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### Resetting the Database

⚠️ **Warning**: This deletes all data

```bash
docker-compose down -v
docker-compose up --build
```

## Production Considerations

This Docker setup is optimized for development. For production:

1. Use production-grade web server (Gunicorn, Nginx)
2. Set `DEBUG=False` in Django settings
3. Use environment-specific docker-compose files
4. Use secrets management for credentials
5. Enable HTTPS
6. Set up proper backup strategies for volumes
7. Consider using managed database services

## Network Architecture

All services communicate via a bridge network called `clubcentric_network`:

- Frontend can access backend at `http://backend:8000` (internal)
- Backend can access database at `db:5432` (internal)
- External access via mapped ports (5173, 8000)

## File Upload Notes

Uploaded files (profile pictures, documents) are stored in `./backend/media` on your host filesystem, which persists naturally.

To back up media:

```bash
tar czf media-backup.tar.gz backend/media
```

To restore media:

```bash
tar xzf media-backup.tar.gz
```

The media files are directly accessible on your host at `./backend/media/profiles` and `./backend/media/documents`.

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Django in Docker](https://docs.docker.com/samples/django/)
- [Vite Docker Guide](https://vitejs.dev/guide/static-deploy.html)
