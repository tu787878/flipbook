#!/bin/bash

# Force complete rebuild of FlipBook Docker containers
# Use this when you need to clear all caches and rebuild from scratch

set -e

echo "🧹 Cleaning Docker environment..."
echo "================================"
echo ""

# Stop and remove all containers
echo "🛑 Stopping containers..."
docker-compose down -v 2>/dev/null || true

# Remove any flipbook images
echo "🗑️  Removing old images..."
docker rmi flipbook-app flipbook_app 2>/dev/null || true
docker rmi $(docker images -q flip-book-app) 2>/dev/null || true

# Prune build cache
echo "🧼 Pruning build cache..."
docker builder prune -f

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "🏗️  Rebuilding from scratch..."
echo "================================"
echo ""

# Rebuild with no cache
docker-compose build --no-cache --pull

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Rebuild successful!"
    echo "================================"
    echo ""
    echo "🎉 FlipBook is now running!"
    echo ""
    echo "📍 Access your application:"
    echo "   http://localhost:3002"
    echo ""
    echo "🔐 Admin Login:"
    echo "   Email: $(grep ADMIN_EMAIL .env | cut -d '=' -f2 | tr -d '"')"
    echo "   Password: $(grep ADMIN_PASSWORD .env | cut -d '=' -f2 | tr -d '"')"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f"
    echo ""
else
    echo "❌ Rebuild failed. Check logs:"
    echo "   docker-compose logs"
    exit 1
fi

