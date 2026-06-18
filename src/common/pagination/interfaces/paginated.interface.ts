export interface Paginated<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string | null;
    last: string | null;
    current: string | null;
    next: string | null;
    prev: string | null;
  };
}

//for laravel
// export interface Paginated<T> {
//   data: T[];
//   links: {
//     first: string | null;
//     last: string | null;
//     prev: string | null;
//     next: string | null;
//   };
//   meta: {
//     current_page: number;
//     from: number | null;
//     last_page: number;
//     links?: Array<{
//       url: string | null;
//       label: string;
//       active: boolean;
//     }>;
//     path: string;
//     per_page: number;
//     to: number | null;
//     total: number;
//   };
// }
