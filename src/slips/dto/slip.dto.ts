import { IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';

export class SlipDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsNumber()
  @IsNotEmpty()
  pickingSlipId: number;

  @IsNumber()
  @IsNotEmpty()
  hasPreOrderItem: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['not printed', 'printed', 'held'], {
    message: 'picking_slip_status must be one of: not printed, printed, held',
  })
  pickingSlipStatus: string;
}
