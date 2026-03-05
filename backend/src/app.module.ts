import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';

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
  ],
})
export class AppModule {}
