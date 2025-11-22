@echo off
REM STEP 2 - Install All Backend Dependencies
REM This script installs Python packages from requirements.txt

REM Change to script's directory
cd /d "%~dp0"

echo ==================================================
echo STEP 2: Installing Backend Dependencies
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

REM Check if requirements.txt exists
if not exist "backend\requirements.txt" (
    echo ERROR: requirements.txt not found at backend\requirements.txt
    echo Make sure you're in the correct project directory
    pause
    exit /b 1
)

REM Upgrade pip first
echo [Step 2.1] Upgrading pip...
call venv\Scripts\python.exe -m pip install --upgrade pip

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo WARNING: Failed to upgrade pip, continuing anyway...
    echo.
)

REM Install dependencies
echo.
echo [Step 2.2] Installing dependencies from backend\requirements.txt...
echo This may take several minutes...
echo.

call venv\Scripts\python.exe -m pip install -r backend\requirements.txt

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ==================================================
    echo ERROR: Dependency installation failed
    echo ==================================================
    echo.
    echo Please save the errors above and report them.
    echo.
    echo Common issues:
    echo   1. Network connection problems
    echo   2. Missing system dependencies (e.g., Visual C++ for psycopg2)
    echo   3. Outdated Python version
    echo.
    echo Next steps:
    echo   - Check your internet connection
    echo   - Verify Python version: python --version
    echo   - Try running manually: venv\Scripts\python.exe -m pip install -r backend\requirements.txt
    echo.
    pause
    exit /b 1
)

echo.
echo ==================================================
echo Dependencies Installed Successfully!
echo ==================================================
echo.
echo Installed packages from: backend\requirements.txt
echo.
echo Next steps:
echo   1. Run: 03_run_migrations.bat
echo   2. Then: 04_generate_mock_data.bat
echo.
pause

