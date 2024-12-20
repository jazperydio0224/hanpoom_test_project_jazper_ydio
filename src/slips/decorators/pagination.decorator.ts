import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { Request } from 'express';

export interface Pagination {
  page: number;
  limit: number;
  size: number;
  offset: number;
}

export const PaginationParams = createParamDecorator(
  (data, ctx: ExecutionContext): Pagination => {
    const req: Request = ctx.switchToHttp().getRequest();
    const page = parseInt(req.query.page as string);
    const size = parseInt(req.query.size as string);

    // page and size validation
    if (isNaN(page) || page < 0 || isNaN(size) || size < 0) {
      throw new BadRequestException('Invalid pagination parameters');
    }

    // limit large slices
    if (size > 100) {
      throw new BadRequestException(
        'Invalid pagination parameters. Maximum size is 100',
      );
    }

    const limit = size;
    const offset = page * limit;
    return { page, limit, size, offset };
  },
);
