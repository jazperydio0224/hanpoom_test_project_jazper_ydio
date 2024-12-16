import { Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { PickingSlipItems } from './picking-slip-items.entity';
@Entity()
export class Items extends AbstractEntity<Items> {
  @OneToMany(
    () => PickingSlipItems,
    (pickingSlipItems) => pickingSlipItems.item,
    { cascade: true },
  )
  pickingSlipItems: PickingSlipItems[];
}
