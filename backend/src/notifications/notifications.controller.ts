import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() body: any) {
    return this.notificationsService.create(body);
  }

  @Get('likes/:userId')
  getLikeNotifications(@Param('userId') userId: string) {
    return this.notificationsService.getLikeNotifications(userId);
  }

  @Get('unread/:userId')
  getUnreadCount(@Param('userId') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Get('comments/:userId')
  getCommentNotifications(@Param('userId') userId: string) {
    return this.notificationsService.getCommentNotifications(userId);
  }

  @Put('read-all/:userId')
  markAllRead(@Param('userId') userId: string) {
    return this.notificationsService.markAllRead(userId);
  }

  @Get(':userId')
  getByUser(@Param('userId') userId: string) {
    return this.notificationsService.getByUser(userId);
  }
}
