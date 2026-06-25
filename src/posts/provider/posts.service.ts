import { TagsService } from './../../tags/provider/tags.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create.post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { GetPostDto } from '../dtos/get.post.dto';
import { UpdatePostDto } from '../dtos/update.post.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { PostCreateProvide } from './post-create.provide';
import { UserData } from 'src/auth/interfaces/userData.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,
    // private readonly postMetaService: PostMetaService,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    /** inject pagination provider */
    private readonly paginationProvider: PaginationProvider,

    private readonly postCreateProvider: PostCreateProvide,
  ) {}

  async findAll(postQuery: GetPostDto) {
    // const user = this.usersService.findByUserId(userId);

    const post = this.paginationProvider.paginateQuery(
      postQuery,
      this.postRepository,
      {
        relations: {
          author: true,
        },
      },
    );
    return post;
  }
  async createPost(createPostDto: CreatePostDto, user: UserData) {
    return await this.postCreateProvider.createPost(createPostDto, user);
  }

  async patchPost(updatePostDto: UpdatePostDto) {
    const tag = await this.tagsService.findByTagId(updatePostDto.tag!);
    const post = await this.postRepository.findOneBy({
      id: updatePostDto.id,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    post.title = updatePostDto.title || post.title;
    post.slug = updatePostDto.slug || post.slug;
    post.content = updatePostDto.content || post.content;
    post.status = updatePostDto.status || post.status;
    post.featureImgUrl = updatePostDto.featureImgUrl || post.featureImgUrl;
    post.publishedOn = updatePostDto.publishedOn || post.publishedOn;
    if (updatePostDto.meta?.readTime) {
      post.meta.readTime = updatePostDto.meta.readTime;
    }
    post.tag = tag;
    return await this.postRepository.save(post);
  }

  /** delete method */
  async deletePost(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.postRepository.delete(id);
  }
}
