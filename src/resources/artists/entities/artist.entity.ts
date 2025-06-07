import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'artist' })
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: false })
  grammy: boolean;
}
