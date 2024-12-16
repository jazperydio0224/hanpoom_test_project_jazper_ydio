import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';

export interface Filtering {
  status: string;
  value: string;
}

export enum FilterStatus {
  NOT_PRINTED = 'np',
  PRINTED = 'pr',
  HELD = 'he',
}

export const FilteringParams = createParamDecorator(
  (data, ctx: ExecutionContext): Filtering => {
    const req: Request = ctx.switchToHttp().getRequest();
    const filter = req.query.filter as string;
    if (!filter) return null;

    if (typeof data != 'object')
      throw new BadRequestException('Invalid filter parameter');

    const validStatusValues = Object.values(FilterStatus).join('|');

    const statusRegex = new RegExp(`^status:(${validStatusValues})$`);

    // Validate the filter format
    if (!filter.match(statusRegex)) {
      throw new BadRequestException('Invalid filter parameter');
    }

    const [status, value] = filter.split(':');

    if (!data.includes(value)) {
      throw new BadRequestException('Invalid filter parameter');
    }

    if (!Object.values(FilterStatus).includes(value as FilterStatus)) {
      throw new BadRequestException(`Invalid filter parameter value: ${value}`);
    }

    return { status, value };
  },
);
