import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    return this.authService.register(body.username, body.password);
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Get('stats/:username')
  async getStats(@Param('username') username: string) {
    const posts = await this.authService.getUserPostsCount(username);
    const likes = await this.authService.getUserTotalLikes(username);
    const { following, followers } = await this.authService.getFollowCount(username);

    return { posts, following, followers, likes };
  }

  @Post('avatar')
  async updateAvatar(@Body() body: { username: string; avatar: string }) {
    return this.authService.updateAvatar(body.username, body.avatar);
  }

  @Get('user/:username')
  async getUser(@Param('username') username: string) {
    return this.authService.getUser(username);
  }
}
