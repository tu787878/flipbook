'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface FlipBookProps {
  pages: Page[];
  shopName?: string;
  menuName?: string;
  settings?: {
    enableSound?: boolean;
    autoFlip?: boolean;
    autoFlipDelay?: number;
    backgroundColor?: string;
    showControls?: boolean;
    spreadView?: boolean; // Show 2 pages side by side
  };
}

export default function FlipBook({ pages, shopName, menuName, settings }: FlipBookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [spreadView, setSpreadView] = useState(settings?.spreadView ?? true); // Default to spread view
  const containerRef = useRef<HTMLDivElement>(null);

  const showControls = settings?.showControls ?? true;
  const backgroundColor = settings?.backgroundColor || '#f3f4f6';
  
  // Calculate which pages to show
  const getVisiblePages = () => {
    if (!spreadView) {
      return [pages[currentPage]].filter(Boolean);
    }
    // Show two pages side by side (left and right)
    const leftPage = pages[currentPage];
    const rightPage = pages[currentPage + 1];
    return [leftPage, rightPage].filter(Boolean);
  };
  
  const visiblePages = getVisiblePages();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage]);

  const handleNextPage = () => {
    const step = spreadView ? 2 : 1;
    const maxPage = pages.length - (spreadView ? 2 : 1);
    
    if (currentPage < maxPage && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('right');
      setTimeout(() => {
        setCurrentPage(Math.min(currentPage + step, maxPage));
        setIsFlipping(false);
      }, 600);
    }
  };

  const handlePrevPage = () => {
    const step = spreadView ? 2 : 1;
    
    if (currentPage > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('left');
      setTimeout(() => {
        setCurrentPage(Math.max(currentPage - step, 0));
        setIsFlipping(false);
      }, 600);
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

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.2, 0.5));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Header */}
      {showControls && (shopName || menuName) && (
        <div className="bg-white/90 backdrop-blur-sm border-b px-6 py-4">
          <h2 className="text-2xl font-bold">{menuName || 'Menu'}</h2>
          {shopName && <p className="text-gray-600">{shopName}</p>}
        </div>
      )}

      {/* Main Flipbook Area */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="relative" style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s' }}>
          {/* Book Container with 3D page flip effect */}
          <div 
            className="relative"
            style={{
              perspective: '2500px',
              perspectiveOrigin: 'center center',
            }}
          >
            <div className={`relative ${spreadView ? 'flex gap-0' : ''}`}>
              {/* Background pages (always visible for depth) */}
              <div className={`relative shadow-2xl ${spreadView ? 'flex gap-0' : ''}`}>
                {visiblePages.map((page, index) => (
                  <div key={`bg-${page?.id || index}`} className="relative">
                    <img
                      src={page?.imageUrl}
                      alt=""
                      className="max-w-full max-h-[70vh] w-auto h-auto object-contain opacity-30"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>

              {/* Flipping page overlay */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  className={`absolute inset-0 ${spreadView ? 'flex gap-0' : ''}`}
                  initial={{
                    rotateY: flipDirection === 'right' ? -180 : 180,
                  }}
                  animate={{
                    rotateY: 0,
                  }}
                  exit={{
                    rotateY: flipDirection === 'right' ? 180 : -180,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    transformOrigin: flipDirection === 'right' ? 'left center' : 'right center',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div className={`relative shadow-2xl ${spreadView ? 'flex gap-0' : ''}`}>
                    {visiblePages.map((page, index) => (
                      <motion.div
                        key={page?.id || index}
                        className="relative rounded-lg overflow-hidden bg-white"
                        initial={{
                          opacity: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                        }}
                        transition={{
                          duration: 0.4,
                        }}
                      >
                        <img
                          src={page?.imageUrl}
                          alt={`Page ${page?.pageNumber || currentPage + index + 1}`}
                          className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                          draggable={false}
                        />
                        
                        {/* Dynamic shadow during flip */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          initial={{
                            background: flipDirection === 'right'
                              ? 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, transparent 100%)'
                              : 'linear-gradient(-90deg, rgba(0,0,0,0.5) 0%, transparent 100%)',
                          }}
                          animate={{
                            background: 'linear-gradient(90deg, transparent 0%, transparent 100%)',
                          }}
                          transition={{
                            duration: 0.8,
                          }}
                        />
                        
                        {/* Page shadow effect - center shadow for spread view */}
                        {spreadView && (
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: index === 0 
                                ? 'linear-gradient(to left, rgba(0,0,0,0.2) 0%, transparent 5%)' 
                                : 'linear-gradient(to right, rgba(0,0,0,0.2) 0%, transparent 5%)'
                            }}
                          />
                        )}
                        
                        {!spreadView && (
                          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/5 via-transparent to-black/5" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Hotspots */}
            {currentPage > 0 && (
              <button
                onClick={handlePrevPage}
                disabled={isFlipping}
                className="absolute left-0 top-0 bottom-0 w-1/4 cursor-pointer opacity-0 hover:opacity-100 transition-opacity z-10"
                aria-label="Previous page"
              >
                <div className="h-full bg-gradient-to-r from-black/20 to-transparent flex items-center justify-start pl-4">
                  <ChevronLeft className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </button>
            )}

            {(spreadView ? currentPage < pages.length - 2 : currentPage < pages.length - 1) && (
              <button
                onClick={handleNextPage}
                disabled={isFlipping}
                className="absolute right-0 top-0 bottom-0 w-1/4 cursor-pointer opacity-0 hover:opacity-100 transition-opacity z-10"
                aria-label="Next page"
              >
                <div className="h-full bg-gradient-to-l from-black/20 to-transparent flex items-center justify-end pr-4">
                  <ChevronRight className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="bg-white/90 backdrop-blur-sm border-t px-6 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0 || isFlipping}
                className="p-2 rounded-lg bg-purple-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-sm font-medium px-4">
                {spreadView 
                  ? `Pages ${currentPage + 1}-${Math.min(currentPage + 2, pages.length)} of ${pages.length}`
                  : `Page ${currentPage + 1} of ${pages.length}`
                }
              </span>

              <button
                onClick={handleNextPage}
                disabled={(spreadView ? currentPage >= pages.length - 2 : currentPage === pages.length - 1) || isFlipping}
                className="p-2 rounded-lg bg-purple-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSpreadView(!spreadView)}
                className="px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors text-sm font-medium"
                aria-label="Toggle view mode"
              >
                {spreadView ? '1 Page' : '2 Pages'}
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>

              <span className="text-sm font-medium px-2">{Math.round(zoom * 100)}%</span>

              <button
                onClick={handleZoomIn}
                disabled={zoom >= 2}
                className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Page Thumbnails */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {pages.map((page, index) => {
              const isActive = spreadView 
                ? index === currentPage || index === currentPage + 1
                : index === currentPage;
              
              return (
                <button
                  key={page.id}
                  onClick={() => {
                    if (!isFlipping) {
                      const targetPage = spreadView ? Math.floor(index / 2) * 2 : index;
                      if (targetPage !== currentPage) {
                        setFlipDirection(targetPage > currentPage ? 'right' : 'left');
                        setIsFlipping(true);
                        setTimeout(() => {
                          setCurrentPage(targetPage);
                          setIsFlipping(false);
                        }, 600);
                      }
                    }
                  }}
                  className={`flex-shrink-0 w-20 h-28 rounded overflow-hidden border-2 transition-all ${
                    isActive
                      ? 'border-purple-600 ring-2 ring-purple-300'
                      : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  <img
                    src={page.imageUrl}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="text-[10px] text-center bg-white/90 py-0.5">
                    {index + 1}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

