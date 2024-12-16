import { IsNotEmpty, IsNumber } from 'class-validator';
import { SlipDto } from './slip.dto';

export class SlipResponseDto extends SlipDto {
  @IsNumber()
  @IsNotEmpty()
  total: number;

  pickingSlips: SlipDto[];

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsNumber()
  size: string;
}
