import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('text')
  content: string;

  @Column('simple-json', { nullable: true })
  images: string[];

  @Column('simple-json', { nullable: true })
  tags: string[];

  @Column({ default: '' })
  location: string;

  @Column({ default: '' })
  city: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  comments: number;

  @CreateDateColumn()
  createdAt: Date;
}
