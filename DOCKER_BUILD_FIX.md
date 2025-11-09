# 🐳 Docker Build Fixes

## Issues Fixed:

### 1. ✅ Missing tsx Command
**Error:** `spawn tsx ENOENT`

**Fix:** Moved `tsx` and `prisma` from devDependencies to dependencies
- `tsx` is needed for the seed script to run
- `prisma` is needed for database migrations in production

**Files Changed:**
- ✅ `package.json` (moved tsx and prisma to dependencies)

### 2. ✅ Permission Denied Errors
**Error:** `EACCES: permission denied, unlink '/app/node_modules/.prisma/client/index.js'`

**Fix:** Updated Dockerfile to properly set permissions
- Copy prisma CLI and related binaries to runner stage
- Set proper ownership for node_modules directory
- Ensure nextjs user has write access

**Files Changed:**
- ✅ `Dockerfile` (added prisma/tsx node_modules, fixed permissions)

### 3. ✅ Environment Variables for Seed
**Fix:** Added admin credentials to docker-compose environment
- ADMIN_EMAIL
- ADMIN_PASSWORD  
- ADMIN_NAME

**Files Changed:**
- ✅ `docker-compose.yml` (added admin env vars)

---

## Why These Changes?

### Next.js Standalone Build
Next.js `output: 'standalone'` creates a minimal build with only required dependencies. This means:
- Not all node_modules are included
- Only runtime dependencies are copied
- Dev tools like prisma CLI and tsx are excluded

### Solution
We need to:
1. Move required tools to production dependencies
2. Manually copy specific node_modules to runner stage
3. Set proper file permissions for the nextjs user

---

## Testing The Fix

```bash
# Clean everything
docker-compose down -v

# Rebuild and deploy
./deploy.sh
```

---

## What Happens Now

1. ✅ Build stage includes tsx and prisma
2. ✅ Runner stage has prisma CLI and tsx available
3. ✅ Docker-compose runs seed with proper permissions
4. ✅ Admin account is created automatically
5. ✅ App starts successfully

---

**Status:** Ready to build! 🐳🚀

