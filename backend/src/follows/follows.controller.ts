import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { FollowsService } from './follows.service';

@Controller('follows')
export class FollowsController {
  constructor(private followsService: FollowsService) {}

  @Post()
  follow(@Body() body: { followerId: string; followingId: string }) {
    return this.followsService.follow(body.followerId, body.followingId);
  }

  @Delete(':followerId/:followingId')
  unfollow(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return this.followsService.unfollow(followerId, followingId);
  }

  @Get('status/:followerId/:followingId')
  isFollowing(
    @Param('followerId') followerId: string,
    @Param('followingId') followingId: string,
  ) {
    return this.followsService.isFollowing(followerId, followingId);
  }

  @Get('followers/:userId')
  getFollowers(@Param('userId') userId: string) {
    return this.followsService.getFollowers(userId);
  }

  @Get('following/:userId')
  getFollowing(@Param('userId') userId: string) {
    return this.followsService.getFollowing(userId);
  }

  @Get('count/:userId')
  getCount(@Param('userId') userId: string) {
    return this.followsService.getCount(userId);
  }
}
