'use client';

import { useState, useEffect } from 'react';
import FlipBookStPage from './FlipBookStPage';
import FlipBookMobile from './FlipBookMobile';

interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface FlipBookResponsiveProps {
  pages: Page[];
  shopName?: string;
  menuName?: string;
  settings?: any;
}

export default function FlipBookResponsive({ pages, shopName, menuName, settings }: FlipBookResponsiveProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Use simple mobile viewer on mobile, StPageFlip on desktop
  if (isMobile) {
    return <FlipBookMobile pages={pages} shopName={shopName} menuName={menuName} />;
  }

  return <FlipBookStPage pages={pages} shopName={shopName} menuName={menuName} settings={settings} />;
}

