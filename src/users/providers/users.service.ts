import { CreateGoogleUserProvider } from './create-google-user.provider';
import { EmailFindByUserProvider } from './email_find_by_user.provider';
import {
  BadRequestException,
  // forwardRef,
  // Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { AuthService } from 'src/auth/provider/auth.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create.user.dto';
import { CreateManyUserDto } from '../dtos/create_many.user.dto';
// import * as config from '@nestjs/config';
// import authConfig from '../config/auth.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { UserCreateProvider } from './user-create.provider';
import { FindByGoogleId } from './find-by-google-id';
import { GoogleUser } from '../interfaces/google-user.interface';

/**
 *  class to connect to users table and make business tasks
 */
@Injectable()
export class UsersService {
  /** to inject auth service */
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    /** to inject UsersCreateManyProvider */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    private readonly userCreateProvider: UserCreateProvider,

    private readonly emailFindByUserProvider: EmailFindByUserProvider,

    private readonly findByGoogleId: FindByGoogleId,

    private readonly createGoogleUserProvider: CreateGoogleUserProvider,
  ) {}

  /**  create users */
  async create(createUserDto: CreateUserDto) {
    return await this.userCreateProvider.create(createUserDto);
  }

  /** to get all users */
  findAll(limit: number, page: number) {
    return [
      { id: 1, name: 'John Doe', email: 'h9M4y@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
      limit,
      page,
    ];
  }
  /**
   * to get user by id
   * @param userId
   * @returns
   */
  async findByUserId(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException('User not found', {
        description: 'user id is not found',
      });
    }

    return user;
  }

  async createMany(createUserDto: CreateManyUserDto) {
    return await this.usersCreateManyProvider.createMany(createUserDto);
  }

  async findByEmail(email: string) {
    return await this.emailFindByUserProvider.findByEmail(email);
  }

  async findOneByGoogleId(googleId: string) {
    return await this.findByGoogleId.findByGoogleId(googleId);
  }

  async createUserGoogle(googleUser: GoogleUser) {
    return await this.createGoogleUserProvider.createGoogleUser(googleUser);
  }
}
