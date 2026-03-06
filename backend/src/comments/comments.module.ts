import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Post } from '../posts/post.entity';
import { NotificationsModule } from '../notifications/notifications.module';

/**
 * 评论模块
 * 独立管理评论相关功能
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post]),
    NotificationsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
