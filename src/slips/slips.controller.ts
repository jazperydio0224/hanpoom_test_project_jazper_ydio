import { Controller, Get, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { SlipsService } from './slips.service';
import {
  Pagination,
  PaginationParams,
} from './decorators/pagination.decorator';
import { Filtering, FilteringParams } from './decorators/filtering.decorator';
import { PaginatedResource } from './dto/pagination.dto';
import { SlipResponseDto } from './dto/slip-response.dto';

@Controller('slips')
export class SlipsController {
  private readonly logger = new Logger(SlipsController.name);
  constructor(private readonly slipsService: SlipsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getPickingSlips(
    @PaginationParams() paginationParams: Pagination,
    @FilteringParams(['np', 'pr', 'he']) filter?: Filtering,
  ): Promise<PaginatedResource<Partial<SlipResponseDto>>> {
    this.logger.log(
      `GET - PICKING SLIPS: ${JSON.stringify(paginationParams)}, ${JSON.stringify(
        filter,
      )}`,
    );
    return await this.slipsService.getPickingSlips(paginationParams, filter);
  }
}
