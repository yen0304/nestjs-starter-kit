import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: '訂單狀態',
    enum: OrderStatus,
    example: 'CONFIRMED',
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
