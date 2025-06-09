import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFavorites060620251405 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE "favs" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4()
      );

      CREATE TABLE "favs_artists_artist" (
        "favsId" UUID REFERENCES "favs"("id") ON DELETE CASCADE,
        "artistId" UUID REFERENCES "artist"("id") ON DELETE CASCADE,
        PRIMARY KEY ("favsId", "artistId")
      );

      CREATE TABLE "favs_albums_album" (
        "favsId" UUID REFERENCES "favs"("id") ON DELETE CASCADE,
        "albumId" UUID REFERENCES "album"("id") ON DELETE CASCADE,
        PRIMARY KEY ("favsId", "albumId")
      );

      CREATE TABLE "favs_tracks_track" (
        "favsId" UUID REFERENCES "favs"("id") ON DELETE CASCADE,
        "trackId" UUID REFERENCES "track"("id") ON DELETE CASCADE,
        PRIMARY KEY ("favsId", "trackId")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS "favs_tracks_track";
      DROP TABLE IF EXISTS "favs_albums_album";
      DROP TABLE IF EXISTS "favs_artists_artist";
      DROP TABLE IF EXISTS "favs";
    `);
  }
}
