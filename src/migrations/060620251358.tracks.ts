import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTracks060620251358 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.createTable(
      new Table({
        name: 'track',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'artistId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'albumId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'duration',
            type: 'integer',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'track',
      new TableForeignKey({
        columnNames: ['artistId'],
        referencedTableName: 'artists',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'track',
      new TableForeignKey({
        columnNames: ['albumId'],
        referencedTableName: 'albums',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('track');

    const fkArtist = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('artistId') !== -1,
    );
    if (fkArtist) {
      await queryRunner.dropForeignKey('track', fkArtist);
    }
    const fkAlbum = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('albumId') !== -1,
    );
    if (fkAlbum) {
      await queryRunner.dropForeignKey('track', fkAlbum);
    }

    await queryRunner.dropTable('track');
  }
}
