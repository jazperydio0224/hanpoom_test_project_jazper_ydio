import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PickingSlips } from 'src/entities/picking-slips.entity';
import { PickingSlipItems } from 'src/entities/picking-slip-items.entity';
import { PickingSlipDates } from 'src/entities/picking-slip-dates.entity';
import { Repository } from 'typeorm';
import { Filtering } from './decorators/filtering.decorator';
import { Pagination } from './decorators/pagination.decorator';
import { PaginatedResource } from './dto/pagination.dto';
import { SlipResponseDto } from './dto/slip-response.dto';

@Injectable()
export class SlipsService {
  constructor(
    @InjectRepository(PickingSlips)
    private readonly pickingSlipsRepository: Repository<PickingSlips>,
    @InjectRepository(PickingSlipItems)
    private readonly pickingSlipItemsRepository: Repository<PickingSlipItems>,
    @InjectRepository(PickingSlipDates)
    private readonly pickingSlipDatesRepository: Repository<PickingSlipDates>,
  ) {}
  public async getPickingSlips(
    { page, limit, size, offset }: Pagination,
    filter?: Filtering,
  ): Promise<PaginatedResource<Partial<SlipResponseDto>>> {
    const where = this.generateStatusFilterCondition(filter);

    return await this.retrievePickingSlips({
      where,
      take: limit,
      skip: offset,
      page,
      size,
    });
  }

  private async retrievePickingSlips({
    where,
    take,
    skip,
    page,
    size,
  }: {
    where: string;
    take: number;
    skip: number;
    page: number;
    size: number;
  }): Promise<PaginatedResource<Partial<SlipResponseDto>>> {
    const slips = await this.pickingSlipsRepository
      .createQueryBuilder('PS')
      .innerJoinAndSelect('PS.pickingSlipDates', 'PSD')
      .innerJoinAndSelect('PS.pickingSlipItems', 'PSI')
      .innerJoinAndSelect('PS.orders', 'O')
      .select([
        'O.id as order_id',
        'PS.id as picking_slip_id',
        'PSI.isPreOrder as has_pre_order_item',
        `
          CASE
            WHEN PSD.printedAt IS NULL
              AND PSD.inspectedAt IS NULL
              AND PSD.shippedAt IS NULL
              AND PSD.heldAt IS NULL
              THEN 'not printed'
            WHEN PSD.printedAt IS NOT NULL
              AND PSD.inspectedAt IS NULL
              AND PSD.shippedAt IS NULL
              AND PSD.heldAt IS NULL
              THEN 'printed'
            WHEN PSD.heldAt IS NOT NULL
              THEN 'held'
            ELSE 'other status'
          END AS status
        `,
      ])
      .where(
        `EXISTS 
          (  SELECT 1 FROM picking_slip_items PSI_SUB WHERE PSI_SUB.is_pre_order = 1 
             AND PSI_SUB.picking_slip_id = PS.id
          )`,
      )
      .having(where || `1=1`)
      .limit(take)
      .offset(skip)
      .orderBy('PS.created_at', 'DESC')
      .getRawMany();

    const totalSlips = await this.pickingSlipsRepository
      .createQueryBuilder('PS')
      .innerJoinAndSelect('PS.pickingSlipDates', 'PSD')
      .innerJoinAndSelect('PS.pickingSlipItems', 'PSI')
      .innerJoinAndSelect('PS.orders', 'O')
      .select([
        'O.id as order_id',
        'PS.id as picking_slip_id',
        'PSI.isPreOrder as has_pre_order_item',
        `
          CASE
            WHEN PSD.printedAt IS NULL
              AND PSD.inspectedAt IS NULL
              AND PSD.shippedAt IS NULL
              AND PSD.heldAt IS NULL
              THEN 'not printed'
            WHEN PSD.printedAt IS NOT NULL
              AND PSD.inspectedAt IS NULL
              AND PSD.shippedAt IS NULL
              AND PSD.heldAt IS NULL
              THEN 'printed'
            WHEN PSD.heldAt IS NOT NULL
              THEN 'held'
            ELSE 'other status'
          END AS status
        `,
      ])
      .where(
        `EXISTS 
          (  SELECT 1 FROM picking_slip_items PSI_SUB WHERE PSI_SUB.is_pre_order = 1 
             AND PSI_SUB.picking_slip_id = PS.id
          )`,
      )
      .having(where || `1=1`)
      .orderBy('PS.created_at', 'DESC')
      .getRawMany();

    return {
      totalItems: totalSlips.length,
      items: slips,
      page: page,
      size: size,
    };
  }

  private readonly generateStatusFilterCondition = (filter: {
    status: string;
    value: string;
  }): string => {
    if (!filter || filter.status !== 'status') return '';

    const statusMapper = {
      pr: 'printed',
      np: 'not printed',
      he: 'held',
    };

    const status = statusMapper[filter.value];
    if (!status) {
      throw new Error(`Invalid filter value: ${filter.value}`);
    }

    return `status = '${status}'`;
  };
}
