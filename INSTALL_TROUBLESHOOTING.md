# Installation Troubleshooting Guide

## 🔧 Quick Fix - Install Without PDF Support

The easiest way to get started is to **skip PDF processing** and only use images (PNG/JPG). Run these commands in your terminal:

### Option 1: Simple Installation (Images Only)

```bash
cd /Users/vantu/Documents/Job/TCG/flip-book

# Install without optional dependencies (skip canvas/PDF)
npm install --omit=optional

# Generate Prisma client
npx prisma generate
```

✅ **This will work immediately!** You can upload PNG/JPG images for your menus.

---

## 📄 Enable PDF Support Later (Optional)

If you want PDF support later, follow these steps:

### Step 1: Fix Homebrew Permissions (if needed)
```bash
# Fix Homebrew permissions
sudo chown -R $(whoami) /opt/homebrew/Cellar
sudo chown -R $(whoami) /opt/homebrew/lib
```

### Step 2: Install System Dependencies
```bash
# Install required libraries for canvas
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Step 3: Install Canvas Package
```bash
# Now install canvas separately
npm install canvas pdfjs-dist --save-optional
```

---

## 🐛 Common Errors & Solutions

### Error: "Package 'pangocairo' not found"

**Solution:** Install system dependencies first:
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### Error: "EPERM: operation not permitted"

**Solution:** Fix npm permissions:
```bash
# Option 1: Fix ownership
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /opt/homebrew

# Option 2: Or use different npm prefix
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### Error: "Canvas prebuilt binary not found"

**Solution:** Build from source:
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Then reinstall canvas
npm install canvas --build-from-source
```

### Error: "node-gyp errors"

**Solution:** Install build tools:
```bash
# Install Xcode Command Line Tools
xcode-select --install

# Verify Python is installed
python3 --version
```

---

## ✅ Verify Installation

After installation, check what's working:

```bash
# Check if canvas is installed
npm list canvas

# If canvas installed:
# ✅ PDF support: YES
# ✅ Image support: YES

# If canvas NOT installed:
# ⚠️  PDF support: NO (will show error message)
# ✅ Image support: YES
```

---

## 🎯 Recommended Workflow

### For Development (Quick Start):

1. **Install without PDF support:**
   ```bash
   npm install --omit=optional
   ```

2. **Use images instead of PDFs:**
   - Export your PDF pages as PNG/JPG
   - Upload them directly

3. **Add PDF support later if needed** (follow steps above)

### For Production:

If you need PDF support in production:
- Use a service like [Cloudinary](https://cloudinary.com/) or [imgproxy](https://imgproxy.net/) for PDF conversion
- Or deploy to a platform that supports canvas (Vercel, Railway, etc.)

---

## 📦 What Works Without Canvas

Even without the canvas package, you still get:

✅ **Full functionality:**
- User authentication
- Shop management  
- Menu creation
- **Image uploads (PNG/JPG)**
- 3D flipbook viewer
- Embed code generation
- All admin features

❌ **Only missing:**
- PDF file upload (use images instead)

---

## 🚀 Start Development

Once packages are installed:

```bash
# 1. Create .env file
cat > .env << EOF
DATABASE_URL="mysql://root:password@localhost:3306/flipbook"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
EOF

# 2. Setup database
npx prisma db push

# 3. Start development
npm run dev
```

Then open: http://localhost:3000

---

## 💡 Tips

### Convert PDF to Images (if needed):

**Online Tools:**
- https://www.ilovepdf.com/pdf_to_jpg
- https://smallpdf.com/pdf-to-jpg
- https://convertio.co/pdf-jpg/

**Command Line (if you have ImageMagick):**
```bash
# Install ImageMagick
brew install imagemagick

# Convert PDF to images
convert -density 300 menu.pdf menu-%03d.jpg
```

### Use Cloud Services:

For production, consider using:
- **Cloudinary** - Handles PDF conversion automatically
- **imgproxy** - Fast image processing service
- **AWS Lambda** - Serverless PDF processing

---

## 🔍 Debug Commands

```bash
# Check Node.js version
node --version
# Should be 18+

# Check npm version  
npm --version

# Check Python (needed for node-gyp)
python3 --version

# Check if pkg-config is installed
pkg-config --version

# Check if cairo is installed
pkg-config --modversion cairo

# List installed packages
npm list --depth=0

# Clear npm cache
npm cache clean --force
```

---

## 📚 Additional Resources

- [Canvas Installation Guide](https://github.com/Automattic/node-canvas#compiling)
- [Node.js Permissions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)
- [Homebrew Troubleshooting](https://docs.brew.sh/Troubleshooting)

---

## ✨ Summary

**Quick Start:** Use `npm install --omit=optional` to skip PDF support and get started immediately with image uploads!

**Later:** Enable PDF support when you need it by installing canvas dependencies.

You don't need PDF support to create beautiful flipbook menus! 🎉

