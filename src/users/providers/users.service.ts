import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/provider/auth.service';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create.user.dto';
import * as config from '@nestjs/config';
import authConfig from '../config/auth.config';

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
  ) {}

  /**  create users */
  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existUser) {
      throw new ConflictException('Email already exists');
    }

    const newUser = this.userRepository.create(createUserDto);

    return await this.userRepository.save(newUser);
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
    return this.userRepository.findOneBy({ id });
  }
}
