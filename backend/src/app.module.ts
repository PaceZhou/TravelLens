import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { CollectionsModule } from './collections/collections.module';
import { TagsModule } from './tags/tags.module';
import { MangoMomentsModule } from './mango-moments/mango-moments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FollowsModule } from './follows/follows.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mangogo.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    CollectionsModule,
    TagsModule,
    MangoMomentsModule,
    NotificationsModule,
    FollowsModule,
    MessagesModule,
  ],
})
export class AppModule {}
