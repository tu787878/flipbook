'use client';

import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Page {
  id: string;
  imageUrl: string;
  pageNumber: number;
}

interface FlipBook3DProps {
  pages: Page[];
  shopName?: string;
  menuName?: string;
}

function BookPage({ 
  imageUrl, 
  position, 
  rotation, 
  isFlipping, 
  targetRotation 
}: { 
  imageUrl: string; 
  position: [number, number, number]; 
  rotation: [number, number, number];
  isFlipping: boolean;
  targetRotation: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(imageUrl);

  useFrame(() => {
    if (meshRef.current && isFlipping) {
      const currentRotation = meshRef.current.rotation.y;
      const diff = targetRotation - currentRotation;
      meshRef.current.rotation.y += diff * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[2, 2.8]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Book({ pages, currentPage, onPageChange }: { 
  pages: Page[]; 
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [targetRotation, setTargetRotation] = useState(0);

  const handleFlip = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentPage < pages.length - 1) {
      setIsFlipping(true);
      setTargetRotation(Math.PI);
      setTimeout(() => {
        onPageChange(currentPage + 1);
        setIsFlipping(false);
        setTargetRotation(0);
      }, 1000);
    } else if (direction === 'prev' && currentPage > 0) {
      setIsFlipping(true);
      setTargetRotation(-Math.PI);
      setTimeout(() => {
        onPageChange(currentPage - 1);
        setIsFlipping(false);
        setTargetRotation(0);
      }, 1000);
    }
  };

  return (
    <group>
      {/* Left page */}
      {currentPage > 0 && (
        <Suspense fallback={null}>
          <BookPage
            imageUrl={pages[currentPage - 1].imageUrl}
            position={[-1.05, 0, 0]}
            rotation={[0, 0, 0]}
            isFlipping={false}
            targetRotation={0}
          />
        </Suspense>
      )}

      {/* Right page */}
      {currentPage < pages.length && (
        <Suspense fallback={null}>
          <BookPage
            imageUrl={pages[currentPage].imageUrl}
            position={[1.05, 0, 0]}
            rotation={[0, 0, 0]}
            isFlipping={isFlipping}
            targetRotation={targetRotation}
          />
        </Suspense>
      )}

      {/* Book spine */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[0.1, 2.8, 0.1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </group>
  );
}

export default function FlipBook3D({ pages, shopName, menuName }: FlipBook3DProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white px-6 py-4 z-10">
        <h2 className="text-2xl font-bold">{menuName || 'Menu'}</h2>
        {shopName && <p className="text-gray-300">{shopName}</p>}
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Book pages={pages} currentPage={currentPage} onPageChange={setCurrentPage} />
        </Suspense>
        
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
        />
      </Canvas>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white px-6 py-4 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="p-3 rounded-lg bg-purple-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <span className="text-lg font-medium">
            Page {currentPage + 1} of {pages.length}
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === pages.length - 1}
            className="p-3 rounded-lg bg-purple-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

