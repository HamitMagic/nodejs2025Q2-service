import { Album } from 'src/resources/albums/entities/album.entity';
import { Artist } from 'src/resources/artists/entities/artist.entity';
import { Track } from 'src/resources/tracks/entities/track.entity';
import { Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'favs' })
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Artist)
  @JoinTable()
  artists: string[];

  @ManyToMany(() => Album)
  @JoinTable()
  albums: string[];

  @ManyToMany(() => Track)
  @JoinTable()
  tracks: string[];
}
