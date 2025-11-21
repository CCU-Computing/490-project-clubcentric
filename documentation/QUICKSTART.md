# ClubCentric - Quick Start Guide

Get ClubCentric running in Docker in 3 easy steps!

## Prerequisites

- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Desktop running

## Option 1: Using Helper Scripts (Recommended)

### Start the Application

```bash
# Linux/Mac
./docker-start.sh --build

# Windows (PowerShell)
docker-compose up --build
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000

### Stop the Application

```bash
# Linux/Mac
./docker-stop.sh

# Windows (PowerShell)
docker-compose down
```

### Reset Everything (Fresh Start)

```bash
# Linux/Mac
./docker-reset.sh

# Windows (PowerShell)
docker-compose down -v
docker system prune -f
```

## Option 2: Manual Commands

### Build and Start

```bash
docker-compose up --build
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services

```bash
docker-compose down
```

## First Time Setup

After starting for the first time:

1. **Wait for services to initialize** (watch the logs):
   - Database will initialize (~10 seconds)
   - Backend will run migrations automatically
   - Frontend will install dependencies (~30-60 seconds on first run)

2. **Create a superuser** (optional):
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

**Note**: First startup takes longer because the frontend installs all npm dependencies. Subsequent startups are much faster.

## Common Issues

### Port Already in Use

If you see "port is already allocated":

**Option 1**: Stop conflicting services
```bash
# Find what's using port 8000
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process or stop your local Django/React servers
```

**Option 2**: Change ports in `docker-compose.yml`
```yaml
ports:
  - "3000:5173"  # Frontend
  - "9000:8000"  # Backend
```

### Permission Errors

```bash
# Reset and rebuild
docker-compose down -v
docker-compose up --build
```

### Database Connection Issues

```bash
# Reset database
docker-compose down -v
docker-compose up --build
```

### Frontend Not Loading / Dependency Errors

If you see errors about missing dependencies (`@mui/material`, `@fullcalendar`, etc.):

```bash
# Stop and rebuild frontend (will reinstall dependencies)
docker-compose down
docker-compose up --build frontend
```

If frontend is stuck installing dependencies:
```bash
# Check the logs to see progress
docker-compose logs -f frontend
```

## Development Workflow

### Making Code Changes

- **Backend**: Changes auto-reload (Django development server)
- **Frontend**: Changes trigger hot module replacement (HMR)

### Installing New Packages

**Backend** (add to requirements.txt first):
```bash
docker-compose down
docker-compose up --build backend
```

**Frontend** (add to package.json first):
```bash
# Option 1: Install inside running container
docker-compose exec frontend npm install <package-name>

# Option 2: Rebuild (recommended - ensures clean state)
docker-compose down
docker-compose up --build frontend
```

**Note**: Frontend dependencies are installed fresh on each build, so rebuilding is the safest way to add packages.

### Running Django Commands

```bash
# Migrations
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate

# Django shell
docker-compose exec backend python manage.py shell

# Create superuser
docker-compose exec backend python manage.py createsuperuser
```

### Accessing Database

```bash
# From host machine
psql -h localhost -p 5432 -U clubuser -d clubcentric_db
# Password: clubpass

# From container
docker-compose exec db psql -U clubuser -d clubcentric_db
```

## What's Included

### Services
- **PostgreSQL 16**: Database server (port 5432)
  - User: `clubuser`
  - Password: `clubpass`
  - Database: `clubcentric_db`
- **Django Backend**: REST API server (port 8000)
  - Auto-migrations on startup
  - Media files in `./backend/media`
  - Full CORS configuration for frontend
- **React Frontend**: Vite dev server with HMR (port 5173)
  - Material-UI components
  - FullCalendar integration
  - Auto-installs dependencies on startup

### Features
- ✅ User authentication and profiles
- ✅ Club management (create, update, delete)
- ✅ Club memberships with roles (organizer/member)
- ✅ Calendar and meeting scheduling
- ✅ Document management
- ✅ Profile pictures and file uploads
- ✅ Real-time updates with HMR

## Data Persistence

### Where Data Lives
- **Database** (`postgres_data` volume):
  - All user accounts, clubs, memberships
  - Calendar events and meetings
  - Document references
  - **Persists across container restarts**

- **Media Files** (`./backend/media` directory):
  - Profile pictures → `./backend/media/profiles/`
  - Uploaded documents → `./backend/media/documents/`
  - **Stored on your host filesystem**
  - Directly accessible and easy to backup

- **Frontend Dependencies** (container filesystem):
  - npm packages in container
  - Reinstalled automatically on rebuild
  - No need to backup

### Backup & Reset

**Backup everything:**
```bash
# Backup database
docker-compose exec db pg_dump -U clubuser clubcentric_db > backup.sql

# Backup media files
tar czf media-backup.tar.gz backend/media
```

**Reset database only:**
```bash
docker-compose down -v  # Removes postgres_data volume
docker-compose up --build
```

**Reset media files:**
```bash
rm -rf backend/media/profiles backend/media/documents
```

## Need More Help?

- See `DOCKER_README.md` for detailed documentation
- Check `docker-compose.yml` for configuration details
- View logs: `docker-compose logs -f`

## Quick Reference

| Task | Command |
|------|---------|
| Start | `./docker-start.sh --build` or `docker-compose up --build` |
| Stop | `./docker-stop.sh` or `docker-compose down` |
| Restart | `docker-compose restart` |
| Rebuild | `docker-compose up --build` |
| Logs | `docker-compose logs -f` |
| Shell | `docker-compose exec backend bash` |
| Database | `docker-compose exec db psql -U clubuser -d clubcentric_db` |
| Reset | `./docker-reset.sh` or `docker-compose down -v` |

Happy coding! 🚀
