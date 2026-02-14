import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: '標籤名稱', example: 'sale' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
