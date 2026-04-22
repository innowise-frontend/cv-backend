import { SearchPaginationInput } from "src/graphql";

interface PaginationMeta {
  page: number;
  limit: number;
  skip: number;
};

export function resolvePagination(params?: SearchPaginationInput): PaginationMeta {
  const page = params?.page && params.page > 0 ? params.page : 1;
  const limit = Math.min(params?.limit && params.limit > 0 ? params.limit : 10, 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
}
