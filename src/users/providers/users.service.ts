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

/**
 *  class to connect to users table and make business tasks
 */
@Injectable()
export class UsersService {
  /** to inject auth service */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
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
    return [
      { id: '1', name: 'John Doe', email: 'h9M4y@example.com' },
      { id: '2', name: 'Jane Doe', email: 'jane.doe@example.com' },
      limit,
      page,
    ];
  }
  /**
   * to get user by id
   * @param userId
   * @returns
   */
  findByUserId(id: number) {
    return this.userRepository.findOneBy({ id });
  }
}
