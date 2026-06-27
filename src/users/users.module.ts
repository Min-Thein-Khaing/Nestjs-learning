import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import { UserCreateProvider } from './providers/user-create.provider';
import { EmailFindByUserProvider } from './providers/email_find_by_user.provider';
import { FindByGoogleId } from './providers/find-by-google-id';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import authConfig from './config/auth.config';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersCreateManyProvider,
    UserCreateProvider,
    EmailFindByUserProvider,
    FindByGoogleId,
    CreateGoogleUserProvider,
  ],
  exports: [UsersService],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(authConfig),
  ], //typeOrmModule loat dl so dr ka reposity create loat pho
})
export class UsersModule {}
