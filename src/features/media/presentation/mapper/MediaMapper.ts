import { MediaEntity } from '../../data/entity/MediaEntity';
import { MediaDTO } from '../dto/MediaDTO';
import { config } from '@core/config/env';

export const toMediaDTO = (entity: MediaEntity): MediaDTO => ({
  url: `${config.server.host}:${config.server.port}/${config.server.prefix}/${entity.path}`,
  size: entity.size,
  mimeType: entity.mimeType,
});
