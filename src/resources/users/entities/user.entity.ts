import { Favorite } from "src/resources/favorites/entities/favorite.entity";
import { Column, CreateDateColumn, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column()
  version: number;

  @CreateDateColumn({ type: 'timestamp', name: 'createdAt' })
  createdAt: number;

  @CreateDateColumn({ type: 'timestamp', name: 'updatedAt' })
  updatedAt: number;

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
