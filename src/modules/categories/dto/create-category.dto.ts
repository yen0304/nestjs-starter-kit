import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: '分類名稱', example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({
    description: '父分類 ID（建立子分類時使用）',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  parentId?: number;
}
