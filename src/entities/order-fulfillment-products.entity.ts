import { Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { PickingSlipItems } from './picking-slip-items.entity';
@Entity()
export class OrderFulfillmentProducts extends AbstractEntity<OrderFulfillmentProducts> {
  @OneToMany(
    () => PickingSlipItems,
    (pickingSlipItems) => pickingSlipItems.orderFulfillmentProduct,
    { cascade: true },
  )
  pickingSlipItems: PickingSlipItems[];
}
