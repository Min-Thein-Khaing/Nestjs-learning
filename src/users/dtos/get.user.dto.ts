import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetUserDto {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
    type: Number,
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number) // Ensure the value is transformed to a number
  id!: number;
}
