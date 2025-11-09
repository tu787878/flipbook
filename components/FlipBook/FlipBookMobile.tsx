'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface FlipBookMobileProps {
  pages: Page[];
  shopName?: string;
  menuName?: string;
}

export default function FlipBookMobile({ pages, shopName, menuName }: FlipBookMobileProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Touch handling for swipe
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left - next page
      handleNext();
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right - previous page
      handlePrev();
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gray-50">
      {/* Main Page Area */}
      <div 
        className="flex-1 flex items-center justify-center overflow-auto p-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={pages[currentPage]?.imageUrl}
              alt={`Page ${currentPage + 1}`}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Simple Bottom Controls */}
      <div className="bg-white border-t px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="p-3 rounded-lg bg-purple-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed active:bg-purple-700 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {currentPage + 1} / {pages.length}
            </div>
            {menuName && (
              <div className="text-xs text-gray-600">{menuName}</div>
            )}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === pages.length - 1}
            className="p-3 rounded-lg bg-purple-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed active:bg-purple-700 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        {/* Swipe hint */}
        <div className="text-center mt-2 text-xs text-gray-500">
          Swipe left or right to flip pages
        </div>
      </div>
    </div>
  );
}

