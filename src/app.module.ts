import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
// import { PostsService } from './posts/provider/posts.service';
// import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from './tags/tags.module';
import { PostMetaModule } from './post-meta/post-meta.module';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'asdffdsa',
      database: 'nest_app',
      // entities: [User, Post, Tag],
      autoLoadEntities: true,
      synchronize: true,
    }),
    TagsModule,
    PostMetaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
