# 🎨 StPageFlip Integration

I've integrated the **StPageFlip** library - a professional page-flip library with realistic animations!

## ✅ What's New

### StPageFlip Features:
✅ **Ultra-realistic page curl** - Industry-leading quality
✅ **Hardware accelerated** - Smooth 60fps
✅ **Canvas-based rendering** - Better performance
✅ **Touch gestures** - Swipe to flip on mobile
✅ **Auto-sizing** - Adapts to container
✅ **Page corners** - Interactive corner peeling
✅ **Natural shadows** - Dynamic shadow rendering

---

## 🚀 Installation

```bash
# Install the package
npm install page-flip

# Or with Docker
docker-compose up -d --build
```

---

## 📁 Files Created/Updated

### New Files:
✅ **`components/FlipBook/FlipBookStPage.tsx`** - New StPageFlip component
✅ **`STPAGEFLIP_INFO.md`** - This guide

### Updated Files:
✅ **`package.json`** - Added `page-flip` dependency
✅ **`app/globals.css`** - Added StPageFlip styles
✅ **`app/embed/[shopSlug]/[menuSlug]/page.tsx`** - Now uses StPageFlip
✅ **`components/FlipBook/index.ts`** - Exported new component

---

## ⚙️ Configuration

The StPageFlip is configured with optimal settings:

```javascript
{
  width: 550,              // Page width
  height: 733,             // Page height  
  size: 'stretch',         // Auto-fit container
  maxShadowOpacity: 0.3,   // Subtle shadows
  flippingTime: 800,       // Realistic speed (800ms)
  showPageCorners: true,   // Interactive corners
  drawShadow: true,        // Enable shadows
  useMouseEvents: true,    // Click to flip
  autoSize: true,          // Responsive
}
```

---

## 🎬 StPageFlip Animation Features

### What Makes It Special:

1. **Real Page Curl**
   - Pages actually curl like paper
   - Gradual corner peeling
   - Physics-based motion

2. **Interactive Corners**
   - Hover on corners to see preview
   - Drag corners to flip
   - Visual feedback

3. **Dynamic Shadows**
   - Shadows follow page position
   - Realistic lighting
   - Depth perception

4. **Smooth Motion**
   - Hardware accelerated
   - No frame drops
   - Buttery smooth

---

## 🎮 User Interactions

### Mouse/Click:
- **Click left edge** - Previous page
- **Click right edge** - Next page
- **Drag corner** - Manual flip control
- **Hover corner** - Page curl preview

### Touch (Mobile):
- **Swipe left** - Next page
- **Swipe right** - Previous page
- **Drag corner** - Manual control

### Keyboard:
- **Arrow Left** - Previous page
- **Arrow Right** - Next page
- **F key** - Fullscreen

---

## 🆚 Comparison: Custom vs StPageFlip

| Feature | Your Custom | StPageFlip |
|---------|-------------|------------|
| **Realism** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Page Curl** | Simple 3D | Real curl ✨ |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Corner Drag** | ❌ | ✅ |
| **Physics** | Basic | Advanced ✨ |
| **Shadows** | Static | Dynamic ✨ |
| **File Size** | Small | Medium |
| **Customization** | Full | Limited |

---

## 💡 When to Use Each

### Use StPageFlip When:
✅ You want the **most realistic** flip
✅ You need **corner dragging**
✅ You want **professional quality**
✅ Performance is critical

### Use Custom FlipBookAdvanced When:
✅ You need full **customization**
✅ You want smaller **bundle size**
✅ You prefer **simpler** code
✅ Current quality is good enough

---

## 🔄 Switch Between Versions

You can easily switch between implementations by editing:

**File:** `app/embed/[shopSlug]/[menuSlug]/page.tsx`

```typescript
// Option 1: StPageFlip (Current - Most Realistic)
import FlipBookStPage from '@/components/FlipBook/FlipBookStPage';
<FlipBookStPage pages={...} />

// Option 2: Custom Advanced (Your 3D Implementation)
import FlipBookAdvanced from '@/components/FlipBook/FlipBookAdvanced';
<FlipBookAdvanced pages={...} />

// Option 3: Simple (Basic Framer Motion)
import FlipBook from '@/components/FlipBook/FlipBook';
<FlipBook pages={...} />
```

---

## 🎨 StPageFlip Configuration Options

### Adjust Settings in Component:

```typescript
// components/FlipBook/FlipBookStPage.tsx

new PageFlip(bookRef.current, {
  // Animation
  flippingTime: 800,        // Speed (ms)
  
  // Appearance
  maxShadowOpacity: 0.3,    // Shadow darkness
  showPageCorners: true,     // Corner indicators
  
  // Size
  width: 550,               // Page width
  height: 733,              // Page height
  
  // Interaction
  useMouseEvents: true,     // Click to flip
  swipeDistance: 30,        // Swipe sensitivity
});
```

---

## 📦 What's Included

### StPageFlip Provides:
- ✅ Realistic page curl animation
- ✅ Corner interaction
- ✅ Touch/swipe support
- ✅ Auto-sizing
- ✅ Events system
- ✅ Multiple rendering modes

### Your Integration Adds:
- ✅ Navigation controls
- ✅ Page thumbnails
- ✅ Fullscreen mode
- ✅ Keyboard shortcuts
- ✅ Shop/menu branding
- ✅ Responsive design

---

## 🚀 Next Steps

### 1. Install Package:
```bash
npm install page-flip
```

### 2. Restart Dev Server:
```bash
npm run dev
```

### 3. Test It:
- Go to preview
- See the realistic page curl!
- Try dragging corners
- Test on mobile

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'page-flip'"

**Solution:**
```bash
npm install page-flip
npm run dev
```

### Issue: Pages not showing

**Solution:** Check browser console for errors. Make sure images are loading.

### Issue: Animation too fast/slow

**Solution:** Edit `components/FlipBook/FlipBookStPage.tsx`:
```typescript
flippingTime: 1000,  // Make slower (1 second)
// or
flippingTime: 600,   // Make faster (0.6 seconds)
```

---

## 🎯 StPageFlip Advantages

### Why It's Better:

1. **Real Page Curl**
   - Pages bend and curl realistically
   - Not just rotation - actual curve physics
   - Industry-standard quality

2. **Corner Interaction**
   - Grab and drag page corners
   - Progressive reveal
   - Natural control

3. **Better Performance**
   - Canvas-based (hardware accelerated)
   - Optimized rendering
   - Smooth on all devices

4. **Production Tested**
   - Used by thousands of sites
   - Battle-tested code
   - Regular updates

---

## 📚 Documentation

- **Library Docs:** https://github.com/Nodlik/StPageFlip
- **NPM:** https://www.npmjs.com/package/page-flip
- **Examples:** https://nodlik.github.io/StPageFlip/

---

## ✨ Summary

**You now have professional-grade page flipping with StPageFlip!**

- ✅ Realistic page curl
- ✅ Interactive corners
- ✅ Smooth performance
- ✅ Touch support
- ✅ All your existing features

**Install with:** `npm install page-flip`

**Then test at:** http://localhost:3000/embed/[shop]/[menu]

Enjoy the premium flipbook experience! 📖✨

