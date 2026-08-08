import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { appCreate } from 'src/app.create';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/providers/mail.service';
import { dropDatabase } from './helpers/drop-database.helper';
import {
  missingEmail,
  missingFirstName,
  missingPassword,
  validFullUser,
} from './user.post.e2e-soec.sample-data';

describe('[Users]  @Post Endpoints', () => {
  let app: INestApplication<App>;
  let config: ConfigService;
  let httpServer: App;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue({
        sendWelcomeMail: jest.fn().mockResolvedValue(undefined),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    config = app.get<ConfigService>(ConfigService);
    appCreate(app);
    httpServer = app.getHttpServer();
    await app.init();
  });

  //testing .env file
  // it('debug: env check', () => {
  //   console.log('ENV:', process.env.NODE_ENV);
  // });
  // it('debug: database_name', () => {
  //   console.log('Database Name:', config.get('database.database'));
  // });

  it('/users - firstName is required', () => {
    return request(httpServer)
      .post('/users')
      .send(missingFirstName)
      .expect(400);
  });
  it('/users - email is required', () => {
    return request(httpServer).post('/users').send(missingEmail).expect(400);
  });
  it('/users - password is required', () => {
    return request(httpServer).post('/users').send(missingPassword).expect(400);
  });
  it('/users - valid data inputs successfully create a user', async () => {
    return request(httpServer)
      .post('/users')
      .send(validFullUser)
      .expect(201)
      .then((response) => {
        const responseBody = response.body.data;
        expect(responseBody).toHaveProperty(
          'firstName',
          validFullUser.firstName,
        );
        expect(responseBody).toHaveProperty('lastName', validFullUser.lastName);
        expect(responseBody).toHaveProperty('email', validFullUser.email);
      });
  });
  it('/users - password is not returned in response', async () => {
    return request(httpServer)
      .post('/users')
      .send(validFullUser)
      .expect(201)
      .then((response) => {
        const responseBody = response.body.data;
        expect(responseBody).toHaveProperty(
          'firstName',
          validFullUser.firstName,
        );
        expect(responseBody).toHaveProperty('lastName', validFullUser.lastName);
        expect(responseBody).toHaveProperty('email', validFullUser.email);
        expect(responseBody).not.toHaveProperty('password');
      });
  });

  it('/users - googleId is not returned in response', async () => {
    return request(httpServer)
      .post('/users')
      .send(validFullUser)
      .expect(201)
      .then((response) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const responseBody = response.body.data;
        expect(responseBody).toHaveProperty(
          'firstName',
          validFullUser.firstName,
        );
        expect(responseBody).toHaveProperty('lastName', validFullUser.lastName);
        expect(responseBody).toHaveProperty('email', validFullUser.email);
        expect(responseBody).not.toHaveProperty('password');
        expect(responseBody).not.toHaveProperty('googleId');
      });
  });

  afterEach(async () => {
    await dropDatabase(config);
    await app.close();
  });
});
