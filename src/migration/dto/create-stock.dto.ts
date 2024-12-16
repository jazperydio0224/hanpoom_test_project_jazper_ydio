import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStockDto {
  @IsNotEmpty()
  @IsNumber()
  id: bigint;
}
