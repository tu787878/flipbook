# FlipBook - Interactive Menu Plugin

A powerful Next.js application that allows you to create and embed interactive 3D flipbook menus for your website. Perfect for restaurants, catalogs, brochures, and more.

## Features

✨ **Key Features:**

- 🏪 **Multi-Shop Management** - Create multiple shops, each with their own menus
- 📖 **3D Page Flip Effect** - Realistic page-turning animations
- 📄 **PDF & Image Support** - Upload PDFs or PNG/JPG images
- 🎨 **Customizable Settings** - Control colors, behavior, and appearance
- 📱 **Responsive Design** - Works perfectly on all devices
- 🔗 **Easy Embedding** - Copy and paste embed code for any website
- 🔒 **User Authentication** - Secure user accounts with NextAuth
- ⚡ **Fast Performance** - Optimized for speed and SEO

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MySQL with Prisma ORM
- **Authentication:** NextAuth.js (Admin only)
- **Flipbook:** StPageFlip library
- **File Processing:** Sharp, PDF.js (optional)
- **Styling:** Tailwind CSS
- **Deployment:** Docker + Docker Compose

## Getting Started

### Prerequisites

- **Docker & Docker Compose** (Recommended)
- OR Node.js 18+ and MySQL 8.0+

### Quick Deploy with Docker (Recommended)

**One command to deploy everything:**

```bash
chmod +x deploy.sh
./deploy.sh
```

Access at: **http://localhost:3002**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

### Manual Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd flip-book
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/flipbook"

# Auth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3002"

# Admin Account
ADMIN_EMAIL="admin@flipbook.com"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Admin"
```

4. **Set up the database:**

```bash
npx prisma generate
npx prisma db push
npx prisma db seed  # Creates default admin account
```

**Default Admin Login:**
- Email: `admin@flipbook.com`
- Password: `admin123`
- ⚠️ Change password after first login!

See [ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md) for details.

5. **Run the development server:**

```bash
npm run dev
```

6. **Open your browser:**

Navigate to [http://localhost:3002](http://localhost:3002)

## Usage

### Creating Your First Flipbook

1. **Sign In as Admin**
   - Login at `/auth/signin` with default credentials

2. **Create a Shop**
   - Go to Dashboard → My Shops
   - Click "New Shop" and enter shop details

3. **Create a Menu**
   - Open your shop
   - Click "New Menu"
   - Upload a PDF or images
   - Enter menu details

4. **Get Embed Code**
   - Click the code icon on your menu
   - Copy the embed code
   - Paste it into your website

### Embedding on Your Website

Simply copy and paste the embed code into your HTML:

```html
<iframe 
  src="http://localhost:3002/embed/your-shop-slug/your-menu-slug" 
  width="100%" 
  height="600px" 
  frameborder="0" 
  allowfullscreen>
</iframe>
```

### Customization Options

You can customize the iframe attributes:

- **width**: Set custom width (e.g., "800px", "100%")
- **height**: Set custom height (e.g., "600px", "800px")

## Project Structure

```
flip-book/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   ├── shops/        # Shop management
│   │   ├── menus/        # Menu management
│   │   └── upload/       # File upload
│   ├── auth/             # Auth pages (signin, signup)
│   ├── dashboard/        # Dashboard pages
│   ├── embed/            # Public embed pages
│   └── page.tsx          # Landing page
├── components/
│   ├── FlipBook/         # FlipBook viewer components
│   └── FileUpload.tsx    # File upload component
├── lib/
│   ├── prisma.ts         # Prisma client
│   ├── utils.ts          # Utility functions
│   ├── upload.ts         # Upload handling
│   └── pdf-processor.ts  # PDF processing
├── prisma/
│   └── schema.prisma     # Database schema
└── public/
    └── uploads/          # Uploaded files
```

## Database Schema

The application uses 4 main models:

- **User** - User accounts
- **Shop** - Business shops
- **Menu** - Menu collections
- **Page** - Individual menu pages

## API Endpoints

### Public Endpoints

- `GET /api/public/menu/[shopSlug]/[menuSlug]` - Get published menu data

### Protected Endpoints (Require Authentication)

- `GET /api/shops` - List user's shops
- `POST /api/shops` - Create new shop
- `GET /api/shops/[shopId]` - Get shop details
- `PUT /api/shops/[shopId]` - Update shop
- `DELETE /api/shops/[shopId]` - Delete shop
- `POST /api/menus` - Create new menu
- `GET /api/menus/[menuId]` - Get menu details
- `PUT /api/menus/[menuId]` - Update menu
- `DELETE /api/menus/[menuId]` - Delete menu
- `POST /api/upload` - Upload files

## Development

### Using Docker (Recommended)

**Deploy with one command:**

```bash
./deploy.sh
```

**Manual Docker commands:**

```bash
# Copy environment file
cp .env.docker .env

# Start all services (app + MySQL)
docker-compose up -d

# View logs
docker-compose logs -f
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

### Running in Development Mode

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Features in Detail

### FlipBook Viewer (StPageFlip)

The FlipBook component provides:

- **Realistic 3D page flip** with page curl effect
- **2-page spread view** (desktop & mobile)
- **Mobile optimized** with zoom (1.8x on mobile)
- **Swipe gestures** for touch devices
- **Keyboard navigation** (Arrow keys, F for fullscreen)
- **Page thumbnails** (desktop only)
- **Corner dragging** to turn pages
- **Smooth 800ms animations**
- **Fullscreen mode**

### File Upload

Supports:

- PDF files (automatically converted to images)
- PNG/JPG images
- Drag and drop interface
- Progress tracking
- Automatic thumbnail generation

### Shop Management

- Create multiple shops
- Manage shop details
- Track menu count per shop
- Delete shops (cascades to menus)

### Menu Management

- Create menus from PDF or images
- Edit menu details
- Publish/unpublish menus
- Preview before embedding
- Generate embed codes

## Security

- **Admin-only access** (no public signup)
- **Environment-configured admin** account
- **Password hashing** with bcrypt
- **Protected API routes**
- **JWT session management**
- **Docker-based isolation**

## Performance

- Image optimization with Sharp
- Lazy loading of pages
- Efficient caching
- Optimized bundle size
- SSR for embed pages

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for commercial purposes.

## Support

For issues and questions, please open an issue in the repository.

## Roadmap

Future enhancements:

- [ ] Video page support
- [ ] Audio page support
- [ ] Interactive hotspots
- [ ] Analytics dashboard
- [ ] Multiple flip effects
- [ ] Custom branding options
- [ ] API access for developers
- [ ] Bulk upload support
- [ ] Template library

## Credits

Built with ❤️ using Next.js, inspired by [FlippingBook](https://flippingbook.com/) and [Heyzine](https://heyzine.com).

---

**Made with Next.js 14 | © 2025 FlipBook**

