import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Dynamic imports to make canvas optional
let pdfjsLib: any;
let createCanvas: any;

try {
  pdfjsLib = require('pdfjs-dist');
  const canvas = require('canvas');
  createCanvas = canvas.createCanvas;
  
  // Set up PDF.js worker
  if (pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
} catch (error) {
  console.warn('Canvas or pdfjs-dist not available. PDF processing will be disabled.');
}

export interface PageImage {
  pageNumber: number;
  imagePath: string;
  thumbnailPath: string;
}

export async function convertPDFToImages(
  pdfBuffer: Buffer,
  outputDir: string,
  folder?: string
): Promise<PageImage[]> {
  if (!pdfjsLib || !createCanvas) {
    throw new Error('PDF processing requires canvas library. Install with: brew install pkg-config cairo pango && npm install canvas pdfjs-dist');
  }
  
  await mkdir(outputDir, { recursive: true });

  const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
  const pdf = await loadingTask.promise;
  
  const pageImages: PageImage[] = [];
  const numPages = pdf.numPages;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    // Create canvas
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Convert canvas to buffer
    const imageBuffer = canvas.toBuffer('image/png');

    // Save full-size image as WebP
    const imageName = `page-${pageNum}.webp`;
    const imagePath = join(outputDir, imageName);
    
    await sharp(imageBuffer)
      .webp({ quality: 90, effort: 6 })
      .toFile(imagePath);

    // Generate thumbnail as WebP
    const thumbnailName = `thumb-${pageNum}.webp`;
    const thumbnailPath = join(outputDir, thumbnailName);
    
    await sharp(imageBuffer)
      .resize(200, 280, { fit: 'cover' })
      .webp({ quality: 80, effort: 6 })
      .toFile(thumbnailPath);

    // Calculate the relative path from UPLOAD_DIR
    // outputDir is something like: /path/to/public/uploads/menus/menuId
    // We need: menus/menuId
    const uploadsIndex = outputDir.indexOf('uploads');
    const relativePath = uploadsIndex >= 0 
      ? outputDir.substring(uploadsIndex + 'uploads'.length + 1) // +1 for the slash
      : (folder || 'menus');
    
    pageImages.push({
      pageNumber: pageNum,
      imagePath: `/uploads/${relativePath}/${imageName}`,
      thumbnailPath: `/uploads/${relativePath}/${thumbnailName}`,
    });
  }

  return pageImages;
}

export async function extractPDFMetadata(pdfBuffer: Buffer) {
  if (!pdfjsLib) {
    throw new Error('PDF processing requires pdfjs-dist library');
  }
  
  const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
  const pdf = await loadingTask.promise;
  const metadata = await pdf.getMetadata();

  return {
    numPages: pdf.numPages,
    info: metadata.info,
    metadata: metadata.metadata,
  };
}

