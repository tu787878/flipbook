import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { createHash } from 'crypto';

export const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
}

export async function saveFile(
  file: File,
  folder: string,
  convertToWebP: boolean = true
): Promise<{ path: string; filename: string }> {
  await ensureUploadDir();

  // For images that will be converted to WebP, allow larger input files
  // since WebP conversion will significantly reduce file size
  const maxInputSize = convertToWebP && file.type.startsWith('image/')
    ? MAX_FILE_SIZE * 3 // Allow 3x for images (30MB) since WebP will compress
    : MAX_FILE_SIZE;

  if (file.size > maxInputSize) {
    throw new Error(`File size exceeds maximum allowed size (${Math.round(maxInputSize / 1024 / 1024)}MB)`);
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const hash = createHash('md5').update(buffer).digest('hex');
  
  const folderPath = join(UPLOAD_DIR, folder);
  await mkdir(folderPath, { recursive: true });

  let filename: string;
  let finalBuffer: Buffer;

  // Convert to WebP if it's an image and convertToWebP is true
  if (convertToWebP && file.type.startsWith('image/')) {
    filename = `${hash}.webp`;
    finalBuffer = await sharp(buffer)
      .webp({ quality: 90, effort: 6 })
      .toBuffer();
    
    // Check final WebP size (should be much smaller)
    if (finalBuffer.length > MAX_FILE_SIZE) {
      throw new Error('Converted image size exceeds maximum allowed size. Please use a smaller image.');
    }
  } else {
    const ext = file.name.split('.').pop();
    filename = `${hash}.${ext}`;
    finalBuffer = buffer;
  }

  const filepath = join(folderPath, filename);
  await writeFile(filepath, finalBuffer);

  return {
    path: `/uploads/${folder}/${filename}`,
    filename,
  };
}

export async function processImage(
  buffer: Buffer,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}
): Promise<Buffer> {
  let image = sharp(buffer);

  if (options.width || options.height) {
    image = image.resize(options.width, options.height, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const format = options.format || 'webp';
  const quality = options.quality || 90;

  if (format === 'webp') {
    return await image.webp({ quality, effort: 6 }).toBuffer();
  } else if (format === 'jpeg') {
    return await image.jpeg({ quality }).toBuffer();
  } else {
    return await image.png({ quality }).toBuffer();
  }
}

export async function generateThumbnail(
  imagePath: string,
  thumbnailPath: string,
  format: 'webp' | 'jpeg' = 'webp'
): Promise<void> {
  const image = sharp(imagePath)
    .resize(200, 280, {
      fit: 'cover',
    });

  if (format === 'webp') {
    await image.webp({ quality: 80, effort: 6 }).toFile(thumbnailPath);
  } else {
    await image.jpeg({ quality: 80 }).toFile(thumbnailPath);
  }
}

