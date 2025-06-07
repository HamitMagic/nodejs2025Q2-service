import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { join } from 'path';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'postgres',
  autoLoadEntities: true,
  synchronize: !!process.env.DATABASE_SYNCHRONIZE,
  entities: [join(__dirname, '..', 'resources', '**', '*.entity.{ts,js}')],
  migrationsRun: !process.env.DATABASE_SYNCHRONIZE,
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
});
