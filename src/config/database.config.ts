import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'asdffdsa',
  database: process.env.DATABASE_DBNAME || 'nest_app',
  // entities: [User, Post, Tag],
  autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
}));
