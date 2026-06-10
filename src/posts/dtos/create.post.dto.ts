import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';
import { PostStatus } from '../enums/postStatus.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My Post',
    type: String,
    required: true,
  })
  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'The slug of the post',
    example: 'my-post-title',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be in kebab-case format (e.g., "my-post-title")',
  })
  slug!: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the content of my post',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content!: string;

  @ApiProperty({
    description: 'The status of the post',
    example: PostStatus,
    type: String,
    required: true,
  })
  @IsEnum(PostStatus, { message: 'Invalid status value' })
  @IsNotEmpty()
  status!: PostStatus;

  @ApiProperty({
    description: 'The feature image URL of the post',
    example: 'https://example.com/image.jpg',
    type: String,
    required: false,
  })
  @IsUrl()
  @IsOptional()
  featureImgUrl?: string;

  @ApiPropertyOptional({
    description: 'The published date of the post',
    example: '2023-09-01T00:00:00.000Z',
  })
  @IsISO8601()
  @IsOptional()
  publishedOn?: Date;

  @ApiProperty({
    description: 'The tags associated with the post',
    example: ['tag1', 'tag2'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(2, { each: true })
  tag?: string[];
}
