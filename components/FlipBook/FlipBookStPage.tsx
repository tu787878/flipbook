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
  const containerRef = useRef<HTMLDivElement>(null);

  const showControls = settings?.showControls ?? true;
  const backgroundColor = settings?.backgroundColor || '#f3f4f6';

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!bookRef.current || pages.length === 0) return;

    try {
      // Initialize PageFlip with mobile-aware settings
      const pageFlip = new PageFlip(bookRef.current, {
        width: isMobile ? window.innerWidth - 20 : 700,
        height: isMobile ? window.innerHeight * 0.7 : 933,
        size: 'stretch',
        minWidth: isMobile ? 300 : 400,
        maxWidth: isMobile ? window.innerWidth : 1400,
        minHeight: isMobile ? 400 : 533,
        maxHeight: isMobile ? window.innerHeight * 0.8 : 1867,
        maxShadowOpacity: 0.3,
        showCover: false,
        mobileScrollSupport: true,
        swipeDistance: 30,
        clickEventForward: true,
        usePortrait: isMobile, // Single page on mobile
        startPage: 0,
        drawShadow: true,
        flippingTime: 800,
        useMouseEvents: true,
        autoSize: true,
        showPageCorners: !isMobile,
      });

      pageFlipRef.current = pageFlip;

      // Load pages
      pageFlip.loadFromImages(pages.map(p => p.imageUrl));

      // Event listeners
      pageFlip.on('flip', (e: any) => {
        setCurrentPage(e.data);
      });

      pageFlip.on('changeState', (e: any) => {
        setTotalPages(pageFlip.getPageCount());
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
  }, [pages, isMobile]);

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
      <div className={`flex-1 flex items-center justify-center overflow-hidden ${isMobile ? 'p-0' : 'p-2'}`}>
        <div
          ref={bookRef}
          className="relative w-full h-full flex items-center justify-center"
          style={{
            minHeight: isMobile ? '500px' : 'auto',
          }}
        />
      </div>

      {/* Controls */}
      {showControls && (
        <div className="bg-white/90 backdrop-blur-sm border-t px-4 py-2">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-1.5 rounded-lg bg-purple-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 active:bg-purple-800 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-medium px-2 text-gray-900">
                {currentPage + 1}/{totalPages || pages.length}
              </span>

              <button
                onClick={handleNextPage}
                disabled={currentPage >= (totalPages || pages.length) - 1}
                className="p-1.5 rounded-lg bg-purple-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 active:bg-purple-800 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
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

