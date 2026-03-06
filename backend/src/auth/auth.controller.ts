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
    // 获取用户的帖子数
    const posts = await this.authService.getUserPostsCount(username);
    
    // 获取用户的总点赞数
    const likes = await this.authService.getUserTotalLikes(username);
    
    return {
      posts,
      following: 0,
      followers: 0,
      likes
    };
  }
}
