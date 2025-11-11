# 🚨 Quick Troubleshooting - Pages Not Loading

## Issue: All pages showing loading spinners

This means the images didn't upload successfully due to permission errors.

## ✅ Fix Steps:

### Step 1: Rebuild with Volume Fix

```bash
# Stop everything and remove volumes
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

### Step 2: Check Logs

```bash
docker-compose logs -f app
```

Look for any upload errors.

### Step 3: Re-upload Images

1. Go to dashboard: http://localhost:3002/dashboard
2. Open your shop
3. **Delete the broken menu** (if exists)
4. **Create a new menu**
5. Upload images again

### Step 4: Verify Upload Directory

```bash
docker-compose exec app ls -la /app/public/uploads
```

Should show:
- menus/
- shops/

---

## Quick Check Commands:

```bash
# Check if container is running
docker-compose ps

# Check permissions
docker-compose exec app ls -la /app/public/uploads

# Check logs for errors
docker-compose logs app | grep -i error

# Restart app
docker-compose restart app
```

---

## If Still Not Working:

The volume needs to be recreated. Run:

```bash
docker-compose down -v
docker-compose up -d
```

Then re-upload your images.

