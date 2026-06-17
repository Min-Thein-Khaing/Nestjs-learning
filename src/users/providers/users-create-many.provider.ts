import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';
import { CreateManyUserDto } from '../dtos/create_many.user.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createMany(createUserDto: CreateManyUserDto) {
    const newUsers: User[] = [];

    //Query Runner
    const queryRunner = this.dataSource.createQueryRunner();

    //Connect
    await queryRunner.connect();

    //Start
    await queryRunner.startTransaction();

    try {
      for (const user of createUserDto.users) {
        const userEntity = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(userEntity);

        newUsers.push(result);
      }

      //Commit
      await queryRunner.commitTransaction();

      return newUsers;
    } catch (error) {
      //Rollback
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException('Users create failed');
    } finally {
      //Release
      await queryRunner.release();
    }
  }
}
