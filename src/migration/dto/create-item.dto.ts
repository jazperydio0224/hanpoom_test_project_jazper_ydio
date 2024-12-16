import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateItemDto {
  @IsNumber()
  @IsNotEmpty()
  id: bigint;
}
