import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmailFindByUserProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException('User not found', {
          description: 'User email is not found',
        });
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Something went wrong during fetching user',
      );
    }
  }
}
