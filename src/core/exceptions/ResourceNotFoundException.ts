import { BaseException } from './BaseException';

export class ResourceNotFoundException extends BaseException {
  constructor(resource: string, id?: string) {
    super(404, `${resource} ${id ? `avec l'ID ${id} ` : ''}introuvable.`);
  }
}
