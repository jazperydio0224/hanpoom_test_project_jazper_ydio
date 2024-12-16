import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { PickingSlips } from './picking-slips.entity';

@Entity()
export class PickingSlipDates extends AbstractEntity<PickingSlipDates> {
  @OneToOne(() => PickingSlips, { cascade: true })
  @JoinColumn()
  pickingSlip: PickingSlips;

  @Column({ type: 'varchar', length: 20, nullable: true })
  printedUsername: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  inspectedUsername: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  packedUsername: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  shippedUsername: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  heldUsername: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cancelledUsername: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  refundedUsername: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  confirmedUsername: string;

  @Column({ type: 'timestamp', nullable: true })
  printedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  inspectedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  packedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  heldAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt: Date;

  @Column({ type: 'varchar', length: 20, nullable: true })
  heldReason: string;
}
