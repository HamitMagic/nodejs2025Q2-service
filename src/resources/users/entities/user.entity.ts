import { Favorite } from 'src/resources/favorites/entities/favorite.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  version: number;

  @CreateDateColumn({ type: 'timestamp', name: 'createdAt' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'updatedAt' })
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  favId: string | null;

  @OneToOne(() => Favorite, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'favId' })
  favorite: Favorite | null;
}
