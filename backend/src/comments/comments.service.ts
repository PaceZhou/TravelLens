import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CommentLike } from './comment-like.entity';
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
    @InjectRepository(CommentLike)
    private commentLikesRepository: Repository<CommentLike>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * 创建评论（Instagram两层结构）
   * @param data 评论数据（userId, postId, content, replyToUsername?, parentCommentId?）
   * @returns 创建的评论对象
   */
  async create(data: any) {
    // 如果是回复评论，自动设置parentCommentId
    if (data.replyToUsername && !data.parentCommentId) {
      // 按「被回复人 username」查找该帖子下其最新一条评论，作为回复目标
      const replyToComment = await this.commentsRepository
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.user', 'user')
        .where('c.postId = :postId', { postId: data.postId })
        .andWhere('user.username = :username', { username: data.replyToUsername })
        .orderBy('c.createdAt', 'DESC')
        .getOne();

      if (replyToComment) {
        // 如果被回复的是二级回复，继承其parentCommentId；否则用其自己的id
        data.parentCommentId = replyToComment.parentCommentId || replyToComment.id;
      }
    }
    
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
   * 根据帖子ID查询评论列表（Instagram排序）
   * 一级评论：按点赞数降序，相同则按时间倒序
   * @param postId 帖子ID
   * @returns 评论列表（包含用户信息）
   */
  async findByPostId(postId: string) {
    const comments = await this.commentsRepository.find({
      where: { postId },
      relations: ['user'],
    });
    
    // 分离一级评论和二级回复
    const rootComments = comments.filter(c => !c.parentCommentId);
    const replies = comments.filter(c => c.parentCommentId);
    
    // 一级评论排序：点赞数降序，相同则按时间倒序
    rootComments.sort((a, b) => {
      if (b.likes !== a.likes) return b.likes - a.likes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    // 返回所有评论（前端会处理二级回复的展示）
    return [...rootComments, ...replies];
  }

  /**
   * 统计帖子评论数量
   * @param postId 帖子ID
   * @returns 评论数量
   */
  async getCount(postId: string) {
    return this.commentsRepository.count({ where: { postId } });
  }

  /**
   * 切换评论点赞状态
   * @param userId 用户ID
   * @param commentId 评论ID
   * @returns 点赞状态
   */
  async toggleLike(userId: string, commentId: string) {
    const existing = await this.commentLikesRepository.findOne({
      where: { userId, commentId }
    });

    if (existing) {
      await this.commentLikesRepository.remove(existing);
      await this.commentsRepository.decrement({ id: commentId }, 'likes', 1);
      return { liked: false };
    } else {
      await this.commentLikesRepository.save({ userId, commentId });
      await this.commentsRepository.increment({ id: commentId }, 'likes', 1);
      return { liked: true };
    }
  }

  /**
   * 检查用户是否点赞了评论
   * @param userId 用户ID
   * @param commentId 评论ID
   * @returns 是否点赞
   */
  async checkLike(userId: string, commentId: string) {
    const like = await this.commentLikesRepository.findOne({
      where: { userId, commentId }
    });
    return !!like;
  }
}
