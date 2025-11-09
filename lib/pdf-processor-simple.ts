import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

interface PageImage {
  pageNumber: number;
  imagePath: string;
  thumbnailPath: string;
}

/**
 * Simple PDF processor without canvas dependency
 * For full PDF support, install: brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
 * Then run: npm install canvas pdfjs-dist
 */
export async function convertPDFToImages(
  pdfBuffer: Buffer,
  outputDir: string
): Promise<PageImage[]> {
  try {
    // Try to use the full PDF processor if canvas is available
    const pdfProcessor = await import('./pdf-processor');
    return await pdfProcessor.convertPDFToImages(pdfBuffer, outputDir);
  } catch (error) {
    console.warn('Canvas not available, PDF processing disabled. Upload images instead.');
    throw new Error(
      'PDF processing requires additional dependencies. Please upload PNG or JPG images instead, ' +
      'or install canvas: brew install pkg-config cairo pango && npm install canvas pdfjs-dist'
    );
  }
}

export async function extractPDFMetadata(pdfBuffer: Buffer) {
  try {
    const pdfProcessor = await import('./pdf-processor');
    return await pdfProcessor.extractPDFMetadata(pdfBuffer);
  } catch (error) {
    throw new Error('PDF processing requires additional dependencies');
  }
}

