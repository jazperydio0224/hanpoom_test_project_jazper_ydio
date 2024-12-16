import {
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { Orders } from './orders.entity';
import { PickingSlipItems } from './picking-slip-items.entity';
import { PickingSlipDates } from './picking-slip-dates.entity';
@Entity()
export class PickingSlips extends AbstractEntity<PickingSlips> {
  @ManyToOne(() => Orders, (orders) => orders.pickingSlips)
  @JoinColumn({ name: 'order_id' })
  orders: Orders;

  @OneToOne(
    () => PickingSlipDates,
    (pickingSlipDates) => pickingSlipDates.pickingSlip,
  )
  pickingSlipDates: PickingSlipDates;

  @OneToMany(
    () => PickingSlipItems,
    (pickingSlipItems) => pickingSlipItems.pickingSlip,
    { cascade: true },
  )
  pickingSlipItems: PickingSlipItems[];

  @Column({ type: 'bigint', nullable: false })
  orderFulfillmentOrderId: bigint;

  @Column({ type: 'tinyint', nullable: false })
  isContainedSingleProduct: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
