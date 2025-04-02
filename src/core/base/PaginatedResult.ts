export interface PaginatedResult<T> {
  items: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
  pageLimit: number;
}
