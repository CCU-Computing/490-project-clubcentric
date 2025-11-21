#!/bin/bash

# ClubCentric Docker Stop Script

set -e

echo "==========================================="
echo "   Stopping ClubCentric Services"
echo "==========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse command line arguments
REMOVE_VOLUMES=""

if [[ "$1" == "--volumes" ]] || [[ "$1" == "-v" ]]; then
    REMOVE_VOLUMES="-v"
    echo -e "${YELLOW}⚠️  WARNING: This will remove the database volume${NC}"
    echo "Note: Media files in ./backend/media will NOT be deleted"
    echo ""
    read -p "Are you sure? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 1
    fi
fi

if docker-compose down $REMOVE_VOLUMES; then
    echo ""
    echo -e "${GREEN}✓ Services stopped successfully${NC}"

    if [ -n "$REMOVE_VOLUMES" ]; then
        echo -e "${YELLOW}✓ Volumes removed (data deleted)${NC}"
    fi
else
    echo ""
    echo -e "${RED}ERROR: Failed to stop services${NC}"
    exit 1
fi

echo ""
