'use client';

import React, { useEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip';
import { ChevronLeft, ChevronRight, Maximize, Minimize, ZoomIn, ZoomOut, BookOpen } from 'lucide-react';

interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface FlipBookStPageProps {
  pages: Page[];
  shopName?: string;
  menuName?: string;
  settings?: {
    backgroundColor?: string;
    showControls?: boolean;
    spreadView?: boolean;
  };
}

export default function FlipBookStPage({ pages, shopName, menuName, settings }: FlipBookStPageProps) {
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [spreadView, setSpreadView] = useState(settings?.spreadView ?? true);
  const [isMobile, setIsMobile] = useState(false);
  const [bookDimensions, setBookDimensions] = useState<{ width: number; height: number; scale?: number } | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const showControls = settings?.showControls ?? true;
  const backgroundColor = settings?.backgroundColor || '#f3f4f6';

  // Detect mobile on mount and ensure it's set before initialization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload all images before initializing PageFlip
  useEffect(() => {
    if (pages.length === 0) return;

    const preloadImages = async () => {
      try {
        const imagePromises = pages.map((page) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve();
            img.onerror = () => {
              console.error(`Failed to load image: ${page.imageUrl}`);
              resolve(); // Continue even if one image fails
            };
            img.src = page.imageUrl;
          });
        });

        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setImagesLoaded(true); // Continue anyway
      }
    };

    preloadImages();
  }, [pages]);

  useEffect(() => {
    if (!bookRef.current || pages.length === 0 || !imagesLoaded) return;

    // Wait a bit to ensure DOM is ready and mobile detection is complete
    const initTimer = setTimeout(() => {
      if (!bookRef.current) return;

      try {
        // Get actual container dimensions
        const container = bookRef.current.parentElement;
        const containerWidth = container?.clientWidth || window.innerWidth;
        const containerHeight = container?.clientHeight || window.innerHeight;
        
        const mobile = window.innerWidth < 768;
        
        // Calculate dimensions - mobile uses single page, desktop uses 2-page spread
        let width, height;
        if (mobile) {
          // For mobile: single page view - calculate to fit within viewport
          // Account for controls (60px - minimized) and padding
          const availableWidth = Math.min(containerWidth - 20, window.innerWidth - 20);
          const availableHeight = Math.min(containerHeight - 60, window.innerHeight - 60);
          
          // For single page (portrait), typical aspect ratio is ~0.7:1 (width:height)
          // But we need to fit both width and height constraints
          const maxWidthByHeight = (availableHeight * 0.7); // height * aspect ratio
          const maxHeightByWidth = (availableWidth / 0.7); // width / aspect ratio
          
          // Use the smaller dimension to ensure it fits
          if (maxWidthByHeight < availableWidth) {
            width = maxWidthByHeight;
            height = availableHeight;
          } else {
            width = availableWidth;
            height = maxHeightByWidth;
          }
          
          // Ensure minimum readable size
          width = Math.max(width, 250);
          height = Math.max(height, 350);
          
          // Calculate scale to ensure it fits in viewport with extra margin (zoom out)
          // Add more padding (80px) to zoom out and show book border
          const scaleX = (availableWidth - 80) / width;
          const scaleY = (availableHeight - 80) / height;
          const scale = Math.min(0.85, scaleX, scaleY); // Cap at 0.85 to show book border
          
          // Store dimensions for CSS
          setBookDimensions({ width, height, scale });
        } else {
          // Desktop: 2-page spread
          width = 700;
          height = 933;
          setBookDimensions({ width, height });
        }

        // Initialize PageFlip with mobile-aware settings
        const pageFlip = new PageFlip(bookRef.current, {
          width: width,
          height: height,
          size: mobile ? 'fixed' : 'stretch', // Use fixed size on mobile to prevent overflow
          minWidth: mobile ? 300 : 400,
          maxWidth: mobile ? width : 1400,
          minHeight: mobile ? 400 : 533,
          maxHeight: mobile ? height : 1867,
          maxShadowOpacity: 0.3,
          showCover: false,
          mobileScrollSupport: true,
          swipeDistance: 30,
          clickEventForward: true,
          usePortrait: mobile, // Single page on mobile, 2-page spread on desktop
          startPage: 0,
          drawShadow: true,
          flippingTime: 800,
          useMouseEvents: true,
          autoSize: !mobile, // Disable autoSize on mobile to use fixed dimensions
          showPageCorners: !mobile,
        });

        pageFlipRef.current = pageFlip;

        // Create HTML pages with direct img elements for better quality
        // Clear any existing content
        if (bookRef.current) {
          bookRef.current.innerHTML = '';
          
          // Create page elements with direct img tags
          pages.forEach((page) => {
            const pageElement = document.createElement('div');
            pageElement.className = 'page';
            pageElement.style.width = '100%';
            pageElement.style.height = '100%';
            pageElement.style.display = 'flex';
            pageElement.style.alignItems = 'center';
            pageElement.style.justifyContent = 'center';
            pageElement.style.overflow = 'hidden';
            
            const img = document.createElement('img');
            img.src = page.imageUrl;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.display = 'block';
            img.style.imageRendering = 'high-quality';
            img.style.imageRendering = '-webkit-optimize-contrast';
            img.draggable = false;
            // Ensure image loads at full quality
            img.loading = 'eager';
            
            pageElement.appendChild(img);
            bookRef.current!.appendChild(pageElement);
          });
        }

        // Load pages from HTML for direct image rendering (better quality)
        const pageElements = bookRef.current?.querySelectorAll('.page');
        if (pageElements && pageElements.length > 0) {
          pageFlip.loadFromHTML(Array.from(pageElements) as HTMLElement[]);
        }

        // Event listeners
        pageFlip.on('flip', (e: any) => {
          setCurrentPage(e.data);
        });

        pageFlip.on('changeState', (e: any) => {
          setTotalPages(pageFlip.getPageCount());
        });

        // Debug: Log initialization
        console.log('PageFlip initialized:', {
          mobile,
          width,
          height,
          pagesCount: pages.length,
          containerWidth: containerWidth,
          containerHeight: containerHeight
        });

        // Handle keyboard navigation
        const handleKeyPress = (e: KeyboardEvent) => {
          if (e.key === 'ArrowLeft') handlePrevPage();
          if (e.key === 'ArrowRight') handleNextPage();
          if (e.key === 'f' || e.key === 'F') toggleFullscreen();
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
          window.removeEventListener('keydown', handleKeyPress);
          if (pageFlipRef.current) {
            pageFlipRef.current.destroy();
          }
        };
      } catch (error) {
        console.error('Error initializing PageFlip:', error);
      }
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (pageFlipRef.current) {
        pageFlipRef.current.destroy();
        pageFlipRef.current = null;
      }
    };
  }, [pages, imagesLoaded]);

  const handleNextPage = () => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipNext();
    }
  };

  const handlePrevPage = () => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipPrev();
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flip(pageNum);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Header - Hide on mobile */}
      {showControls && (shopName || menuName) && (
        <div className="bg-white/90 backdrop-blur-sm border-b px-4 py-2 hidden md:block">
          <h2 className="text-lg font-bold text-gray-900">{menuName || 'Menu'}</h2>
          {shopName && <p className="text-sm text-gray-700">{shopName}</p>}
        </div>
      )}

      {/* Main Flipbook Area */}
      <div 
        className={`flex-1 flex items-center justify-center ${isMobile ? 'overflow-hidden p-2' : 'overflow-hidden p-2'}`}
        style={{ 
          minHeight: isMobile ? '400px' : '600px',
          maxHeight: isMobile ? 'calc(100vh - 60px)' : 'none',
          position: 'relative',
        }}
      >
        {!imagesLoaded ? (
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-700 text-sm">Loading images...</p>
          </div>
        ) : (
          <div
            ref={bookRef}
            className="relative"
            style={{
              width: isMobile && bookDimensions ? `${bookDimensions.width}px` : '100%',
              height: isMobile && bookDimensions ? `${bookDimensions.height}px` : 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              ...(isMobile && bookDimensions && bookDimensions.scale && bookDimensions.scale < 1 && {
                transform: `scale(${bookDimensions.scale})`,
                transformOrigin: 'center center',
              }),
            }}
          />
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className={`bg-white/90 backdrop-blur-sm border-t ${isMobile ? 'px-2 py-1' : 'px-4 py-2'}`}>
          <div className={`flex items-center ${isMobile ? 'justify-center' : 'justify-between'} max-w-6xl mx-auto`}>
            {/* Navigation */}
            <div className={`flex items-center ${isMobile ? 'gap-1.5' : 'gap-2'}`}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`${isMobile ? 'p-1' : 'p-1.5'} rounded-lg bg-purple-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 active:bg-purple-800 transition-colors`}
                aria-label="Previous page"
              >
                <ChevronLeft className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
              </button>

              <span className={`${isMobile ? 'text-[10px] px-1.5' : 'text-xs px-2'} font-medium text-gray-900`}>
                {currentPage + 1}/{totalPages || pages.length}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage >= (totalPages || pages.length) - 1}
                className={`${isMobile ? 'p-1' : 'p-1.5'} rounded-lg bg-purple-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 active:bg-purple-800 transition-colors`}
                aria-label="Next page"
              >
                <ChevronRight className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
              </button>
            </div>

            {/* Page Thumbnails - Hidden on mobile */}
            <div className="hidden md:flex gap-1.5 overflow-x-auto max-w-md">
              {pages.map((page, index) => (
                <button
                  key={page.id}
                  onClick={() => goToPage(index)}
                  className={`relative flex-shrink-0 w-12 h-16 rounded overflow-hidden border transition-all ${
                    index === currentPage
                      ? 'border-purple-600 ring-1 ring-purple-300'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <img
                    src={page.imageUrl}
                    alt={`${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute bottom-0 left-0 right-0 text-[9px] text-center bg-white/90 py-0.5 font-semibold text-gray-900">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>

            {/* Fullscreen - Hidden on mobile */}
            <button
              onClick={toggleFullscreen}
              className="hidden md:block p-1.5 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition-colors"
              aria-label="Toggle fullscreen"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

