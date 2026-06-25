import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dtos/create.post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { TagsService } from 'src/tags/provider/tags.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { UserData } from 'src/auth/interfaces/userData.interface';

@Injectable()
export class PostCreateProvide {
  constructor(
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}
  async createPost(createPostDto: CreatePostDto, user: UserData) {
    const authorId = await this.usersService.findByUserId(user.sub);
    const tag = await this.tagsService.findByTagId(createPostDto.tag!);

    const post = this.postRepository.create({
      ...createPostDto,
      tag,
      author: authorId,
    });
    return await this.postRepository.save(post);
  }
}
