import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
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
}
