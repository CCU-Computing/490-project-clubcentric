#!/bin/bash

# ClubCentric Docker Startup Script
# This script helps you start the ClubCentric application in Docker

set -e

echo "==========================================="
echo "   ClubCentric Docker Startup Script"
echo "==========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}ERROR: Docker is not installed or not in PATH${NC}"
    echo "Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}ERROR: docker-compose is not installed or not in PATH${NC}"
    echo "Please install docker-compose or use Docker Desktop which includes it"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"
echo -e "${GREEN}✓ docker-compose is installed${NC}"
echo ""
echo "Starting ClubCentric services..."
echo ""

# Parse command line arguments
BUILD_FLAG=""
DETACH_FLAG=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --build)
            BUILD_FLAG="--build"
            echo -e "${YELLOW}Will rebuild images before starting${NC}"
            shift
            ;;
        -d|--detach)
            DETACH_FLAG="-d"
            echo -e "${YELLOW}Will run in detached mode (background)${NC}"
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Usage: $0 [--build] [-d|--detach]"
            exit 1
            ;;
    esac
done

echo ""

# Start docker-compose
if docker-compose up $BUILD_FLAG $DETACH_FLAG; then
    echo ""
    echo -e "${GREEN}==========================================="
    echo "   ClubCentric is starting!"
    echo "===========================================${NC}"
    echo ""
    echo "Services will be available at:"
    echo "  - Frontend: http://localhost:5173"
    echo "  - Backend:  http://localhost:8000"
    echo "  - Database: localhost:5432"
    echo ""

    if [ -n "$DETACH_FLAG" ]; then
        echo "Running in background. Use 'docker-compose logs -f' to view logs"
        echo "Use 'docker-compose down' to stop services"
    else
        echo "Press Ctrl+C to stop all services"
    fi
    echo ""
else
    echo ""
    echo -e "${RED}==========================================="
    echo "   ERROR: Failed to start services"
    echo "===========================================${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check if ports 5173, 8000, or 5432 are already in use"
    echo "  2. Try: docker-compose down -v"
    echo "  3. Try: docker-compose up --build"
    echo "  4. Check logs: docker-compose logs"
    echo ""
    exit 1
fi
