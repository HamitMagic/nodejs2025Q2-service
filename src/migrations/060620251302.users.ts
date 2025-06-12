import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers060620251302 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE "user" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "login" VARCHAR NOT NULL,
        "password" VARCHAR NOT NULL,
        "version" INTEGER NOT NULL DEFAULT 1,
        "createdAt" BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::bigint,
        "updatedAt" BIGINT NOT NULL DEFAULT EXTRACT(EPOCH FROM NOW())::bigint,
      );
    `);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
