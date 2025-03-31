import { ClientFileEntity } from '@features/clientFile/data/entity/ClientFileEntity';
import { ClientFileDTO } from '../dto/ClientFileDTO';
import { toClientFileDTO } from './ClientFileMapper';

export const toClientFilePagination = (
  items: any[], // ← ici c'est du Prisma brut
  currentPage: number,
  totalItems: number,
  totalPages: number,
  pageSize: number,
  pageLimit: number
): {
  items: ClientFileDTO[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  pageLimit: number;
} => {
  // ⚠️ Conversion en entités métier avant d'appliquer le mapper
  const entities = items.map((item) => new ClientFileEntity(item));
  const dtos = entities.map(toClientFileDTO);

  return {
    items: dtos,
    currentPage,
    totalItems,
    totalPages,
    pageSize,
    pageLimit,
  };
};
