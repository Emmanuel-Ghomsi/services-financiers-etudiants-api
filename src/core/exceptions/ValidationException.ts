import { BaseException } from './BaseException';

export class ValidationException extends BaseException {
  constructor(message: string) {
    super(400, `Erreur de validation : ${message}`);
  }
}
