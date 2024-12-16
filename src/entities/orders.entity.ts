import { Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { PickingSlips } from './picking-slips.entity';
@Entity()
export class Orders extends AbstractEntity<Orders> {
  @OneToMany(() => PickingSlips, (pickingSlips) => pickingSlips.orders, {
    cascade: true,
  })
  pickingSlips: PickingSlips[];
}
