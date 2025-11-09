# 🐳 Docker Setup Guide

This guide will help you run the FlipBook application using Docker, which **solves all dependency issues** including canvas/PDF processing.

## 🎯 Why Docker?

✅ **Advantages:**
- ✅ No need to install MySQL locally
- ✅ No canvas dependency issues
- ✅ Everything works out of the box
- ✅ Consistent environment across all systems
- ✅ Easy deployment to production
- ✅ Isolated from your system

## 📋 Prerequisites

1. **Docker Desktop** installed
   - macOS: https://docs.docker.com/desktop/install/mac-install/
   - Windows: https://docs.docker.com/desktop/install/windows-install/
   - Linux: https://docs.docker.com/engine/install/

2. **Docker Compose** (usually included with Docker Desktop)

Verify installation:
```bash
docker --version
docker-compose --version
```

## 🚀 Quick Start (3 Steps)

### Step 1: Create Environment File

```bash
# Copy the Docker environment template
cp .env.docker .env

# Generate a random secret
openssl rand -base64 32
```

Edit `.env` file and update:
- `NEXTAUTH_SECRET` - Use the generated secret above
- `NEXTAUTH_URL` - Your domain (or keep localhost for development)
- `MYSQL_PASSWORD` - Change to a secure password

### Step 2: Build and Start

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Step 3: Access Application

Open your browser: **http://localhost:3000** 🎉

**Default Admin Login:**
- 📧 Email: `admin@flipbook.com`
- 🔑 Password: `admin123`

⚠️ **Important:** Change the password after first login!

See [ADMIN_CREDENTIALS.md](../ADMIN_CREDENTIALS.md) for details.

## 📦 What's Included

The Docker setup includes:

- **Next.js Application** - Your FlipBook app
- **MySQL Database** - Pre-configured and ready
- **PDF Support** - Canvas dependencies installed
- **File Storage** - Persistent uploads volume

## 🔧 Common Commands

### Start Services
```bash
# Start in background
docker-compose up -d

# Start and see logs
docker-compose up
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes database)
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mysql
```

### Rebuild After Changes
```bash
# Rebuild and restart
docker-compose up -d --build

# Force rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Database Commands
```bash
# Access MySQL shell
docker-compose exec mysql mysql -u flipbook_user -p flipbook

# Run Prisma commands
docker-compose exec app npx prisma studio
docker-compose exec app npx prisma db push
```

### Application Shell
```bash
# Access app container
docker-compose exec app sh

# Check environment
docker-compose exec app env
```

## 📊 Docker Services

### Service: `mysql`
- **Image:** MySQL 8.0
- **Port:** 3306 (host) → 3306 (container)
- **Data:** Stored in `mysql_data` volume
- **Health Check:** Automatic

### Service: `app`
- **Port:** 3000 (host) → 3000 (container)
- **Dependencies:** MySQL (waits for healthy)
- **Volumes:** `./public/uploads` (persistent)

## 🎨 Customize Configuration

### Change Ports

Edit `docker-compose.yml` or `.env`:

```env
# Use different ports
APP_PORT=8080
MYSQL_PORT=3307
```

Then restart:
```bash
docker-compose up -d
```

### Use External MySQL

If you have existing MySQL:

1. Comment out `mysql` service in `docker-compose.yml`
2. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL="mysql://user:pass@host.docker.internal:3306/flipbook"
```

### Production Settings

For production, update `.env`:

```env
NODE_ENV=production
NEXTAUTH_URL="https://yourdomain.com"
# Use strong passwords
MYSQL_PASSWORD="very-secure-password"
NEXTAUTH_SECRET="very-long-random-secret"
```

## 📁 Directory Structure

```
flip-book/
├── Dockerfile              # App container config
├── docker-compose.yml      # Multi-container config
├── .dockerignore          # Files to exclude
├── .env                   # Environment variables
└── public/uploads/        # Mounted volume (persistent)
```

## 🔄 Development Workflow

### 1. Local Development
```bash
# Run without Docker (as before)
npm run dev
```

### 2. Test with Docker
```bash
# Build and test
docker-compose up --build
```

### 3. Make Changes
```bash
# After code changes
docker-compose restart app

# After dependency changes
docker-compose up -d --build
```

## 🚀 Deploy to Production

### Using Docker Compose

```bash
# On your server
git clone <your-repo>
cd flip-book

# Setup environment
cp .env.docker .env
# Edit .env with production values

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

### Using Docker Only

```bash
# Build image
docker build -t flipbook:latest .

# Run with external MySQL
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="mysql://user:pass@mysql-host:3306/flipbook" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  -v $(pwd)/public/uploads:/app/public/uploads \
  flipbook:latest
```

### Deploy to Cloud

**Railway:**
```bash
railway up
```

**Render:**
- Connect GitHub repository
- Set environment variables
- Deploy

**AWS ECS / GCP Cloud Run / Azure Container Apps:**
- Push image to container registry
- Deploy from registry

## 🐛 Troubleshooting

### Issue: Port already in use

**Solution:**
```bash
# Change ports in .env
APP_PORT=3001
MYSQL_PORT=3307

# Or stop conflicting services
lsof -ti:3000 | xargs kill
```

### Issue: Database connection failed

**Solution:**
```bash
# Check MySQL is healthy
docker-compose ps

# Wait for MySQL to be ready
docker-compose logs mysql

# Restart if needed
docker-compose restart mysql app
```

### Issue: Permission denied on uploads

**Solution:**
```bash
# Fix permissions
chmod -R 777 public/uploads

# Or create if missing
mkdir -p public/uploads
```

### Issue: Out of disk space

**Solution:**
```bash
# Clean old containers
docker system prune -a

# Remove unused volumes
docker volume prune
```

### Issue: Changes not reflected

**Solution:**
```bash
# Force rebuild
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Monitor Resources

```bash
# View resource usage
docker stats

# View disk usage
docker system df

# Clean up
docker system prune -a --volumes
```

## 🔒 Security Best Practices

### For Production:

1. **Use strong passwords:**
```env
MYSQL_PASSWORD="$(openssl rand -base64 32)"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
```

2. **Don't expose MySQL port:**
```yaml
# Remove from docker-compose.yml
# ports:
#   - "3306:3306"
```

3. **Use secrets management:**
- AWS Secrets Manager
- HashiCorp Vault
- Docker Secrets

4. **Update regularly:**
```bash
docker-compose pull
docker-compose up -d
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Example](https://github.com/vercel/next.js/tree/canary/examples/with-docker)

## ✅ Quick Reference

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build

# Logs
docker-compose logs -f

# Shell access
docker-compose exec app sh

# Database shell
docker-compose exec mysql mysql -u root -p

# Clean everything
docker-compose down -v
docker system prune -a
```

## 🎉 Benefits of Docker Setup

✅ **No canvas installation issues**
✅ **MySQL included and configured**
✅ **PDF processing works out of the box**
✅ **Easy to deploy anywhere**
✅ **Consistent across all environments**
✅ **Scales easily**

---

**Just run `docker-compose up -d` and you're ready to go!** 🚀

