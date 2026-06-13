import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'The label of the tag' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(250)
  label!: string;

  @ApiPropertyOptional({
    example: 'This is the description of the tag',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
