import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { Post } from '../posts/post.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(data: any) {
    const notification = this.notificationsRepository.create(data);
    return this.notificationsRepository.save(notification);
  }

  async getLikeNotifications(userId: string) {
    const notifications = await this.notificationsRepository
      .createQueryBuilder('n')
      .where('n.userId = :userId', { userId })
      .andWhere('n.type = :type', { type: 'like' })
      .orderBy('n.createdAt', 'DESC')
      .getMany();

    // 按postId分组合并
    const grouped = {};
    for (const n of notifications) {
      if (!grouped[n.postId]) {
        const post = await this.postsRepository.findOne({ where: { id: n.postId } });
        grouped[n.postId] = {
          postId: n.postId,
          count: 0,
          latestAt: n.createdAt,
          post: post,
        };
      }
      grouped[n.postId].count++;
    }

    return Object.values(grouped);
  }

  async getByUser(userId: string, type?: string) {
    const query = this.notificationsRepository
      .createQueryBuilder('n')
      .where('n.userId = :userId', { userId })
      .orderBy('n.createdAt', 'DESC');
    
    if (type) {
      query.andWhere('n.type = :type', { type });
    }
    
    return query.getMany();
  }
}
