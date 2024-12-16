import { Entity, CreateDateColumn, ManyToOne, Column } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { PickingSlips } from './picking-slips.entity';
import { Items } from './items.entity';
import { Stocks } from './stocks.entity';
import { OrderFulfillmentProducts } from './order-fulfillment-products.entity';
@Entity()
export class PickingSlipItems extends AbstractEntity<PickingSlipItems> {
  @ManyToOne(
    () => PickingSlips,
    (pickingSlips) => pickingSlips.pickingSlipItems,
  )
  pickingSlip: PickingSlips;

  @ManyToOne(() => Items, (items) => items.pickingSlipItems)
  item: Items;

  @ManyToOne(() => Stocks, (stocks) => stocks.pickingSlipItems, {
    nullable: true,
  })
  stock: Stocks;

  @ManyToOne(
    () => OrderFulfillmentProducts,
    (orderOrderFulfillmentProducts) =>
      orderOrderFulfillmentProducts.pickingSlipItems,
  )
  orderFulfillmentProduct: OrderFulfillmentProducts;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'int', nullable: false })
  refundedQuantity: number;

  @Column({ type: 'bigint', nullable: true })
  locationId: bigint;

  @Column({ type: 'varchar', nullable: true })
  locationCode: string;

  @Column({ type: 'tinyint', nullable: false })
  isPreOrder: number;

  @Column({ type: 'tinyint', nullable: false })
  isSalesOnly: number;

  @Column({ type: 'timestamp', nullable: true })
  preOrderShippingAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  preOrderDeadlineAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
