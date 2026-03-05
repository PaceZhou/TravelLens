import { Controller, Post, Body, Get, Param, Put, Delete, Query } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.postsService.create(body.userId, body);
  }

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = parseInt(page || '1', 10)
    const limitNum = parseInt(limit || '50', 10)
    return this.postsService.findAll(pageNum, limitNum);
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
