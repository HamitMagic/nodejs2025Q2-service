import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'postgres',
  autoLoadEntities: true,
  synchronize: !!process.env.DATABASE_SYNCHRONIZE,
  entities: ['src/resources/**/*.entity.ts'],
  migrationsRun: !process.env.DATABASE_SYNCHRONIZE,
  migrations: ['src/migrations/*.ts'],
});
