import { IsNotEmpty, IsInt, IsDate } from 'class-validator';

export class CreatePickingSlipDto {
  @IsNotEmpty()
  @IsInt()
  id: bigint;

  @IsNotEmpty()
  @IsInt()
  orderId: bigint;

  @IsNotEmpty()
  @IsInt()
  orderFulfillmentOrderId: bigint;

  @IsInt()
  @IsNotEmpty()
  isContainedSingleProduct: number;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
}
