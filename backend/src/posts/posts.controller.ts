import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.postsService.create(body.userId, body);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Put(':id/like')
  async like(@Param('id') id: string) {
    return this.postsService.like(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.postsService.delete(id);
  }
}
