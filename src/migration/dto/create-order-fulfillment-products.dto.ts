import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderFulfillmentProductDto {
  @IsNumber()
  @IsNotEmpty()
  id: bigint;
}
