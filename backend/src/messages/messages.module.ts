import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Notification } from '../notifications/notification.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Notification, User])],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
