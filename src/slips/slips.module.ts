import { Module } from '@nestjs/common';
import { SlipsService } from './slips.service';
import { SlipsController } from './slips.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickingSlips } from 'src/entities/picking-slips.entity';
import { PickingSlipItems } from 'src/entities/picking-slip-items.entity';
import { PickingSlipDates } from 'src/entities/picking-slip-dates.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PickingSlips,
      PickingSlipItems,
      PickingSlipDates,
    ]),
  ],
  controllers: [SlipsController],
  providers: [SlipsService],
})
export class SlipsModule {}
