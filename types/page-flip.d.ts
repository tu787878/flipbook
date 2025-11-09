declare module 'page-flip' {
  export interface PageFlipOptions {
    width?: number;
    height?: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    usePortrait?: boolean;
    startPage?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    useMouseEvents?: boolean;
    autoSize?: boolean;
    showPageCorners?: boolean;
  }

  export interface FlipEvent {
    data: number;
  }

  export class PageFlip {
    constructor(element: HTMLElement, options: PageFlipOptions);
    
    loadFromImages(images: string[]): void;
    loadFromHTML(nodes: HTMLElement[]): void;
    
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    flip(page: number, corner?: 'top' | 'bottom'): void;
    turnToPage(page: number): void;
    
    getPageCount(): number;
    getCurrentPageIndex(): number;
    
    on(event: 'flip', callback: (e: FlipEvent) => void): void;
    on(event: 'changeOrientation', callback: (e: any) => void): void;
    on(event: 'changeState', callback: (e: any) => void): void;
    on(event: 'init', callback: (e: any) => void): void;
    on(event: 'update', callback: (e: any) => void): void;
    
    destroy(): void;
    update(): void;
  }
}

