@echo off
REM STEP 1 - Create and Activate Virtual Environment
REM This script creates a virtual environment in the project root

REM Change to script's directory
cd /d "%~dp0"

echo ==================================================
echo STEP 1: Setting Up Virtual Environment
echo ==================================================
echo.

REM Check if we're in the right directory
if not exist "backend\manage.py" (
    echo ERROR: This script must be run from the project root directory
    echo Current directory: %CD%
    echo Expected location: 490-project-clubcentric\
    pause
    exit /b 1
)

REM Check if venv already exists
if exist "venv" (
    echo WARNING: Virtual environment already exists at venv\
    echo.
    choice /C YN /M "Do you want to delete and recreate it"
    if errorlevel 2 (
        echo Operation cancelled.
        pause
        exit /b 0
    )
    echo.
    echo Removing existing virtual environment...
    rmdir /s /q venv
    echo.
)

REM Create virtual environment
echo [Step 1.1] Creating virtual environment...
python -m venv venv

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to create virtual environment
    echo Make sure Python is installed and in your PATH
    echo Try running: python --version
    pause
    exit /b 1
)

echo.
echo [Step 1.2] Virtual environment created successfully!
echo.
echo ==================================================
echo Virtual Environment Setup Complete
echo ==================================================
echo.
echo Location: %CD%\venv
echo.
echo To activate manually:
echo   .\venv\Scripts\activate
echo.
echo Next steps:
echo   1. Run: 02_install_dependencies.bat
echo   2. Then: 03_run_migrations.bat
echo.
pause

