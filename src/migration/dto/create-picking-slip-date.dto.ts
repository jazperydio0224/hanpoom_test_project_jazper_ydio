import {
  IsNotEmpty,
  IsInt,
  IsDate,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreatePickingSlipDateDto {
  @IsNotEmpty()
  @IsInt()
  id: bigint;

  @IsNotEmpty()
  @IsInt()
  pickingSlipId: bigint;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  printedUsername: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  inspectedUsername: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  packedUsername: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  shippedUsername: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  heldUsername: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  cancelledUsername: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  refundedUsername: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  confirmedUsername: string | null;

  @IsOptional()
  @IsDate()
  printedAt: Date | null;

  @IsOptional()
  @IsDate()
  inspectedAt: Date | null;

  @IsOptional()
  @IsDate()
  packedAt: Date | null;

  @IsOptional()
  @IsDate()
  shippedAt: Date | null;

  @IsOptional()
  @IsDate()
  deliveredAt: Date | null;

  @IsOptional()
  @IsDate()
  returnedAt: Date | null;

  @IsOptional()
  @IsDate()
  cancelledAt: Date | null;

  @IsOptional()
  @IsDate()
  refundedAt: Date | null;

  @IsOptional()
  @IsDate()
  heldAt: Date | null;

  @IsOptional()
  @IsDate()
  confirmedAt: Date | null;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  heldReason: string | null;
}
