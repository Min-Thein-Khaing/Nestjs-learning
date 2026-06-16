import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './provider/posts.service';
import { CreatePostDto } from './dtos/create.post.dto';
import { UpdatePostDto } from './dtos/update.post.dto';
import { GetPostDto } from './dtos/get.post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get(':userId')
  getPostByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.postsService.findAll(userId);
  }

  @Get('')
  getPostAll() {
    return this.postsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Patch()
  @ApiOperation({ summary: 'Update a post' })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  updatePost(@Body() updatePostDto: UpdatePostDto) {
    return this.postsService.patchPost(updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  deletePost(@Param() getPostDto: GetPostDto) {
    return this.postsService.deletePost(getPostDto);
  }
}
