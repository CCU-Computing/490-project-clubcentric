#!/bin/bash

# ClubCentric Docker Reset Script
# This completely resets the Docker environment

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "==========================================="
echo "   ClubCentric Docker Reset"
echo "==========================================="
echo ""
echo -e "${YELLOW}⚠️  WARNING: This will:${NC}"
echo "  - Stop all services"
echo "  - Remove all containers"
echo "  - Remove database volume (all data deleted)"
echo "  - Prune unused Docker resources"
echo ""
echo -e "${GREEN}Note: Media files in ./backend/media will be preserved${NC}"
echo ""
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Step 1: Stopping and removing services..."
docker-compose down -v

echo ""
echo "Step 2: Removing Docker images..."
docker-compose rm -f

echo ""
echo "Step 3: Pruning unused Docker resources..."
docker system prune -f

echo ""
echo -e "${GREEN}✓ Reset complete!${NC}"
echo ""
echo "To start fresh, run:"
echo "  ./docker-start.sh --build"
echo ""
