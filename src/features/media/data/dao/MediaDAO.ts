/* eslint-disable no-unused-vars */
import { MediaEntity } from '../entity/MediaEntity';
import { MultipartFile } from '@fastify/multipart';

export interface MediaDAO {
  saveProfilePicture(file: MultipartFile, userId: string): Promise<MediaEntity>;
  getMediaByFilename(filename: string): Promise<MediaEntity | null>;
}
