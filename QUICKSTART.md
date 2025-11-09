# 🚀 Quick Start Guide

Get your FlipBook application running in **5 minutes**!

## One-Command Setup

If you have PostgreSQL running, you can set up everything with one command:

```bash
npm run setup
```

This will:
1. ✅ Install all dependencies
2. ✅ Generate Prisma client
3. ✅ Create database tables
4. ✅ Create upload directory

## Manual Step-by-Step Setup

### 1️⃣ Install Dependencies (2 min)

```bash
npm install
```

### 2️⃣ Configure Database (1 min)

Create `.env` file:

```env
DATABASE_URL="mysql://user:password@localhost:3306/flipbook"
NEXTAUTH_SECRET="your-secret-key-at-least-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate secret key:**
```bash
openssl rand -base64 32
```

### 3️⃣ Setup Database (1 min)

```bash
npm run db:generate
npm run db:push
```

### 4️⃣ Start Development Server (1 min)

```bash
npm run dev
```

**🎉 Done!** Open [http://localhost:3000](http://localhost:3000)

---

## Your First Flipbook

### Step 1: Create Account
- Go to: http://localhost:3000/auth/signup
- Enter email and password
- Click "Sign Up"

### Step 2: Create Shop
- Go to: http://localhost:3000/dashboard/shops/new
- Enter shop name: "My Restaurant"
- Click "Create Shop"

### Step 3: Create Menu
- Click "New Menu"
- Enter menu name: "Dinner Menu"
- Drag & drop a PDF or images
- Click "Create Menu"

### Step 4: Get Embed Code
- Click the `<>` icon on your menu
- Copy the embed code
- Paste into your website

### Step 5: Preview
- Click "Preview" to see your flipbook in action!

---

## Helpful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:studio        # Open Prisma Studio (database GUI)
npm run db:push          # Update database schema
npm run db:generate      # Generate Prisma client
npm run db:reset         # Reset database (⚠️ deletes data)

# Setup
npm run setup            # Complete setup in one command
```

---

## Project Structure

```
flip-book/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Admin dashboard
│   ├── embed/             # Public embed pages
│   └── page.tsx           # Landing page
├── components/
│   ├── FlipBook/          # FlipBook viewer
│   └── FileUpload.tsx     # Upload component
├── lib/                   # Utilities
├── prisma/                # Database schema
└── public/uploads/        # Uploaded files
```

---

## Key Features

✨ **For Users:**
- 🏪 Multiple shops per account
- 📖 Unlimited menus per shop
- 📄 PDF or image uploads
- 🎨 3D flip animations
- 📱 Mobile responsive
- 🔗 Easy embedding

✨ **For Developers:**
- ⚡ Next.js 14 (App Router)
- 🔒 NextAuth authentication
- 🗄️ PostgreSQL + Prisma
- 🎭 TypeScript
- 🎨 Tailwind CSS
- 📦 All-in-one solution

---

## Troubleshooting

### Can't connect to database?
```bash
# Check MySQL is running:
mysql -u root -p -e "SELECT VERSION();"

# Create database if it doesn't exist:
mysql -u root -p -e "CREATE DATABASE flipbook;"

# Update DATABASE_URL in .env file
```

### Module not found errors?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Prisma errors?
```bash
npx prisma generate
npx prisma db push
```

### Upload not working?
```bash
mkdir -p public/uploads
```

---

## What's Next?

📚 **Read Full Documentation:** See [README.md](./README.md)

🔧 **Detailed Setup:** See [SETUP.md](./SETUP.md)

🎨 **Customize:**
- Edit `app/page.tsx` for landing page
- Edit `tailwind.config.ts` for colors
- Edit `components/FlipBook/` for viewer

🚀 **Deploy:**
- Vercel (recommended)
- Railway
- AWS/DigitalOcean

---

## Need Help?

1. Check error messages in terminal
2. Check browser console (F12)
3. Read SETUP.md for detailed guide
4. Read README.md for full documentation

---

## Demo

**Live Preview:** http://localhost:3000

**Admin Dashboard:** http://localhost:3000/dashboard

**Example Embed:** http://localhost:3000/embed/your-shop/your-menu

---

**Happy Building! 🎉**

