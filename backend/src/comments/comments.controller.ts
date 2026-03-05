import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.commentsService.create(body);
  }

  @Get('post/:postId')
  async findByPostId(@Param('postId') postId: string) {
    return this.commentsService.findByPostId(postId);
  }
}
