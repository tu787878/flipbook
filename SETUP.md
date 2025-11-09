# FlipBook Setup Guide

Follow these steps to get your FlipBook application up and running.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **MySQL** database (5.7+ or 8.0+) running locally or remotely
- **Git** (optional, for cloning)

## Quick Setup (5 minutes)

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- Prisma (database ORM)
- NextAuth (authentication)
- React Three Fiber (3D effects)
- Framer Motion (animations)
- Sharp (image processing)
- And more...

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Connection
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/flipbook"

# Authentication
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Upload Settings
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=10485760
```

**Important Notes:**

1. **DATABASE_URL**: Replace `USERNAME`, `PASSWORD`, and database details with your MySQL credentials
   
2. **NEXTAUTH_SECRET**: Generate a secure random string:
   ```bash
   openssl rand -base64 32
   ```
   Or use any random string generator

3. **NEXTAUTH_URL**: Use `http://localhost:3000` for development, change to your domain in production

### Step 3: Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push
```

This creates 4 tables:
- `User` - User accounts
- `Shop` - Business shops  
- `Menu` - Menu collections
- `Page` - Individual menu pages

### Step 4: Create Upload Directory

```bash
mkdir -p public/uploads
```

### Step 5: Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

## First Steps After Setup

### 1. Create Your Account

- Navigate to [http://localhost:3000/auth/signup](http://localhost:3000/auth/signup)
- Sign up with your email and password
- You'll be redirected to the dashboard

### 2. Create Your First Shop

- Click "My Shops" in the sidebar
- Click "New Shop"
- Enter shop name and description
- Click "Create Shop"

### 3. Create Your First Menu

- Open your shop
- Click "New Menu"
- Enter menu name
- Upload a PDF or images (drag & drop supported)
- Click "Create Menu"

### 4. Get Embed Code

- Click the code icon (`<>`) on your menu
- Copy the embed code
- Paste it into your website's HTML

## Database Management

### View Database in Prisma Studio

```bash
npx prisma studio
```

This opens a GUI at [http://localhost:5555](http://localhost:5555) to view/edit data.

### Reset Database (⚠️ Deletes all data)

```bash
npx prisma db push --force-reset
```

### Run Migrations (Production)

```bash
npx prisma migrate dev --name init
```

## Production Deployment

### 1. Build for Production

```bash
npm run build
```

### 2. Start Production Server

```bash
npm start
```

### 3. Environment Variables for Production

Update your `.env` or hosting platform environment variables:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
NODE_ENV="production"
```

### 4. Recommended Hosting Platforms

- **Vercel** (easiest for Next.js)
  - Connect your Git repository
  - Add environment variables
  - Deploy with one click
  
- **Railway** (with PostgreSQL included)
  - Supports PostgreSQL out of the box
  - Easy environment variable management
  
- **AWS/DigitalOcean** (traditional hosting)
  - More control but requires server setup

## Common Issues & Solutions

### Issue: "Can't connect to database"

**Solution:** Check your `DATABASE_URL` in `.env` file. Make sure:
- MySQL is running (check with: `mysql -u root -p`)
- Database name exists (create with: `CREATE DATABASE flipbook;`)
- Username/password are correct
- Host/port are correct (default: localhost:3306)

### Issue: "NextAuth configuration error"

**Solution:** Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set in `.env` file.

### Issue: "Upload failed"

**Solution:** 
1. Check that `public/uploads` directory exists and is writable
2. Check file size (max 10MB by default)
3. Ensure file format is PDF, PNG, or JPG

### Issue: "Module not found" errors

**Solution:** 
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue: Prisma errors

**Solution:**
```bash
npx prisma generate
npx prisma db push
```

## Development Tips

### Hot Reload

The development server supports hot reload. Changes to files will automatically refresh the browser.

### API Testing

Use tools like:
- **Postman** or **Insomnia** for API testing
- **Thunder Client** (VS Code extension)

### Database Inspection

```bash
# View database schema
npx prisma studio

# Check migrations
npx prisma migrate status
```

### Debugging

1. Check terminal for errors
2. Check browser console (F12)
3. Check Next.js error overlay
4. Check Prisma logs in terminal

## File Upload Limits

Default limits:
- **Max file size:** 10MB
- **Supported formats:** PDF, PNG, JPG, JPEG
- **Storage location:** `public/uploads/menus/[menuId]/`

To change limits, update `lib/upload.ts`:

```typescript
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
```

## Features Overview

### ✅ Implemented Features

- ✅ User authentication (signup/signin)
- ✅ Multi-shop management
- ✅ Menu creation and management
- ✅ PDF to image conversion
- ✅ Image upload (PNG/JPG)
- ✅ 3D flipbook viewer
- ✅ Page flip animations
- ✅ Zoom controls
- ✅ Fullscreen mode
- ✅ Keyboard navigation
- ✅ Mobile responsive
- ✅ Embed code generation
- ✅ Public embed pages
- ✅ Thumbnail generation

### 🚀 Potential Enhancements

- Video page support
- Audio narration
- Interactive hotspots
- Analytics dashboard
- Custom branding
- Multiple flip effects
- Bulk upload
- Template library

## Support & Resources

- **Documentation:** See README.md
- **Database Schema:** See prisma/schema.prisma
- **API Routes:** See app/api/*
- **Components:** See components/*

## Security Best Practices

1. **Never commit .env file** (already in .gitignore)
2. **Use strong passwords** for database and accounts
3. **Keep dependencies updated**: `npm update`
4. **Use HTTPS in production**
5. **Set strong NEXTAUTH_SECRET** (32+ characters)

## Next Steps

1. ✅ Complete setup steps above
2. 📖 Read the README.md for detailed documentation
3. 🎨 Customize the landing page (app/page.tsx)
4. 🎨 Customize colors in tailwind.config.ts
5. 📱 Test on mobile devices
6. 🚀 Deploy to production

## Getting Help

If you encounter issues:

1. Check this setup guide
2. Check README.md
3. Review error messages carefully
4. Check browser console (F12)
5. Check terminal output
6. Search for similar issues online

Happy building! 🎉

