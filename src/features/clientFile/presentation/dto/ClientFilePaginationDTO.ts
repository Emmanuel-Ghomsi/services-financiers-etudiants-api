import { ClientFileDTO } from './ClientFileDTO';

/**
 * Représente la structure d'une réponse paginée pour les fiches clients.
 */
export interface ClientFilePaginationDTO {
  items: ClientFileDTO[]; // Liste des fiches clients retournées
  currentPage: number; // Page actuelle
  totalItems: number; // Nombre total d’éléments
  totalPages: number; // Nombre total de pages
  pageSize: number; // Nombre d’éléments par page
  pageLimit: number; // Limite maximum par page (valeur fixe ou envoyée dans la requête)
}
