import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { UserCreateProvider } from './user-create.provider';
import { EmailFindByUserProvider } from './email_find_by_user.provider';
import { FindByGoogleId } from './find-by-google-id';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateUserDto } from '../dtos/create.user.dto';

describe('UserService', () => {
  let service: UsersService;
  beforeEach(async () => {
    const mockUserCreateProvider: Partial<UserCreateProvider> = {
      create: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password,
        }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        // TypeORM ရဲ့ DataSource နဲ့ getRepositoryToken အစား PrismaService ကို Mock ပေးရပါမယ်
        // { provide: PrismaService, useValue: mockPrismaService },
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: UsersCreateManyProvider, useValue: {} },
        { provide: UserCreateProvider, useValue: mockUserCreateProvider },
        { provide: EmailFindByUserProvider, useValue: {} },
        { provide: FindByGoogleId, useValue: {} },
        { provide: CreateGoogleUserProvider, useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });
  it('UserService should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a user', async () => {
    const user = await service.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'h9M4y@example.com',
      password: 'password',
    });
    expect(user).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      email: 'h9M4y@example.com',
      password: 'password',
    });
  });
});
