import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTracks060620251358 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE "track" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR NOT NULL,
        "year" INTEGER NOT NULL,
        "artistId" UUID REFERENCES "artist"("id") ON DELETE SET NULL,
        "albumId" UUID REFERENCES "album"("id") ON DELETE SET NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "track";
    `);
  }
}
