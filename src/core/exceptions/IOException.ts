import { BaseException } from './BaseException';

export class IOException extends BaseException {
  constructor(message: string) {
    super(500, `Erreur d'entrée/sortie : ${message}`);
  }
}
