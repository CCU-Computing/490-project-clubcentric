@echo off
REM STEP 3 - Run Migrations (makemigrations and migrate)
REM This script creates and applies database migrations

REM Change to script's directory
cd /d "%~dp0"

echo ==================================================
echo STEP 3: Running Database Migrations
echo ==================================================
echo.

REM Check if we're in the right directory
if not exist "backend\manage.py" (
    echo ERROR: This script must be run from the project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Check if venv exists
if not exist "venv\Scripts\python.exe" (
    echo ERROR: Virtual environment not found at venv\
    echo Please run 01_setup_venv.bat first
    pause
    exit /b 1
)

REM Check if .env file exists (for PostgreSQL)
if not exist "backend\.env" (
    echo WARNING: .env file not found at backend\.env
    echo Database connection may fail if not configured.
    echo.
    choice /C YN /M "Continue anyway (database may use defaults)"
    if errorlevel 2 (
        echo Operation cancelled.
        echo Please create backend\.env file with database credentials first.
        pause
        exit /b 0
    )
    echo.
)

REM Step 1: Make migrations
echo [Step 3.1] Creating migrations...
call venv\Scripts\python.exe backend\manage.py makemigrations

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ==================================================
    echo ERROR: Failed to create migrations
    echo ==================================================
    echo.
    echo Please save the errors above and report them.
    echo.
    echo Common issues:
    echo   1. Database connection errors (check .env file)
    echo   2. Model import errors
    echo   3. Missing dependencies
    echo.
    pause
    exit /b 1
)

echo.
echo [Step 3.2] Applying migrations to database...
echo This may take a moment...
echo.

call venv\Scripts\python.exe backend\manage.py migrate

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ==================================================
    echo ERROR: Failed to apply migrations
    echo ==================================================
    echo.
    echo Please save the errors above and report them.
    echo.
    echo Common issues:
    echo   1. Database connection errors (check .env file)
    echo   2. PostgreSQL not running (check service status)
    echo   3. Database doesn't exist (create it first)
    echo   4. Permission errors
    echo.
    echo Troubleshooting:
    echo   - Check PostgreSQL service: services.msc
    echo   - Verify .env file has correct credentials
    echo   - Check database exists in pgAdmin
    echo.
    pause
    exit /b 1
)

echo.
echo ==================================================
echo Migrations Completed Successfully!
echo ==================================================
echo.
echo Database schema is up to date.
echo.
echo Next steps:
echo   1. Run: 04_generate_mock_data.bat (optional)
echo   2. Then: 05_start_backend.bat
echo.
pause

