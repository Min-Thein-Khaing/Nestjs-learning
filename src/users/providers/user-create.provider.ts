import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create.user.dto';
import { QueryFailedError, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/provider/hashing.provider';

@Injectable()
export class UserCreateProvider {
  private readonly logger = new Logger(UserCreateProvider.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existUser) {
      throw new ConflictException('Email already exists');
    }

    try {
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hashPassword(
          createUserDto.password,
        ),
      });

      return await this.userRepository.save(newUser);
    } catch (error: unknown) {
      // The pre-check above gives a friendly response in the normal case, but
      // the database constraint is still needed for concurrent requests.
      if (
        error instanceof QueryFailedError &&
        (error.driverError as { code?: string }).code === '23505'
      ) {
        throw new ConflictException('Email already exists');
      }

      this.logger.error(
        'Failed to save user',
        error instanceof Error ? error.stack : String(error),
      );
      throw new InternalServerErrorException('Unable to create user');
    }
  }
}
