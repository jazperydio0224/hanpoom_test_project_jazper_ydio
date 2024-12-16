import { Module } from '@nestjs/common';
import { MigrationService } from './migration.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Items } from 'src/entities/items.entity';
import { OrderFulfillmentProducts } from 'src/entities/order-fulfillment-products.entity';
import { Orders } from 'src/entities/orders.entity';
import { Stocks } from 'src/entities/stocks.entity';
import { PickingSlipDates } from 'src/entities/picking-slip-dates.entity';
import { PickingSlipItems } from 'src/entities/picking-slip-items.entity';
import { PickingSlips } from 'src/entities/picking-slips.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PickingSlips,
      Items,
      OrderFulfillmentProducts,
      Orders,
      Stocks,
      PickingSlipDates,
      PickingSlipItems,
    ]),
  ],
  providers: [MigrationService],
})
export class MigrationModule {}
