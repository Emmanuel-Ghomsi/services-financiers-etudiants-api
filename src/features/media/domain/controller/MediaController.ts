import { FastifyRequest, FastifyReply } from 'fastify';
import { MediaService } from '../service/MediaService';
import { GetMediaRequest } from '@features/media/presentation/payload/GetMediaRequest';

export class MediaController {
  static async updateUserProfilePicture(
    req: FastifyRequest,
    res: FastifyReply,
    mediaService: MediaService
  ) {
    const userId = (req as any).user.id; // venant du middleware auth
    const file = await req.file(); // gestion multipart par fastify
    if (!file) {
      res.status(400).send({ message: 'Aucun fichier fourni' });
      return;
    }
    const mediaDTO = await mediaService.updateUserProfilePicture(file, userId);
    res.send(mediaDTO);
  }

  static async getMedia(
    req: FastifyRequest<{ Params: GetMediaRequest }>,
    res: FastifyReply,
    mediaService: MediaService
  ) {
    const { filename } = req.params;

    const media = await mediaService.getMedia(filename);

    if (!media) {
      return res.status(404).send({ message: 'Média non trouvé' });
    }

    return res.sendFile(filename, 'public/medias/images');
  }
}
