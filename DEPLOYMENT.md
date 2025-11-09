# 🚀 FlipBook Deployment Guide

## Quick Deploy with Docker

### One-Command Deployment:

```bash
./deploy.sh
```

This script will:
1. ✅ Check Docker installation
2. ✅ Create .env file with random secrets
3. ✅ Build Docker images
4. ✅ Start all services (MySQL + App)
5. ✅ Create admin account automatically
6. ✅ Display access information

---

## 📋 Prerequisites

- Docker Desktop installed
- Docker Compose installed
- Port 3002 available
- Port 3306 available (MySQL)

---

## 🔧 Configuration

### 1. Environment Variables

The `.env` file will be created automatically. Key settings:

```env
# Application
APP_PORT=3002                    # Access at http://localhost:3002
NEXTAUTH_URL="http://localhost:3002"

# Admin Account (Change these!)
ADMIN_EMAIL="admin@flipbook.com"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Admin"

# MySQL Database
MYSQL_USER=flipbook_user
MYSQL_PASSWORD=flipbook_password
MYSQL_DATABASE=flipbook
```

### 2. Custom Admin Account

Before deploying, edit `.env`:

```env
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="YourSecurePassword123"
ADMIN_NAME="Your Name"
```

---

## 🚀 Deployment Steps

### Step 1: Make deploy script executable

```bash
chmod +x deploy.sh
```

### Step 2: Run deployment

```bash
./deploy.sh
```

### Step 3: Access application

```
http://localhost:3002
```

**Login with:**
- Email: (from your .env ADMIN_EMAIL)
- Password: (from your .env ADMIN_PASSWORD)

---

## 📦 What Gets Deployed

### Services:
1. **MySQL Database**
   - Container: `flipbook-mysql`
   - Port: 3306
   - Data: Persistent volume

2. **Next.js Application**
   - Container: `flipbook-app`
   - Port: 3002
   - Includes: All dependencies, PDF support (canvas)

### Auto-Setup:
- ✅ Database tables created
- ✅ Admin account created
- ✅ Upload directory ready
- ✅ All migrations applied

---

## 🛠️ Management Commands

```bash
# View logs
docker-compose logs -f

# View app logs only
docker-compose logs -f app

# View MySQL logs only
docker-compose logs -f mysql

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Access MySQL
docker-compose exec mysql mysql -u flipbook_user -p
# Password: flipbook_password (from .env)

# Access app shell
docker-compose exec app sh

# Check status
docker-compose ps
```

---

## 🔒 Security for Production

### 1. Change Default Passwords

Edit `.env` before deploying:

```env
# Use strong passwords
ADMIN_PASSWORD="$(openssl rand -base64 32)"
MYSQL_ROOT_PASSWORD="$(openssl rand -base64 32)"
MYSQL_PASSWORD="$(openssl rand -base64 32)"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
```

### 2. Use Environment-Specific URLs

```env
# Production
NEXTAUTH_URL="https://yourdomain.com"

# Staging
NEXTAUTH_URL="https://staging.yourdomain.com"

# Local
NEXTAUTH_URL="http://localhost:3002"
```

### 3. Don't Expose MySQL Port

In production, comment out MySQL port mapping:

```yaml
# ports:
#   - "3306:3306"
```

---

## 🌐 Deploy to Production

### Option 1: Docker on VPS (DigitalOcean, AWS, etc.)

```bash
# On your server
git clone <your-repo>
cd flip-book

# Edit .env with production values
nano .env

# Deploy
chmod +x deploy.sh
./deploy.sh

# Setup reverse proxy (nginx)
# Point domain to localhost:3002
```

### Option 2: Docker Compose on Cloud

```bash
# Same as above, but add SSL
# Use nginx-proxy or Traefik for HTTPS
```

### Option 3: Container Registry

```bash
# Build and push
docker build -t your-registry/flipbook:latest .
docker push your-registry/flipbook:latest

# Deploy to:
# - AWS ECS
# - Google Cloud Run
# - Azure Container Apps
# - Railway
# - Render
```

---

## 📊 Health Checks

### Check Services:

```bash
# All services status
docker-compose ps

# App health
curl http://localhost:3002

# MySQL health
docker-compose exec mysql mysqladmin ping -h localhost
```

### View Resources:

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

---

## 🔄 Update Application

### Deploy New Version:

```bash
# Pull latest code
git pull

# Rebuild and deploy
./deploy.sh
```

### Database Migrations:

```bash
# Run migrations
docker-compose exec app npx prisma migrate deploy

# Or push schema
docker-compose exec app npx prisma db push
```

---

## 🗄️ Database Backup

### Backup:

```bash
# Create backup
docker-compose exec mysql mysqldump -u flipbook_user -pflipbook_password flipbook > backup.sql

# With date
docker-compose exec mysql mysqldump -u flipbook_user -pflipbook_password flipbook > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore:

```bash
# Restore from backup
docker-compose exec -T mysql mysql -u flipbook_user -pflipbook_password flipbook < backup.sql
```

---

## 🐛 Troubleshooting

### Issue: Port 3002 already in use

```bash
# Find process using port
lsof -ti:3002

# Kill process
kill -9 $(lsof -ti:3002)

# Or change port in .env
APP_PORT=3003
```

### Issue: Cannot connect to MySQL

```bash
# Check MySQL is running
docker-compose ps mysql

# Check logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

### Issue: Admin account not created

```bash
# Manually seed
docker-compose exec app npm run db:seed
```

### Issue: Pages not uploading

```bash
# Check permissions
docker-compose exec app ls -la public/uploads

# Create if missing
docker-compose exec app mkdir -p public/uploads
```

---

## 📁 File Locations

### In Docker Container:

```
/app/                          # Application root
/app/public/uploads/           # Uploaded files
/app/prisma/                   # Database schema
/app/.next/                    # Built application
```

### On Host (Persistent):

```
./public/uploads/              # Mounted volume
mysql_data volume              # Database data
```

---

## 🎯 Production Checklist

Before deploying to production:

- [ ] Edit `.env` with production values
- [ ] Set strong ADMIN_PASSWORD
- [ ] Set strong MYSQL_PASSWORD
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Update NEXTAUTH_URL to your domain
- [ ] Remove MySQL port exposure
- [ ] Set up SSL/HTTPS
- [ ] Configure domain name
- [ ] Test all features
- [ ] Set up automated backups
- [ ] Configure monitoring
- [ ] Set up log aggregation

---

## 🌟 Features Included

### Application:
✅ Single admin account (environment-configured)
✅ Multi-shop management
✅ Multiple menus per shop
✅ Multiple image upload
✅ StPageFlip library (realistic page curl)
✅ 2-page spread view
✅ Mobile responsive
✅ Embed code generation

### Docker:
✅ MySQL 8.0 included
✅ Auto-migration on start
✅ Auto-seed admin account
✅ Persistent data volumes
✅ Health checks
✅ Restart policies

---

## 🎉 Quick Start

```bash
# 1. Make deploy script executable
chmod +x deploy.sh

# 2. Deploy
./deploy.sh

# 3. Access
open http://localhost:3002/auth/signin

# 4. Login
Email: admin@flipbook.com
Password: admin123
```

**That's it!** 🚀

---

## 📞 Support

- Check logs: `docker-compose logs -f`
- View status: `docker-compose ps`
- Restart: `docker-compose restart`
- Full reset: `docker-compose down -v` (⚠️ deletes data)

---

**Your FlipBook is ready for production deployment!** 🎉

