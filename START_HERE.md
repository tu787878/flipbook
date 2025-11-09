# 🚀 START HERE - FlipBook Project

Welcome to **FlipBook** - Your complete interactive 3D menu plugin system!

## 📦 What You Got

A **production-ready Next.js application** that allows you to:

1. ✅ Create multiple shops for different businesses
2. ✅ Upload PDFs or images to create digital menus
3. ✅ Generate beautiful 3D flipbook effects
4. ✅ Get embed codes to use on any website
5. ✅ Manage everything through an admin dashboard

**Similar to:** [FlippingBook.com](https://flippingbook.com/) and [Heyzine.com](https://heyzine.com/)

---

## ⚡ Quick Deploy (1 Command!)

### 🐳 Docker Deployment (Recommended)

```bash
# Make deploy script executable
chmod +x deploy.sh

# Deploy everything (app + MySQL)
./deploy.sh

# Access your app
open http://localhost:3002
```

**🎉 Done!** Everything is ready including:
- ✅ MySQL database
- ✅ Admin account created
- ✅ All dependencies installed
- ✅ PDF support (canvas) included
- ✅ Port 3002 configured

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

---

### 💻 Option 2: Local Development

### 1️⃣ Install Dependencies
```bash
npm install --omit=optional  # Skip canvas for now
```

### 2️⃣ Create `.env` File
Create a file named `.env` in the root folder:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/flipbook"

# Auth
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3002"

# Admin Account
ADMIN_EMAIL="admin@flipbook.com"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Admin"
```

**Need a secret?** Run: `openssl rand -base64 32`

### 3️⃣ Setup Database
```bash
npm run db:generate
npm run db:push
```

### 4️⃣ Start the App
```bash
npm run dev
```

**🎉 Done!** Open http://localhost:3002

> **Note:** Without canvas, use images instead of PDFs. See [INSTALL_TROUBLESHOOTING.md](./INSTALL_TROUBLESHOOTING.md)

---

## 📖 Complete Documentation

| Document | Purpose |
|----------|---------|
| **📘 [README.md](./README.md)** | Full documentation, features, and usage |
| **⚙️ [SETUP.md](./SETUP.md)** | Detailed setup instructions |
| **⚡ [QUICKSTART.md](./QUICKSTART.md)** | Get running in 5 minutes |
| **🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md)** | System architecture diagrams |
| **📊 [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** | Complete project overview |

---

## 🎯 What's Included

### ✅ Core Features
- **Admin-Only Access** - Single admin account (environment-configured)
- **Multi-Shop Support** - Create unlimited shops
- **Menu Management** - Upload multiple images or PDFs
- **StPageFlip Viewer** - Professional 3D page curl animations
- **Embed System** - Copy/paste code for any website
- **Admin Dashboard** - Manage everything in one place
- **Mobile Optimized** - 2-page spread with zoom on mobile
- **Docker Ready** - One-command deployment

### 🛠️ Technical Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MySQL with Prisma
- **Auth:** NextAuth.js (Admin only)
- **Flipbook:** StPageFlip library
- **Styling:** Tailwind CSS
- **Deployment:** Docker + Docker Compose

---

## 🎬 How to Use

### Step 1: Login with Admin Account

**Default credentials:**
```
Email: admin@flipbook.com
Password: admin123
```

**Login at:** http://localhost:3002/auth/signin

⚠️ **Change the password after first login!**

See [ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md) for more details.

### Step 2: Create a Shop
```
Dashboard → My Shops → New Shop
```
- Enter shop name (e.g., "My Restaurant")
- Add description (optional)
- Click "Create Shop"

### Step 3: Create a Menu
```
Open Shop → New Menu
```
- Enter menu name (e.g., "Dinner Menu")
- Drag & drop a PDF or images
- Click "Create Menu"

### Step 4: Get Embed Code
```
Click </> icon on your menu
```
- Copy the iframe code
- Paste it on your website

### Step 5: Preview
```
Click "Preview" button
```
- See your flipbook in action!
- Test page flipping
- Try zoom and fullscreen

---

## 📂 Project Structure

```
flip-book/
├── app/                    # Next.js pages
│   ├── api/               # Backend API routes
│   ├── auth/              # Login/signup pages
│   ├── dashboard/         # Admin panel
│   └── embed/             # Public flipbook pages
├── components/            # React components
│   ├── FlipBook/          # Flipbook viewer
│   └── FileUpload.tsx     # Upload interface
├── lib/                   # Utilities
│   ├── prisma.ts          # Database client
│   ├── upload.ts          # File handling
│   └── pdf-processor.ts   # PDF conversion
├── prisma/                # Database schema
└── public/uploads/        # Uploaded files
```

---

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:studio        # Open database GUI
npm run db:push          # Update database
npm run db:generate      # Generate Prisma client

# All-in-one
npm run setup            # Complete setup
```

---

## 🌐 URLs to Know

| URL | Description |
|-----|-------------|
| `http://localhost:3002` | Landing page |
| `http://localhost:3002/auth/signin` | Admin login |
| `http://localhost:3002/dashboard` | Dashboard |
| `http://localhost:3002/dashboard/shops` | Manage shops |
| `http://localhost:3002/embed/[shop]/[menu]` | Public flipbook |

---

## 🎨 Customization

### Change Colors
Edit `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    }
  }
}
```

### Change Landing Page
Edit `app/page.tsx` - Modify hero text, features, etc.

### Modify Flipbook Viewer
Edit `components/FlipBook/FlipBook.tsx` - Change animations, controls, etc.

---

## 🚀 Deploy to Production

### Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms
- Railway (includes PostgreSQL)
- AWS/DigitalOcean
- Any Node.js hosting

**See [SETUP.md](./SETUP.md) for deployment details**

---

## 🐛 Troubleshooting

### Can't connect to database?
- Check MySQL is running: `mysql -u root -p`
- Create database: `CREATE DATABASE flipbook;`
- Verify DATABASE_URL in `.env`
- Run: `npm run db:push`

### Module errors?
```bash
rm -rf node_modules
npm install
```

### Upload not working?
```bash
mkdir -p public/uploads
```

### More help?
Check [SETUP.md](./SETUP.md) for detailed troubleshooting

---

## 📚 Learn More

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

### Database
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Guide](https://www.postgresql.org/docs/)

### Authentication
- [NextAuth.js](https://next-auth.js.org)

---

## ✨ Features Showcase

### Admin Features
- ✅ Single admin account (environment-configured)
- ✅ No signup page (admin only)
- ✅ Create/manage multiple shops
- ✅ Upload multiple images at once
- ✅ Optional PDF to image conversion
- ✅ Generate thumbnails automatically
- ✅ Copy embed codes easily
- ✅ Publish/unpublish menus

### Flipbook Viewer Features (StPageFlip)
- ✅ Realistic 3D page curl animation
- ✅ 2-page spread view (desktop & mobile)
- ✅ Mobile zoom (1.8x) for readability
- ✅ Swipe gestures on touch devices
- ✅ Keyboard navigation (arrow keys)
- ✅ Corner dragging to flip pages
- ✅ Page thumbnails (desktop only)
- ✅ Fullscreen mode
- ✅ Smooth 800ms animations
- ✅ Professional quality

### Technical Features
- ✅ Server-side rendering (SSR)
- ✅ Type-safe with TypeScript
- ✅ Database migrations with Prisma
- ✅ Secure authentication
- ✅ File upload validation
- ✅ Image optimization
- ✅ SEO friendly

---

## 🎯 Use Cases

Perfect for:
- 🍽️ **Restaurants** - Digital menus
- 📚 **Publishers** - Magazine previews
- 🏢 **Business** - Product catalogs
- 🎓 **Education** - Course materials
- 🏨 **Hotels** - Service brochures
- 🎨 **Designers** - Portfolio showcases

---

## 💡 Tips & Best Practices

### For Best Performance
1. Optimize PDFs before upload (< 10MB)
2. Use high-quality images (300 DPI)
3. Keep menus under 50 pages
4. Test on mobile devices

### For Best User Experience
1. Use clear menu names
2. Add descriptions to menus
3. Test embed on your site
4. Enable fullscreen option

### For Security
1. Use strong passwords
2. Keep dependencies updated
3. Use HTTPS in production
4. Backup database regularly

---

## 🔮 What's Next?

### Potential Enhancements
- [ ] Analytics dashboard
- [ ] Video page support
- [ ] Interactive hotspots
- [ ] Custom branding
- [ ] Multiple flip effects
- [ ] API access
- [ ] White-label option

**Want to add features?** The code is well-structured and easy to extend!

---

## 📞 Need Help?

1. **Read the docs** - Check README.md and SETUP.md
2. **Check examples** - Test the demo features
3. **Review code** - Comments explain functionality
4. **Debug** - Check terminal and browser console

---

## ✅ Checklist

Before deploying to production:

- [ ] Environment variables set
- [ ] Database connected
- [ ] All features tested
- [ ] Mobile responsive checked
- [ ] SSL certificate configured
- [ ] Backup system in place
- [ ] Domain configured
- [ ] Analytics added (optional)

---

## 🎉 You're Ready!

Everything is set up and ready to go. The application includes:

✅ Complete authentication system
✅ Full admin dashboard  
✅ PDF/image processing
✅ 3D flipbook viewer
✅ Embed code generation
✅ Public API endpoints
✅ Mobile responsive design
✅ Production ready

**Just run `npm run dev` and start creating!**

---

## 📄 License

MIT License - Free to use for commercial projects

---

**Built with ❤️ using Next.js 14**

**Inspired by:** [FlippingBook](https://flippingbook.com/) and [Heyzine](https://heyzine.com/)

---

**Happy Building! 🚀**

