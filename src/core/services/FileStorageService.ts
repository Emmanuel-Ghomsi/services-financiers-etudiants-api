/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

export class FileStorageService {
  static readonly EXPENSE_DIR = path.join(
    __dirname,
    '../../../public/medias/expense/piece_justificative'
  );

  static async saveExpenseFile(file: any, filename: string): Promise<string> {
    await fs.promises.mkdir(this.EXPENSE_DIR, { recursive: true });
    const filepath = path.join(this.EXPENSE_DIR, filename);
    await pipeline(file.file, fs.createWriteStream(filepath));
    return `/medias/expense/piece_justificative/${filename}`;
  }
}
