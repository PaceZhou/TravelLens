import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { Notification } from '../notifications/notification.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async send(senderId: string, receiverId: string, content: string) {
    const message = this.messageRepository.create({ senderId, receiverId, content });
    const saved = await this.messageRepository.save(message);

    // 写通知
    const notification = this.notificationRepository.create({
      userId: receiverId,
      type: 'message',
      fromUserId: senderId,
      postId: null,
    });
    await this.notificationRepository.save(notification);

    return saved;
  }

  async getConversations(userId: string) {
    // 取所有与该用户相关的消息
    const messages = await this.messageRepository
      .createQueryBuilder('m')
      .where('m.senderId = :userId OR m.receiverId = :userId', { userId })
      .orderBy('m.createdAt', 'DESC')
      .getMany();

    // 按对话伙伴聚合
    const convMap = new Map<string, any>();
    for (const msg of messages) {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!convMap.has(partnerId)) {
        const partner = await this.userRepository.findOne({ where: { id: partnerId } });
        convMap.set(partnerId, {
          partnerId,
          partnerUsername: partner?.username,
          partnerAvatar: partner?.avatar,
          lastMessage: msg.content,
          lastTime: msg.createdAt,
          unreadCount: 0,
        });
      }
      // 统计未读（对方发给我，未读）
      if (msg.receiverId === userId && !msg.isRead) {
        convMap.get(partnerId).unreadCount++;
      }
    }

    return Array.from(convMap.values());
  }

  async getThread(userId: string, partnerId: string) {
    return this.messageRepository
      .createQueryBuilder('m')
      .where(
        '(m.senderId = :userId AND m.receiverId = :partnerId) OR (m.senderId = :partnerId AND m.receiverId = :userId)',
        { userId, partnerId },
      )
      .orderBy('m.createdAt', 'ASC')
      .getMany();
  }

  async markAsRead(userId: string, partnerId: string) {
    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ isRead: true })
      .where('receiverId = :userId AND senderId = :partnerId', { userId, partnerId })
      .execute();
    return { success: true };
  }

  async getUnreadCount(userId: string) {
    return this.messageRepository.count({
      where: { receiverId: userId, isRead: false },
    });
  }
}
