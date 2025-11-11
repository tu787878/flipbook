#!/bin/bash
# Complete fix script for FlipBook

echo "🔧 FlipBook Complete Fix"
echo "========================"
echo ""

echo "Step 1: Creating admin user..."
docker-compose exec app node prisma/seed.js

echo ""
echo "Step 2: Fixing upload permissions..."
docker-compose exec --user root app sh -c "
  mkdir -p /app/public/uploads/menus /app/public/uploads/shops &&
  chown -R nextjs:nodejs /app/public/uploads &&
  chmod -R 777 /app/public/uploads
"

echo ""
echo "Step 3: Restarting app..."
docker-compose restart app

echo ""
echo "✅ All fixes applied!"
echo "========================"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Open in INCOGNITO/PRIVATE window (to clear session):"
echo "   http://localhost:3002"
echo ""
echo "2. Login:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "3. In Dashboard:"
echo "   - Delete any broken menus (showing loading)"
echo "   - Create new shop"
echo "   - Create new menu"
echo "   - Upload images (will work now!)"
echo ""
echo "4. View menu - should show mobile single-page layout"
echo ""
echo "⚠️  IMPORTANT: Use incognito window to avoid old session!"

