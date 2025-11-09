#!/bin/bash

# FlipBook Deployment Script
# This script deploys the FlipBook application using Docker

set -e  # Exit on error

echo "🚀 FlipBook Deployment Script"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.docker .env
    
    # Generate random secret
    SECRET=$(openssl rand -base64 32)
    
    # Update .env with generated secret (macOS compatible)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/change-this-to-a-random-secret-key/$SECRET/" .env
    else
        sed -i "s/change-this-to-a-random-secret-key/$SECRET/" .env
    fi
    
    echo "✅ .env file created with random secret"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env file to set:"
    echo "   - ADMIN_EMAIL (default: admin@flipbook.com)"
    echo "   - ADMIN_PASSWORD (default: admin123)"
    echo "   - MYSQL_PASSWORD (for security)"
    echo ""
    read -p "Press Enter to continue after editing .env file..."
fi

echo "✅ .env file exists"
echo ""

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Build and start services
echo "🏗️  Building Docker images..."
docker-compose build --no-cache

echo ""
echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ Deployment successful!"
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
    echo "📊 Useful commands:"
    echo "   View logs:     docker-compose logs -f"
    echo "   Stop:          docker-compose down"
    echo "   Restart:       docker-compose restart"
    echo "   Rebuild:       ./deploy.sh"
    echo ""
    echo "🗄️  Database:"
    echo "   MySQL is running on port 3306"
    echo "   Access: docker-compose exec mysql mysql -u flipbook_user -p"
    echo ""
else
    echo "❌ Deployment failed. Check logs:"
    echo "   docker-compose logs"
    exit 1
fi

