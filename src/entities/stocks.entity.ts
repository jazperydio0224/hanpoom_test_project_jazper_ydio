import { Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { PickingSlipItems } from './picking-slip-items.entity';
@Entity()
export class Stocks extends AbstractEntity<Stocks> {
  @OneToMany(
    () => PickingSlipItems,
    (pickingSlipItems) => pickingSlipItems.stock,
    { cascade: true },
  )
  pickingSlipItems: PickingSlipItems[];
}
