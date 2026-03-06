import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { Post } from '../posts/post.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private notificationsService: NotificationsService,
  ) {}

  async toggle(userId: string, postId: string) {
    const existing = await this.likesRepository.findOne({
      where: { userId, postId },
    });

    if (existing) {
      await this.likesRepository.remove(existing);
      return { liked: false };
    } else {
      const like = this.likesRepository.create({ userId, postId });
      await this.likesRepository.save(like);
      
      // 创建点赞通知
      const post = await this.postsRepository.findOne({ where: { id: postId } });
      if (post && post.userId !== userId) {
        await this.notificationsService.create({
          userId: post.userId,
          type: 'like',
          fromUserId: userId,
          postId: postId,
        });
      }
      
      return { liked: true };
    }
  }

  async isLiked(userId: string, postId: string) {
    const like = await this.likesRepository.findOne({
      where: { userId, postId },
    });
    return !!like;
  }

  async getCount(postId: string) {
    return this.likesRepository.count({ where: { postId } });
  }
}
