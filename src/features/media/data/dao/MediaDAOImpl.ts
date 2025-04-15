/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MediaEntity } from '../entity/MediaEntity';
import fs from 'fs';
import path from 'path';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import { MultipartFile } from '@fastify/multipart';
import { MediaDAO } from './MediaDAO';

export class MediaDAOImpl implements MediaDAO {
  private readonly mediaDir = path.join(
    __dirname,
    '../../../../../public/medias/images'
  );

  constructor() {
    if (!fs.existsSync(this.mediaDir)) {
      fs.mkdirSync(this.mediaDir, { recursive: true });
    }
  }

  async saveProfilePicture(
    file: MultipartFile,
    userId: string
  ): Promise<MediaEntity> {
    const ext = path.extname(file.filename);
    const filename = `${uuid()}${ext}`;
    const filepath = path.join(this.mediaDir, filename);
    const buffer = await file.toBuffer();

    // Compression si > 2Mo
    let finalBuffer = buffer;
    if (buffer.length > 2 * 1024 * 1024) {
      finalBuffer = await sharp(buffer).jpeg({ quality: 80 }).toBuffer();
    }

    await fs.promises.writeFile(filepath, finalBuffer);

    return new MediaEntity(
      `public/medias/images/${filename}`,
      finalBuffer.length,
      file.mimetype
    );
  }

  async getMediaByFilename(filename: string): Promise<MediaEntity | null> {
    const filePath = path.join(this.mediaDir, filename);

    if (!fs.existsSync(filePath)) return null;

    const stat = await fs.promises.stat(filePath);
    const mimeType = this.getMimeType(filename);

    return new MediaEntity(
      `public/medias/images/${filename}`,
      stat.size,
      mimeType
    );
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.png':
        return 'image/png';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.gif':
        return 'image/gif';
      default:
        return 'application/octet-stream';
    }
  }
}
