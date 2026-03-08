import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from './follow.entity';
import { FollowsController } from './follows.controller';
import { FollowsService } from './follows.service';
import { Notification } from '../notifications/notification.entity';
import { User } from '../auth/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, Notification, User])],
  controllers: [FollowsController],
  providers: [FollowsService],
  exports: [FollowsService],
})
export class FollowsModule {}
