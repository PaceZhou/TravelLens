import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post('send')
  send(@Body() body: { senderId: string; receiverId: string; content: string }) {
    return this.messagesService.send(body.senderId, body.receiverId, body.content);
  }

  @Get('conversations/:userId')
  getConversations(@Param('userId') userId: string) {
    return this.messagesService.getConversations(userId);
  }

  @Get('thread/:userId/:partnerId')
  getThread(@Param('userId') userId: string, @Param('partnerId') partnerId: string) {
    return this.messagesService.getThread(userId, partnerId);
  }

  @Patch('read/:userId/:partnerId')
  markAsRead(@Param('userId') userId: string, @Param('partnerId') partnerId: string) {
    return this.messagesService.markAsRead(userId, partnerId);
  }

  @Get('unread-count/:userId')
  getUnreadCount(@Param('userId') userId: string) {
    return this.messagesService.getUnreadCount(userId);
  }
}
