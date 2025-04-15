/* eslint-disable no-unused-vars */
import { MultipartFile } from '@fastify/multipart';
import { MediaDTO } from '@features/media/presentation/dto/MediaDTO';

export interface MediaService {
  updateUserProfilePicture(
    file: MultipartFile,
    userId: string
  ): Promise<MediaDTO>;
  getMedia(filename: string): Promise<MediaDTO | null>;
}
