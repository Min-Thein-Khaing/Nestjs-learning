import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { UserCreateProvider } from './user-create.provider';
import { DataSource, ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { HashingProvider } from 'src/auth/provider/hashing.provider';
import { MailService } from 'src/mail/providers/mail.service';

//user or post or product
type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockUserProvider = <
  T extends ObjectLiteral = any,
>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const createUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'h9M4y@example.com',
  password: 'password',
};
describe('UserCreateProvider', () => {
  let provider: UserCreateProvider;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCreateProvider,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockUserProvider(),
        },
        {
          provide: HashingProvider,
          useValue: { hashPassword: jest.fn(() => createUser.password) },
        },
        {
          provide: MailService,
          useValue: { sendWelcomeMail: jest.fn(() => Promise.resolve()) },
        },
      ],
    }).compile();

    provider = module.get<UserCreateProvider>(UserCreateProvider);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });
  it('UserCreateProvider should be defined', () => {
    expect(provider).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    describe('when the user does not already exist', () => {
      it('should create and return the user', async () => {
        userRepository.findOne?.mockReturnValue(null);
        userRepository.create?.mockReturnValue(createUser);
        userRepository.save?.mockReturnValue(createUser);

        const newUser = await provider.create(createUser);

        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { email: createUser.email },
        });
        expect(userRepository.create).toHaveBeenCalledWith({
          ...createUser,
          password: createUser.password,
        });
        expect(userRepository.save).toHaveBeenCalledWith(createUser);
        expect(newUser).toEqual(createUser);
      });
    });

    describe('when the user already exists', () => {
      it('should throw a ConflictException', async () => {
        userRepository.findOne?.mockReturnValue(createUser);

        await expect(provider.create(createUser)).rejects.toThrow(
          'Email already exists',
        );
        expect(userRepository.create).not.toHaveBeenCalled();
        expect(userRepository.save).not.toHaveBeenCalled();
      });
    });
  });
});
