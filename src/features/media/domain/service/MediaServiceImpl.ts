/* eslint-disable no-unused-vars */
import { MultipartFile } from '@fastify/multipart';
import { MediaService } from './MediaService';
import { MediaDAO } from '@features/media/data/dao/MediaDAO';
import { UserDAO } from '@features/auth/data/dao/UserDAO';
import { MediaDTO } from '@features/media/presentation/dto/MediaDTO';
import { toMediaDTO } from '@features/media/presentation/mapper/MediaMapper';

export class MediaServiceImpl implements MediaService {
  constructor(
    private mediaDAO: MediaDAO,
    private userDAO: UserDAO
  ) {}

  async updateUserProfilePicture(
    file: MultipartFile,
    userId: string
  ): Promise<MediaDTO> {
    const media = await this.mediaDAO.saveProfilePicture(file, userId);
    await this.userDAO.updateProfilePicture(userId, media.path);

    return toMediaDTO(media);
  }

  async getMedia(filename: string): Promise<MediaDTO | null> {
    const mediaEntity = await this.mediaDAO.getMediaByFilename(filename);
    if (!mediaEntity) return null;
    return toMediaDTO(mediaEntity);
  }
}
