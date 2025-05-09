import { FastifyInstance } from 'fastify';
import { MediaService } from '../service/MediaService';
import { MediaController } from '../controller/MediaController';

export async function registerMediaRoutes(
  app: FastifyInstance,
  mediaService: MediaService
) {
  app.post(
    '/media/profile-picture',
    {
      schema: {
        tags: ['Media'],
        summary: 'Uploader/modifier la photo de profil utilisateur',
        consumes: ['multipart/form-data'],
      },
      preHandler: [app.authenticate],
    },
    (req, res) =>
      MediaController.updateUserProfilePicture(req, res, mediaService)
  );

  app.get(
    '/public/medias/images/:filename',
    {
      schema: {
        tags: ['Media'],
        summary: 'Récupérer une image par filename',
        params: {
          type: 'object',
          properties: {
            filename: { type: 'string' },
          },
          required: ['filename'],
        },
      },
    },
    (req, res) => MediaController.getMedia(req as any, res, mediaService)
  );
}
