import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle')
  async toggle(@Body() body: { userId: string; postId: string }) {
    return this.likesService.toggle(body.userId, body.postId);
  }

  @Get('check/:userId/:postId')
  async check(@Param('userId') userId: string, @Param('postId') postId: string) {
    const liked = await this.likesService.isLiked(userId, postId);
    return { liked };
  }

  @Get('count/:postId')
  async count(@Param('postId') postId: string) {
    const count = await this.likesService.getCount(postId);
    return { count };
  }
}
