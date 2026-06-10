import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create.post.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({ description: 'The unique identifier of the post' })
  @IsInt()
  @IsNotEmpty()
  id!: number;
}
