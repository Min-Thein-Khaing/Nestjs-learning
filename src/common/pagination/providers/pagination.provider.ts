import { Inject, Injectable } from '@nestjs/common';
import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}
  public async paginateQuery<T extends ObjectLiteral>(
    paginationQuery: PaginationQueryDto,
    repository: Repository<T>,
    findMany: FindManyOptions<T>,
  ): Promise<Paginated<T>> {
    const page = Number(paginationQuery?.page) || 1;
    const limit = Number(paginationQuery?.limit) || 10;

    const result = await repository.find({
      ...findMany,
      skip: (page - 1) * limit,
      take: limit,
    });

    const baseUrl =
      this.request.protocol + '://' + this.request.get('host') + '/';

    const newUrl = new URL(this.request.url, baseUrl);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const currentPage = page;
    const itemsPerPage = limit;

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      data: result,
      meta: {
        itemsPerPage,
        totalItems,
        totalPages,
        currentPage,
      },
      links: {
        first: newUrl.origin + newUrl.pathname + '?page=1&limit=' + limit,
        last:
          newUrl.origin +
          newUrl.pathname +
          '?page=' +
          totalPages +
          '&limit=' +
          limit,
        current:
          newUrl.origin + newUrl.pathname + '?page=' + page + '&limit=' + limit,
        next: nextPage
          ? newUrl.origin +
            newUrl.pathname +
            '?page=' +
            nextPage +
            '&limit=' +
            limit
          : null,
        prev: prevPage
          ? newUrl.origin +
            newUrl.pathname +
            '?page=' +
            prevPage +
            '&limit=' +
            limit
          : null,
      },
    };
  }
}

//laravel style pagination

// import { Inject, Injectable } from '@nestjs/common';
// import { ObjectLiteral, Repository } from 'typeorm';
// import { PaginationQueryDto } from '../dto/pagination-query.dto';
// import { REQUEST } from '@nestjs/core';
// import type { Request } from 'express';

// @Injectable()
// export class PaginationProvider {
//   constructor(
//     @Inject(REQUEST)
//     private readonly request: Request,
//   ) {}

//   public async paginateQuery<T extends ObjectLiteral>(
//     paginationQuery: PaginationQueryDto,
//     repository: Repository<T>,
//   ) {
//     const page = Number(paginationQuery?.page) || 1;
//     const limit = Number(paginationQuery?.limit) || 10;

//     // 1. Use findAndCount to get data and total count in a single database round-trip
//     const [data, total] = await repository.findAndCount({
//       skip: (page - 1) * limit,
//       take: limit,
//     });

//     // 2. Setup URL parsing
//     const baseUrl = this.request.protocol + '://' + this.request.get('host');
//     const fullUrl = new URL(this.request.url, baseUrl);
//     const path = `${baseUrl}${fullUrl.pathname}`;

//     // 3. Math calculations
//     const lastPage = Math.ceil(total / limit) || 1;
//     const from = total > 0 ? (page - 1) * limit + 1 : null;
//     const to = total > 0 ? Math.min(page * limit, total) : null;

//     // Helper to generate specific page URLs
//     const generateUrl = (pageNumber: number | null): string | null => {
//       if (!pageNumber || pageNumber < 1 || pageNumber > lastPage) return null;
//       const urlWithParam = new URL(fullUrl.toString());
//       urlWithParam.searchParams.set('page', pageNumber.toString());
//       return urlWithParam.toString();
//     };

//     // 4. Generate the Laravel-style meta.links array
//     const metaLinks: Array<{
//       url: string | null;
//       label: string;
//       active: boolean;
//     }> = [];

//     // // "Previous" link
//     metaLinks.push({
//       url: page > 1 ? generateUrl(page - 1) : null,
//       label: '&laquo; Previous',
//       active: false,
//     });

//     // // Individual page number links
//     for (let i = 1; i <= lastPage; i++) {
//       metaLinks.push({
//         url: generateUrl(i),
//         label: i.toString(),
//         active: i === page,
//       });
//     }

//     // // "Next" link
//     metaLinks.push({
//       url: page < lastPage ? generateUrl(page + 1) : null,
//       label: 'Next &raquo;',
//       active: false,
//     });

//     // 5. Structure the exact Laravel signature payload
//     return {
//       data,
//       links: {
//         first: generateUrl(1),
//         last: generateUrl(lastPage),
//         prev: page > 1 ? generateUrl(page - 1) : null,
//         next: page < lastPage ? generateUrl(page + 1) : null,
//       },
//       meta: {
//         current_page: page,
//         from,
//         last_page: lastPage,
//         links: metaLinks,
//         path,
//         per_page: limit,
//         to,
//         total,
//       },
//     };
//   }
// }
