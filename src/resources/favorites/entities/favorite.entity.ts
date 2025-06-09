import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'favs' })
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { array: true, default: [] })
  artists: string[];

  @Column('uuid', { array: true, default: [] })
  albums: string[];

  @Column('uuid', { array: true, default: [] })
  tracks: string[];
}
