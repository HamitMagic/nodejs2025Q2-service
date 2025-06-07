import { Album } from 'src/resources/albums/entities/album.entity';
import { Artist } from 'src/resources/artists/entities/artist.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'track' })
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'uuid', nullable: true })
  artistId: string | null; // refers to Artist

  @Column({ type: 'uuid', nullable: true })
  albumId: string | null; // refers to Album

  @Column()
  duration: number;

  @ManyToOne(() => Artist, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist | null;

  @ManyToOne(() => Album, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'albumId' })
  album: Album | null;
}
