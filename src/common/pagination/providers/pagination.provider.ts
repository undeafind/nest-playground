import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from '../dtos/pagination-query.dto';
import { ObjectLiteral, Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Paginated } from '../interfaces/paginated.interface';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public async paginateQuery<T extends ObjectLiteral>(
    query: PaginationQueryDto,
    repository: Repository<T>,
  ): Promise<Paginated<T>> {
    const results = await repository.find({
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });

    const baseUrl = `${this.request.protocol}://${this.request.headers.host}/`;
    const newUrl = new URL(this.request.url, baseUrl);

    const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / query.limit);
    const nextPage = query.page === totalPages ? query.page : query.page + 1;
    const previousPage = query.page === 1 ? query.page : query.page - 1;

    return {
      data: results,
      meta: {
        itemsPerPage: query.limit,
        currentPage: query.page,
        totalPages,
        totalItems,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${query.limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${query.limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${query.limit}&page=${query.page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${query.limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${query.limit}&page=${previousPage}`,
      },
    };
  }
}
