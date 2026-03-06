import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

/**
 * 评论控制器
 * 处理评论相关的HTTP请求
 */
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  /**
   * 创建评论
   * POST /comments
   * Body: { userId, postId, content }
   */
  @Post()
  async create(@Body() body: any) {
    return this.commentsService.create(body);
  }

  /**
   * 获取帖子的评论列表
   * GET /comments/post/:postId
   */
  @Get('post/:postId')
  async findByPostId(@Param('postId') postId: string) {
    return this.commentsService.findByPostId(postId);
  }

  /**
   * 获取帖子的评论数量
   * GET /comments/count/:postId
   */
  @Get('count/:postId')
  async getCount(@Param('postId') postId: string) {
    return this.commentsService.getCount(postId);
  }
}
