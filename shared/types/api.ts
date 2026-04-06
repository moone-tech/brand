// =============================================================================
// shared/types/api.ts — API response envelope types
// =============================================================================

export interface ApiMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    field?: string;
    requestId?: string;
  };
}

export type Paginated<T> = ApiResponse<T[]> & { meta: Required<ApiMeta> };
