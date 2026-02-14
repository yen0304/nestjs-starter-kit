import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: '商品名稱', example: 'iPhone 16' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: '商品描述',
    example: 'Latest Apple smartphone',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '價格', example: 999.99 })
  @IsNumber()
  price!: number;

  @ApiProperty({ description: '分類 ID', example: 1 })
  @IsInt()
  categoryId!: number;

  @ApiProperty({ description: '建立者 User ID', example: 1 })
  @IsInt()
  createdById!: number;

  @ApiPropertyOptional({
    description: '標籤 ID 陣列',
    example: [1, 2],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tagIds?: number[];
}
