import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { MangoMomentsService } from './mango-moments.service';

@Controller('mango-moments')
export class MangoMomentsController {
  constructor(private readonly mangoMomentsService: MangoMomentsService) {}

  @Post()
  create(@Body() body: any) {
    return this.mangoMomentsService.create(body.userId, body);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.mangoMomentsService.findByUser(userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.mangoMomentsService.delete(id);
  }
}
