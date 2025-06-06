import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'favorites' })
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'simple-array', default: '{}' })
  artists: string[];

  @Column({ type: 'simple-array', default: '{}' })
  albums: string[];

  @Column({ type: 'simple-array', default: '{}' })
  tracks: string[];
}
