import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/provider/auth.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create.user.dto';
import { CreateManyUserDto } from '../dtos/create_many.user.dto';
import * as config from '@nestjs/config';
import authConfig from '../config/auth.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { UserCreateProvider } from './user-create.provider';

/**
 *  class to connect to users table and make business tasks
 */
@Injectable()
export class UsersService {
  /** to inject auth service */
  constructor(
    /** to inject auth service */
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    private readonly configService: config.ConfigService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: config.ConfigType<typeof authConfig>,
    /** to inject auth service */
    @InjectRepository(User)
    private userRepository: Repository<User>,

    /** to inject UsersCreateManyProvider */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    private readonly userCreateProvider: UserCreateProvider,
  ) {}

  /**  create users */
  async create(createUserDto: CreateUserDto) {
    return await this.userCreateProvider.create(createUserDto);
  }

  /** to get all users */
  findAll(limit: number, page: number) {
    const isAuth = this.authService.isAuth();
    console.log(isAuth);
    const env = this.configService.get<string>('AUTH_KEY');

    console.log(env);
    console.log(this.authConfiguration.fallbackUrl);
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
}
