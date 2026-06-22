import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    type: String,
    description: 'The email of the user',
    example: '0HsZo@example.com',
  })
  @IsNotEmpty()
  @IsString()
  email!: string;

  @ApiProperty({
    type: String,
    description: 'The password of the user',
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
