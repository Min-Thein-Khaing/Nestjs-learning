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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PaginationModule } from './common/pagination/pagination.module';
import databaseConfig from './config/database.config';
import validationSchema from './config/env.validation';
import jwtConfig from './auth/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';

const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [databaseConfig],
      validationSchema: validationSchema,
    }),
    UsersModule,
    PostsModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host')!,
        port: configService.get<number>('database.port')!,
        username: configService.get<string>('database.username')!,
        password: configService.get<string>('database.password')!,
        database: configService.get<string>('database.database')!,
        // entities: [User, Post, Tag],
        autoLoadEntities: configService.get<boolean>(
          'database.autoLoadEntities',
        ),
        synchronize: configService.get<boolean>('database.synchronize'),
      }),
    }),
    TagsModule,
    PostMetaModule,
    PaginationModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule {}
