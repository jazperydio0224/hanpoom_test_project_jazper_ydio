import {
  IsNotEmpty,
  IsInt,
  IsDate,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreatePickingSlipItemDto {
  @IsNotEmpty()
  @IsInt()
  id: bigint;

  @IsNotEmpty()
  @IsInt()
  pickingSlipId: bigint;

  @IsNotEmpty()
  @IsInt()
  itemId: bigint;

  @IsOptional()
  @IsInt()
  stockId: bigint | null;

  @IsNotEmpty()
  @IsInt()
  orderFulfillmentProductId: bigint;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  printedUsername: string | null;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsInt()
  refundedQuantity: number;

  @IsOptional()
  @IsInt()
  locationId: bigint | null;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  locationCode: string | null;

  @IsInt()
  @IsNotEmpty()
  isPreOrder: number;

  @IsInt()
  @IsNotEmpty()
  isSalesOnly: number;

  @IsOptional()
  @IsDate()
  preOrderShippingAt: Date | null;

  @IsOptional()
  @IsDate()
  preOrderDeadlineAt: Date | null;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
}
