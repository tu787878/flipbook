import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { saveFile, UPLOAD_DIR } from '@/lib/upload';
import { join } from 'path';
import { generateSlug } from '@/lib/utils';

// Try to import PDF processor, but handle if canvas is not installed
let convertPDFToImages: any;
try {
  convertPDFToImages = require('@/lib/pdf-processor').convertPDFToImages;
} catch (error) {
  console.warn('PDF processing not available. Only image uploads will work.');
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const menuId = formData.get('menuId') as string;

    if (!menuId) {
      return NextResponse.json({ error: 'Menu ID required' }, { status: 400 });
    }

    const folder = `menus/${menuId}`;
    let pages: Array<{ pageNumber: number; imageUrl: string; thumbnail: string }> = [];

    // Check for single file (PDF or single image)
    const singleFile = formData.get('file') as File;
    
    if (singleFile) {
      // Single file upload (PDF)
      const fileType = singleFile.type;

      if (fileType === 'application/pdf') {
        // Handle PDF upload
        if (!convertPDFToImages) {
          return NextResponse.json(
            { 
              error: 'PDF processing is not available. Please upload PNG or JPG images instead. ' +
                     'To enable PDF support, install: brew install pkg-config cairo pango && npm install canvas pdfjs-dist' 
            },
            { status: 400 }
          );
        }

        const bytes = await singleFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const outputDir = join(UPLOAD_DIR, folder);
        const pageImages = await convertPDFToImages(buffer, outputDir);

        pages = pageImages.map((img) => ({
          pageNumber: img.pageNumber,
          imageUrl: img.imagePath,
          thumbnail: img.thumbnailPath,
        }));
      } else if (fileType.startsWith('image/')) {
        // Single image upload
        const { path } = await saveFile(singleFile, folder);
        
        pages = [{
          pageNumber: 1,
          imageUrl: path,
          thumbnail: path,
        }];
      } else {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload PDF or PNG/JPG files.' },
          { status: 400 }
        );
      }
    } else {
      // Multiple files upload (images only)
      const files = formData.getAll('files') as File[];
      
      if (files.length === 0) {
        return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
      }

      // Process each image
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type;

        if (!fileType.startsWith('image/')) {
          return NextResponse.json(
            { error: `File ${file.name} is not an image. Please upload only images when selecting multiple files.` },
            { status: 400 }
          );
        }

        const { path } = await saveFile(file, folder);
        
        pages.push({
          pageNumber: i + 1,
          imageUrl: path,
          thumbnail: path,
        });
      }
    }

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

