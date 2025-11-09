# 🔐 Admin Credentials

## Default Admin Account

The application creates **one admin account** automatically on first setup.

### Default Credentials:

```
Email: admin@flipbook.com
Password: admin123
```

⚠️ **IMPORTANT:** Change this password immediately after first login!

---

## 📝 Setup Instructions

### Option 1: Automatic (Recommended)

The admin account is created automatically when you run:

```bash
# For local development
npm run setup

# Or manually
npx prisma db push
npm run db:seed
```

### Option 2: Docker (Even Easier)

```bash
docker-compose up -d
```

The admin account is created automatically on first start!

---

## 🔧 Custom Admin Credentials

### Set Custom Credentials (Before Setup)

Create `.env` file with custom admin credentials:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/flipbook"

# Auth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Custom Admin Account
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="YourSecurePassword123"
ADMIN_NAME="Your Name"
```

Then run setup:
```bash
npm run setup
```

---

## 🔄 Reset Admin Password

### Method 1: Through Application (Coming Soon)
Future feature: Password reset via email

### Method 2: Direct Database Update

```bash
# Generate new password hash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('NewPassword123', 10));"

# Copy the hash, then update database
npx prisma studio
# Find user, paste new password hash in 'password' field
```

### Method 3: Reseed Database

```bash
# This will recreate the default admin
npm run db:seed
```

---

## 👥 Single Admin System

This application is designed for **single admin use**. Features:

✅ One admin account manages everything
✅ No user registration page for public
✅ Simple and secure
✅ Perfect for restaurant/business use

### For Multiple Admins (Optional)

If you need multiple admin accounts later:

1. Go to `/auth/signup` (currently hidden)
2. Create additional accounts
3. All accounts have full admin access

---

## 🔒 Security Best Practices

### For Production:

1. **Change default password immediately:**
   ```
   Old: admin123
   New: Strong-Password-With-Symbols-123!@#
   ```

2. **Use custom admin email:**
   ```env
   ADMIN_EMAIL="your-company@domain.com"
   ```

3. **Secure NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Disable signup page:**
   - Remove link from homepage
   - Or add middleware to block `/auth/signup`

---

## 📋 Login URLs

| Page | URL | Purpose |
|------|-----|---------|
| **Admin Login** | http://localhost:3000/auth/signin | Main login page |
| Admin Dashboard | http://localhost:3000/dashboard | After login |
| Sign Up (Hidden) | http://localhost:3000/auth/signup | For additional admins only |

---

## 🎯 Quick Reference

```bash
# Create admin account
npm run db:seed

# Check if admin exists
npx prisma studio
# Look for user with email: admin@flipbook.com

# Start application
npm run dev  # or docker-compose up -d

# Login at
# http://localhost:3000/auth/signin
```

---

## 🐛 Troubleshooting

### Issue: "Admin account already exists"

**Solution:** Admin is already created. Use existing credentials or reseed:
```bash
npm run db:reset
npm run db:seed
```

### Issue: "Can't login with admin credentials"

**Solution:**
1. Verify database has user:
   ```bash
   npx prisma studio
   ```

2. Reseed if needed:
   ```bash
   npm run db:seed
   ```

3. Check for typos in email/password

### Issue: "Want to change admin email"

**Solution:**
1. Set in `.env`:
   ```env
   ADMIN_EMAIL="newemail@example.com"
   ```

2. Reseed:
   ```bash
   npm run db:reset
   npm run db:seed
   ```

---

## 📊 Database Structure

The admin user is stored in the `User` table:

```
User
├── id: "unique-id"
├── email: "admin@flipbook.com"
├── password: "hashed-password"
├── name: "Admin"
└── createdAt: timestamp
```

---

## ✨ Summary

**Default Login:**
- 📧 Email: `admin@flipbook.com`
- 🔑 Password: `admin123`
- 🌐 URL: http://localhost:3000/auth/signin

**Change password after first login!** 🔐

---

**Quick Start:**
```bash
docker-compose up -d
# or
npm run setup

# Then login at:
open http://localhost:3000/auth/signin
```

Default credentials work immediately! 🎉

