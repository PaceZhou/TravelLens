import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CollectionsService } from './collections.service';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post('toggle')
  async toggle(@Body() body: { userId: string; postId: string }) {
    return this.collectionsService.toggle(body.userId, body.postId);
  }

  @Get('check/:userId/:postId')
  async check(@Param('userId') userId: string, @Param('postId') postId: string) {
    const collected = await this.collectionsService.isCollected(userId, postId);
    return { collected };
  }

  @Get('user/:userId')
  async getUserCollections(@Param('userId') userId: string) {
    return this.collectionsService.getUserCollections(userId);
  }
}
