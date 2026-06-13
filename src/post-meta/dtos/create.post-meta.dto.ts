import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostMetaDto {
  @ApiProperty({
    description: 'The read time of the post',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readTime!: string;
}
