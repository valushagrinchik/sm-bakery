import { SortOrder } from '@san-martin/san-martin-libs/common';

export interface PaginationParams {
  offset: number;
  limit: number;
}

export interface SortParams<E extends Record<string, any> = any> {
  sort?: {
    [K in keyof E]?: SortOrder;
  };
}

export interface BaseQueryParams<E extends Record<string, any> = any> extends PaginationParams {
  search?: string;
  sort?: SortParams<E>;
  filter?: {
    [K in keyof E]?: E[K];
  };
}
