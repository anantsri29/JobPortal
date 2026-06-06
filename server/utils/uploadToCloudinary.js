import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

export const isCloudinaryConfigured = () => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  const placeholders = ['your_cloud_name', 'your_api_key', 'your_api_secret'];
  return (
    CLOUDINARY_CLOUD_NAME &&
    CLOUDINARY_API_KEY &&
    CLOUDINARY_API_SECRET &&
    !placeholders.includes(CLOUDINARY_CLOUD_NAME) &&
    !placeholders.includes(CLOUDINARY_API_KEY) &&
    !placeholders.includes(CLOUDINARY_API_SECRET)
  );
};

const uploadToLocal = async (buffer, folder, originalName = 'file') => {
  const safeFolder = folder.replace(/[^a-zA-Z0-9/_-]/g, '');
  const dir = path.join(UPLOADS_DIR, safeFolder);
  await fs.mkdir(dir, { recursive: true });

  const ext = path.extname(originalName) || '';
  const filename = `${randomUUID()}${ext}`;
  const filePath = path.join(dir, filename);
  await fs.writeFile(filePath, buffer);

  const relativePath = path.join(safeFolder, filename).replace(/\\/g, '/');
  const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;

  return {
    secure_url: `${baseUrl}/uploads/${relativePath}`,
    public_id: `local:${relativePath}`,
  };
};

const uploadToCloudinary = (buffer, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    bufferToStream(buffer).pipe(uploadStream);
  });
};

export const uploadBuffer = async (buffer, folder, resourceType = 'auto', originalName) => {
  if (!isCloudinaryConfigured()) {
    console.log('Cloudinary not configured — saving file locally');
    return uploadToLocal(buffer, folder, originalName);
  }
  return uploadToCloudinary(buffer, folder, resourceType);
};

export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;

  if (publicId.startsWith('local:')) {
    const relativePath = publicId.replace('local:', '');
    const filePath = path.join(UPLOADS_DIR, relativePath);
    try {
      await fs.unlink(filePath);
    } catch {
      // file may already be deleted
    }
    return;
  }

  if (isCloudinaryConfigured()) {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  }
};

export default { uploadBuffer, deleteFromCloudinary, isCloudinaryConfigured };
