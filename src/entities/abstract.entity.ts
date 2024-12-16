import { PrimaryGeneratedColumn } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn()
  id: bigint;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
