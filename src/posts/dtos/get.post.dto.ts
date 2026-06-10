import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetPostDto {
  @ApiProperty({ description: 'The unique identifier of the post' })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  id!: number;
}
