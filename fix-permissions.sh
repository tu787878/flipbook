#!/bin/bash
# Fix upload permissions for FlipBook

echo "🔧 Fixing upload permissions..."

# Stop app temporarily to fix permissions as root
docker-compose stop app

# Start a temporary container to fix permissions
docker-compose run --rm --user root app sh -c "
  mkdir -p /app/public/uploads/menus /app/public/uploads/shops && 
  chown -R nextjs:nodejs /app/public/uploads &&
  chmod -R 755 /app/public/uploads
"

# Start app again
docker-compose up -d app

echo "✅ Permissions fixed!"
echo "Uploads directory is ready."

