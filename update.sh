#!/bin/bash

# FlipBook Update Script
# This script pulls latest changes from git, stops Docker containers, and restarts them

set -e  # Exit on error

echo "🔄 FlipBook Update Script"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Pull from git
echo -e "${YELLOW}📥 Step 1: Pulling latest changes from git...${NC}"
if git pull; then
    echo -e "${GREEN}✅ Successfully pulled from git${NC}"
else
    echo -e "${RED}❌ Failed to pull from git${NC}"
    exit 1
fi
echo ""

# Step 2: Stop Docker containers
echo -e "${YELLOW}🛑 Step 2: Stopping Docker containers...${NC}"
if docker-compose down; then
    echo -e "${GREEN}✅ Docker containers stopped${NC}"
else
    echo -e "${RED}❌ Failed to stop Docker containers${NC}"
    exit 1
fi
echo ""

# Step 3: Rebuild and start Docker containers
echo -e "${YELLOW}🚀 Step 3: Rebuilding and starting Docker containers...${NC}"
echo -e "${YELLOW}   (This may take a few minutes)${NC}"
if docker-compose up -d --build; then
    echo -e "${GREEN}✅ Docker containers started successfully${NC}"
else
    echo -e "${RED}❌ Failed to start Docker containers${NC}"
    exit 1
fi
echo ""

# Step 4: Show status
echo -e "${YELLOW}📊 Step 4: Checking container status...${NC}"
docker-compose ps
echo ""

# Step 5: Show logs (optional)
echo -e "${GREEN}✅ Update complete!${NC}"
echo ""
echo "To view logs, run:"
echo "  docker-compose logs -f"
echo ""
echo "To view app logs only:"
echo "  docker-compose logs -f app"
echo ""

