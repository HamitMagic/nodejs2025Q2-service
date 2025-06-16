import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAlbums060620251341 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE "album" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL,
        "year" INTEGER NOT NULL,
        "artistId" UUID REFERENCES "artist"("id") ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner) {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "album";
    `);
  }
}
