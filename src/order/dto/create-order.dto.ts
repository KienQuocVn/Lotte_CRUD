import { IsMongoId, IsNumber, Min, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export class CreateOrderDto {
  @IsMongoId()
  readonly user: string;

  @IsMongoId()
  readonly item: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  readonly quantity: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Total must be at least 0' })
  readonly total: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status?: OrderStatus;
}
