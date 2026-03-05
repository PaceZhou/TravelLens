import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/user.entity';
import { Post } from '../posts/post.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string;

  @Column()
  userId: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  replyToUserId: string;

  @Column({ nullable: true })
  replyToUsername: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'postId' })
  post: Post;
}
