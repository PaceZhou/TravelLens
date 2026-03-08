import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { Like } from '../likes/like.entity';
import { Follow } from '../follows/follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Like, Follow])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
