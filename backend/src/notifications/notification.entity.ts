import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // 接收通知的用户

  @Column()
  type: string; // 'like', 'comment', 'message'

  @Column()
  fromUserId: string; // 发送通知的用户

  @Column({ nullable: true })
  postId: string; // 相关帖子ID

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
