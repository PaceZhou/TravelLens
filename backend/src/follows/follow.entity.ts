import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('follows')
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  followerId: string;

  @Column()
  followingId: string;

  @CreateDateColumn()
  createdAt: Date;
}
