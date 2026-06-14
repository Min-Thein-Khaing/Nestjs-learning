import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create.post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { GetPostDto } from '../dtos/get.post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async findAll(userId?: number) {
    console.log(userId);
    // const user = this.usersService.findByUserId(userId);
    const post = this.postRepository.find({
      relations: {
        author: true,
      },
    });
    return post;
  }
  async createPost(createPostDto: CreatePostDto) {
    const user = await this.usersService.findByUserId(createPostDto.authorId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const post = this.postRepository.create({
      ...createPostDto,
      author: user,
    });
    return await this.postRepository.save(post);
  }

  /** delete method */
  async deletePost(getPostDto: GetPostDto) {
    const post = await this.postRepository.findOne({
      where: { id: getPostDto.id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.postRepository.delete(getPostDto.id);
  }
}
