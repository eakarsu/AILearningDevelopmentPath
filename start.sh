#!/bin/bash

# AI Learning & Development Path - Start Script
# ================================================

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_DIR"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════╗"
echo "║     AI Learning & Development Path               ║"
echo "║     Starting Application...                       ║"
echo "╚══════════════════════════════════════════════════╝"
echo -e "${NC}"

# Load .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
  echo -e "${GREEN}✓ Environment variables loaded${NC}"
else
  echo -e "${RED}✗ .env file not found! Please create one.${NC}"
  exit 1
fi

BACKEND_PORT=${BACKEND_PORT:-4000}
FRONTEND_PORT=${FRONTEND_PORT:-3000}

# Function to kill processes on ports
cleanup_ports() {
  echo -e "${YELLOW}Cleaning up ports...${NC}"
  for port in $BACKEND_PORT $FRONTEND_PORT; do
    pid=$(lsof -ti:$port 2>/dev/null || true)
    if [ -n "$pid" ]; then
      echo -e "${YELLOW}  Killing process on port $port (PID: $pid)${NC}"
      kill -9 $pid 2>/dev/null || true
      sleep 1
    fi
  done
  echo -e "${GREEN}✓ Ports cleaned${NC}"
}

# Cleanup on exit
cleanup() {
  echo -e "\n${YELLOW}Shutting down...${NC}"
  cleanup_ports
  # Kill background processes
  jobs -p | xargs -r kill 2>/dev/null || true
  echo -e "${GREEN}✓ Application stopped${NC}"
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Clean up ports first
cleanup_ports

# Check PostgreSQL
echo -e "${BLUE}Checking PostgreSQL...${NC}"
if command -v pg_isready &>/dev/null; then
  if pg_isready -q 2>/dev/null; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
  else
    echo -e "${YELLOW}Starting PostgreSQL...${NC}"
    if command -v brew &>/dev/null; then
      brew services start postgresql@14 2>/dev/null || brew services start postgresql 2>/dev/null || true
    fi
    sleep 2
  fi
fi

# Create database if not exists
echo -e "${BLUE}Setting up database...${NC}"
DB_NAME=$(echo $DATABASE_URL | sed 's/.*\///')
createdb "$DB_NAME" 2>/dev/null || echo -e "${YELLOW}  Database '$DB_NAME' already exists${NC}"
echo -e "${GREEN}✓ Database ready${NC}"

# Install dependencies
echo -e "${BLUE}Installing backend dependencies...${NC}"
cd "$PROJECT_DIR/backend"
npm install --silent 2>&1 | tail -1
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo -e "${BLUE}Installing frontend dependencies...${NC}"
cd "$PROJECT_DIR/frontend"
npm install --silent 2>&1 | tail -1
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Seed database
echo -e "${BLUE}Seeding database...${NC}"
cd "$PROJECT_DIR/backend"
node src/seeds/seed.js
echo -e "${GREEN}✓ Database seeded${NC}"

# Start backend with nodemon (auto-reload)
echo -e "${BLUE}Starting backend on port $BACKEND_PORT with auto-reload...${NC}"
cd "$PROJECT_DIR/backend"
npx nodemon src/server.js &
BACKEND_PID=$!
sleep 3
echo -e "${GREEN}✓ Backend running (PID: $BACKEND_PID)${NC}"

# Start frontend with auto-reload (built-in with react-scripts)
echo -e "${BLUE}Starting frontend on port $FRONTEND_PORT with auto-reload...${NC}"
cd "$PROJECT_DIR/frontend"
PORT=$FRONTEND_PORT BROWSER=none npm start &
FRONTEND_PID=$!
sleep 3
echo -e "${GREEN}✓ Frontend running (PID: $FRONTEND_PID)${NC}"

echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║  ${GREEN}Application is running!${PURPLE}                          ║${NC}"
echo -e "${PURPLE}║                                                  ║${NC}"
echo -e "${PURPLE}║  ${BLUE}Frontend: ${NC}http://localhost:$FRONTEND_PORT${PURPLE}               ║${NC}"
echo -e "${PURPLE}║  ${BLUE}Backend:  ${NC}http://localhost:$BACKEND_PORT${PURPLE}               ║${NC}"
echo -e "${PURPLE}║                                                  ║${NC}"
echo -e "${PURPLE}║  ${YELLOW}Login: admin@company.com / password123${PURPLE}          ║${NC}"
echo -e "${PURPLE}║                                                  ║${NC}"
echo -e "${PURPLE}║  ${NC}Press Ctrl+C to stop${PURPLE}                             ║${NC}"
echo -e "${PURPLE}║  ${NC}Code changes auto-reload${PURPLE}                         ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════╝${NC}"
echo ""

# Wait for background processes
wait
