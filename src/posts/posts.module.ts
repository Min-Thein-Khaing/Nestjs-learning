import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './provider/posts.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { TagsModule } from 'src/tags/tags.module';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { PostCreateProvide } from './provider/post-create.provide';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostCreateProvide],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Post]),
    TagsModule,
    PaginationModule,
  ],
  exports: [PostsService],
})
export class PostsModule {}
