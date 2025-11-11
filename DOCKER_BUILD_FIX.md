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

### 4. ✅ Prisma OpenSSL Compatibility
**Error:** `Prisma failed to detect the libssl/openssl version`

**Fix:** Added OpenSSL 3.x support for Alpine Linux
- Installed `openssl3` in all Docker stages
- Added `binaryTargets` to Prisma schema for Alpine + OpenSSL 3.x
- Ensures Prisma engine works correctly in Alpine container

**Files Changed:**
- ✅ `Dockerfile` (added openssl3 to all stages)
- ✅ `prisma/schema.prisma` (added binaryTargets)

### 5. ✅ Simplified Seed Script
**Error:** `Cannot find package 'get-tsconfig'` and multiple tsx dependencies missing

**Fix:** Converted seed script from TypeScript to JavaScript
- Changed `prisma/seed.ts` to `prisma/seed.js`
- No longer need tsx, esbuild, get-tsconfig, or other build tools in production
- Simpler and more reliable - just runs with Node.js
- Updated package.json scripts to use `node prisma/seed.js`

**Files Changed:**
- ✅ `prisma/seed.js` (new - converted from TypeScript)
- ✅ `package.json` (removed tsx/esbuild, updated seed script)
- ✅ `Dockerfile` (removed tsx/esbuild copies, added bcryptjs)

---

**Status:** Ready to build! 🐳🚀

