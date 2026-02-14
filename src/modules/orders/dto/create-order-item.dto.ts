import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ description: '商品 ID', example: 1 })
  @IsInt()
  productId!: number;

  @ApiProperty({ description: '數量', example: 2 })
  @IsInt()
  @Min(1)
  quantity!: number;

  @ApiProperty({ description: '單價', example: 999.99 })
  @IsNumber()
  @Min(0)
  unitPrice!: number;
}
