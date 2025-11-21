#!/bin/bash

# --- Configuration ---
# If your venv is in a specific place, you can activate it here.
# Otherwise, run this script from a terminal where the venv is already active.
# source ../venv/bin/activate 

# Function to handle script exit (Ctrl+C)
cleanup() {
    echo ""
    echo "Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    wait
    echo "Services stopped."
}

# Set the trap to call cleanup on exit
trap cleanup SIGINT SIGTERM EXIT

echo "---------------------------------------------------"
echo "Starting ClubCentric Development Environment"
echo "---------------------------------------------------"

cd backend

# 1. Apply Migrations (Always run this to keep DB in sync)
echo "[Backend] Applying migrations..."
python manage.py migrate

# 2. Optional: Load Data if argument is provided
if [[ "$1" == "--load-data" ]]; then
    echo "[Backend] Loading sample data..."
    python manage.py loaddata sampleClubs
fi

# 3. Start the Backend (Django)
echo "[Backend] Starting Django Server..."
# Using --noreload is optional, but standard runserver is fine.
python manage.py runserver &
BACKEND_PID=$!
cd .. # Return to root

# Wait a moment for backend to initialize (optional but helpful)
sleep 2

# 4. Start the Frontend (React/Vite)
echo "[Frontend] Starting Vite Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd .. # Return to root

echo "---------------------------------------------------"
echo "Both services are running."
echo "Backend: http://127.0.0.1:8000"
echo "Frontend: http://localhost:5173 (usually)"
echo "Use './run_project.sh --load-data' to reset DB data."
echo "Press Ctrl+C to stop both."
echo "---------------------------------------------------"

# Keep the script running to maintain the trap
wait

##############################################
# you need to do the below steps to run script
##############################################
# chmod +x run_project.sh
# 3.  **Run:** Make sure your virtual environment is active (like in your screenshot), then run: (also be in the main project repo folder)
# ```bash

# ./run_project.sh    ~~~OR~~~   ./run_project.sh --load-data
