import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

const environment = process.env.NODE_ENV;
config({
  path: environment ? `.env.${environment}` : '.env',
  quiet: true,
});

// Keep the migration CLI connected to the same database as the Nest app.
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_DBNAME || 'nest_app',

  // Entity Class များကို Direct Import လုပ်ခြင်းက Type Safety အတွက် အကောင်းဆုံးဖြစ်သည်
  // The CLI uses dist/typeorm-cli.config.js, so only load compiled JavaScript.
  entities: [__dirname + '/**/*.entity.js'],
  migrations: [__dirname + '/migrations/*.js'],

  // Development တွင်သာ true ထားရန် (Production တွင် false ထားရမည်)
  synchronize: false,
};

// 2. DataSource instance ဖန်တီးခြင်း (CLI Migration များအတွက် export လုပ်ပေးရန်လိုသည်)
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

//commant npx typeorm migration:generate src/migrations/001-migration -d dist/typeorm-cli.config.js
// npx typeorm migration:run -d dist/typeorm-cli.config.js