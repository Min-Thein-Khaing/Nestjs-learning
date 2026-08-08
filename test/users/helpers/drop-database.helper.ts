import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

export async function dropDatabase(config: ConfigService): Promise<void> {
  const dataSource = await new DataSource({
    type: 'postgres',
    host: config.get<string>('database.host')!,
    port: config.get<number>('database.port')!,
    username: config.get<string>('database.username')!,
    password: config.get<string>('database.password')!,
    database: config.get<string>('database.database')!,

    synchronize: config.get<boolean>('database.synchronize'),
  }).initialize();

  await dataSource.dropDatabase();
  await dataSource.destroy();
}
