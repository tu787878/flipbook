'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize, ZoomIn, ZoomOut, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface FlipBookAdvancedProps {
  pages: Page[];
  shopName?: string;
  menuName?: string;
  settings?: {
    backgroundColor?: string;
    showControls?: boolean;
    spreadView?: boolean;
  };
}

export default function FlipBookAdvanced({ pages, shopName, menuName, settings }: FlipBookAdvancedProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [displayPage, setDisplayPage] = useState(0); // Page to display during animation
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [spreadView, setSpreadView] = useState(settings?.spreadView ?? true);
  const [hoveringSide, setHoveringSide] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showControls = settings?.showControls ?? true;
  const backgroundColor = settings?.backgroundColor || '#f3f4f6';

  const getVisiblePages = (pageIndex: number) => {
    if (!spreadView) {
      return [pages[pageIndex]].filter(Boolean);
    }
    const leftPage = pages[pageIndex];
    const rightPage = pages[pageIndex + 1];
    return [leftPage, rightPage].filter(Boolean);
  };

  const visiblePages = getVisiblePages(displayPage);
  const nextPages = getVisiblePages(currentPage);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'ArrowRight') handleNextPage();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, spreadView]);

  // Sync displayPage with currentPage when not flipping
  useEffect(() => {
    if (!isFlipping) {
      setDisplayPage(currentPage);
    }
  }, [currentPage, isFlipping]);

  const handleNextPage = () => {
    const step = spreadView ? 2 : 1;
    const maxPage = pages.length - (spreadView ? 2 : 1);

    if (currentPage < maxPage && !isFlipping) {
      const nextPage = Math.min(currentPage + step, maxPage);
      
      setIsFlipping(true);
      setFlipDirection('right');
      setCurrentPage(nextPage); // Set target page immediately
      
      // Update display after animation
      setTimeout(() => {
        setDisplayPage(nextPage);
        setIsFlipping(false);
      }, 800);
    }
  };

  const handlePrevPage = () => {
    const step = spreadView ? 2 : 1;

    if (currentPage > 0 && !isFlipping) {
      const prevPage = Math.max(currentPage - step, 0);
      
      setIsFlipping(true);
      setFlipDirection('left');
      setCurrentPage(prevPage); // Set target page immediately
      
      // Update display after animation
      setTimeout(() => {
        setDisplayPage(prevPage);
        setIsFlipping(false);
      }, 800);
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

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5));

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col"
      style={{ backgroundColor }}
    >
      {/* Header */}
      {showControls && (shopName || menuName) && (
        <div className="bg-white/90 backdrop-blur-sm border-b px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">{menuName || 'Menu'}</h2>
          {shopName && <p className="text-gray-700">{shopName}</p>}
        </div>
      )}

      {/* Main Flipbook Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden">
        <div
          className="relative"
          style={{
            transform: `scale(${zoom})`,
            transition: 'transform 0.3s ease',
          }}
        >
          {/* 3D Book Container */}
          <div
            className="relative"
            style={{
              perspective: '2000px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            {/* Book Base/Shadow */}
            <div className="absolute -inset-4 bg-black/20 blur-2xl rounded-lg" style={{ zIndex: 0 }} />

            {/* Book Pages Container */}
            <div className={`relative ${spreadView ? 'flex' : ''}`} style={{ zIndex: 1 }}>
              {spreadView ? (
                <>
                  {/* Left Page - STATIC (or flips when going BACK) */}
                  <div className="relative" style={{ perspective: '2000px' }}>
                    {/* Base left page - shows the target/next page */}
                    <div className="relative bg-white shadow-2xl">
                      <img
                        src={nextPages[0]?.imageUrl}
                        alt={`Page ${nextPages[0]?.pageNumber}`}
                        className="max-h-[70vh] w-auto h-auto object-contain"
                        draggable={false}
                        style={{ display: 'block' }}
                      />
                      <div
                        className="absolute inset-y-0 right-0 w-6 pointer-events-none"
                        style={{
                          background: 'linear-gradient(to left, rgba(0,0,0,0.05) 0%, transparent 100%)',
                        }}
                      />
                    </div>
                    
                    {/* Flipping left page - ONLY when going BACK */}
                    {isFlipping && flipDirection === 'left' && visiblePages[0] && (
                      <motion.div
                        key={`flip-left-${displayPage}`}
                        className="absolute inset-0 bg-white shadow-2xl"
                        initial={{ 
                          rotateY: 0,
                          z: 0,
                          x: 0,
                        }}
                        animate={{ 
                          rotateY: 180,
                          z: [0, 80, 0],
                          x: [0, 200, 400],
                        }}
                        transition={{
                          duration: 0.8,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        style={{
                          transformStyle: 'preserve-3d',
                          transformOrigin: 'right center',
                          backfaceVisibility: 'hidden',
                          zIndex: 10,
                        }}
                      >
                        <img
                          src={visiblePages[0]?.imageUrl}
                          alt=""
                          className="max-h-[70vh] w-auto h-auto object-contain"
                          draggable={false}
                        />
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          animate={{ opacity: [0, 0.5, 0] }}
                          transition={{ duration: 0.8 }}
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
                          }}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Right Page - STATIC (or flips when going FORWARD) */}
                  <div className="relative" style={{ perspective: '2000px' }}>
                    {/* Base right page - shows the target/next page */}
                    <div className="relative bg-white shadow-2xl">
                      <img
                        src={nextPages[1]?.imageUrl}
                        alt={`Page ${nextPages[1]?.pageNumber}`}
                        className="max-h-[70vh] w-auto h-auto object-contain"
                        draggable={false}
                        style={{ display: 'block' }}
                      />
                      <div
                        className="absolute inset-y-0 left-0 w-6 pointer-events-none"
                        style={{
                          background: 'linear-gradient(to right, rgba(0,0,0,0.05) 0%, transparent 100%)',
                        }}
                      />
                    </div>
                    
                    {/* Flipping right page - ONLY when going FORWARD */}
                    {isFlipping && flipDirection === 'right' && visiblePages[1] && (
                      <motion.div
                        key={`flip-right-${displayPage}`}
                        className="absolute inset-0 bg-white shadow-2xl"
                        initial={{ 
                          rotateY: 0,
                          z: 0,
                          x: 0,
                        }}
                        animate={{ 
                          rotateY: -180,
                          z: [0, 80, 0],
                          x: [0, -200, -400],
                        }}
                        transition={{
                          duration: 0.8,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        style={{
                          transformStyle: 'preserve-3d',
                          transformOrigin: 'left center',
                          backfaceVisibility: 'hidden',
                          zIndex: 10,
                        }}
                      >
                        <img
                          src={visiblePages[1]?.imageUrl}
                          alt=""
                          className="max-h-[70vh] w-auto h-auto object-contain"
                          draggable={false}
                        />
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          animate={{ opacity: [0, 0.5, 0] }}
                          transition={{ duration: 0.8 }}
                          style={{
                            background: 'linear-gradient(-90deg, transparent 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
                          }}
                        />
                      </motion.div>
                    )}
                  </div>
                </>
              ) : (
                // Single page view
                <div className="relative" style={{ perspective: '2000px' }}>
                  {/* Next page visible underneath */}
                  <div className="relative bg-white shadow-2xl rounded-lg overflow-hidden">
                    <img
                      src={nextPages[0]?.imageUrl}
                      alt=""
                      className="max-h-[70vh] w-auto h-auto object-contain"
                      draggable={false}
                    />
                  </div>

                  {/* Flipping page on top */}
                  {isFlipping && visiblePages[0] && (
                    <motion.div
                      key={`flip-single-${displayPage}`}
                      className="absolute inset-0 bg-white shadow-2xl rounded-lg overflow-hidden"
                      initial={{ 
                        rotateY: 0,
                        z: 0,
                        x: 0,
                      }}
                      animate={{
                        rotateY: flipDirection === 'right' ? 180 : -180,
                        z: [0, 80, 0],
                        x: flipDirection === 'right' 
                          ? [0, -200, -400]  // Travel left when going forward
                          : [0, 200, 400],    // Travel right when going backward
                      }}
                      transition={{
                        duration: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                      style={{
                        transformStyle: 'preserve-3d',
                        transformOrigin: flipDirection === 'right' ? 'left center' : 'right center',
                        backfaceVisibility: 'hidden',
                        zIndex: 10,
                      }}
                    >
                      <img
                        src={visiblePages[0]?.imageUrl}
                        alt=""
                        className="max-h-[70vh] w-auto h-auto object-contain"
                        draggable={false}
                      />
                      
                      {/* Flip shadow */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        animate={{ opacity: [0, 0.5, 0] }}
                        transition={{ duration: 0.8 }}
                        style={{
                          background: flipDirection === 'right'
                            ? 'linear-gradient(-90deg, transparent 0%, rgba(0,0,0,0.6) 50%, transparent 100%)'
                            : 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Page Curl Preview on Hover */}
            {!isFlipping && (
              <>
                {currentPage > 0 && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1/4 cursor-w-resize z-20"
                    onMouseEnter={() => setHoveringSide('left')}
                    onMouseLeave={() => setHoveringSide(null)}
                    onClick={handlePrevPage}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="h-full bg-gradient-to-r from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-start pl-4">
                      <ChevronLeft className="w-12 h-12 text-white drop-shadow-2xl" />
                    </div>
                  </motion.div>
                )}

                {(spreadView ? currentPage < pages.length - 2 : currentPage < pages.length - 1) && (
                  <motion.div
                    className="absolute right-0 top-0 bottom-0 w-1/4 cursor-e-resize z-20"
                    onMouseEnter={() => setHoveringSide('right')}
                    onMouseLeave={() => setHoveringSide(null)}
                    onClick={handleNextPage}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="h-full bg-gradient-to-l from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-end pr-4">
                      <ChevronRight className="w-12 h-12 text-white drop-shadow-2xl" />
                    </div>
                  </motion.div>
                )}
              </>
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

              <span className="text-sm font-medium px-4 text-gray-900">
                {spreadView
                  ? `Pages ${currentPage + 1}-${Math.min(currentPage + 2, pages.length)} of ${pages.length}`
                  : `Page ${currentPage + 1} of ${pages.length}`}
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
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  spreadView
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title={spreadView ? 'Switch to single page' : 'Switch to spread view'}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                {spreadView ? '2 Pages' : '1 Page'}
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>

              <span className="text-sm font-semibold px-2 text-gray-900">{Math.round(zoom * 100)}%</span>

              <button
                onClick={handleZoomIn}
                disabled={zoom >= 2}
                className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 transition-colors"
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>

          {/* Page Thumbnails */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
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
                        setCurrentPage(targetPage);
                        
                        // Update display after animation
                        setTimeout(() => {
                          setDisplayPage(targetPage);
                          setIsFlipping(false);
                        }, 800);
                      }
                    }
                  }}
                  className={`relative flex-shrink-0 w-20 h-28 rounded overflow-hidden border-2 transition-all ${
                    isActive
                      ? 'border-purple-600 ring-2 ring-purple-300 shadow-lg'
                      : 'border-gray-300 hover:border-purple-400 hover:shadow-md'
                  }`}
                >
                  <img
                    src={page.imageUrl}
                    alt={`Page ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute bottom-0 left-0 right-0 text-[10px] text-center bg-white/95 py-1 font-semibold text-gray-900">
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

