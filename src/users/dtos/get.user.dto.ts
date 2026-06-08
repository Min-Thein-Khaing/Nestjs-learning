import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class GetUserDto {
  @IsInt()
  @IsNotEmpty()
  @Type(() => Number) // Ensure the value is transformed to a number
  id!: number;
}
