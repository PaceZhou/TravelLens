import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { Post } from '../posts/post.entity';
import { NotificationsService } from '../notifications/notifications.service';

/**
 * 评论服务
 * 负责评论的创建、查询和通知
 */
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * 创建评论
   * @param data 评论数据（userId, postId, content）
   * @returns 创建的评论对象
   */
  async create(data: any) {
    const comment = this.commentsRepository.create(data);
    const savedComment = await this.commentsRepository.save(comment);
    
    // 创建评论通知（不给自己发通知）
    const post = await this.postsRepository.findOne({ where: { id: data.postId } });
    if (post && post.userId !== data.userId) {
      await this.notificationsService.create({
        userId: post.userId,
        type: 'comment',
        fromUserId: data.userId,
        postId: data.postId,
      });
    }
    
    return savedComment;
  }

  /**
   * 根据帖子ID查询评论列表
   * @param postId 帖子ID
   * @returns 评论列表（包含用户信息）
   */
  async findByPostId(postId: string) {
    return this.commentsRepository.find({
      where: { postId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * 统计帖子评论数量
   * @param postId 帖子ID
   * @returns 评论数量
   */
  async getCount(postId: string) {
    return this.commentsRepository.count({ where: { postId } });
  }
}
