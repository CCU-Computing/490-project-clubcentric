#!/bin/bash
set -e

echo "Installing frontend dependencies..."
npm install

echo "Starting Vite dev server..."
exec npm run dev
