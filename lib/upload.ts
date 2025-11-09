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
  folder: string
): Promise<{ path: string; filename: string }> {
  await ensureUploadDir();

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds maximum allowed size');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const hash = createHash('md5').update(buffer).digest('hex');
  const ext = file.name.split('.').pop();
  const filename = `${hash}.${ext}`;
  
  const folderPath = join(UPLOAD_DIR, folder);
  await mkdir(folderPath, { recursive: true });

  const filepath = join(folderPath, filename);
  await writeFile(filepath, buffer);

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
  } = {}
): Promise<Buffer> {
  let image = sharp(buffer);

  if (options.width || options.height) {
    image = image.resize(options.width, options.height, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  return await image
    .jpeg({ quality: options.quality || 90 })
    .toBuffer();
}

export async function generateThumbnail(
  imagePath: string,
  thumbnailPath: string
): Promise<void> {
  await sharp(imagePath)
    .resize(200, 280, {
      fit: 'cover',
    })
    .jpeg({ quality: 80 })
    .toFile(thumbnailPath);
}

