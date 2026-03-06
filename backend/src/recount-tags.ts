import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TagsService } from './tags/tags.service';
import { PostsService } from './posts/posts.service';

async function recountTags() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tagsService = app.get(TagsService);
  const postsService = app.get(PostsService);

  console.log('开始重新统计标签...');
  
  // 重置所有标签计数为0
  const allTags = await tagsService.findAll();
  for (const tag of allTags) {
    await tagsService['tagsRepository'].update(tag.id, { count: 0 });
  }
  console.log('✓ 已重置所有标签计数');

  // 统计所有帖子的标签
  const { posts } = await postsService.findAll(1, 10000);
  for (const post of posts) {
    if (post.tags && Array.isArray(post.tags)) {
      for (const tagName of post.tags) {
        await tagsService.incrementCount(tagName);
      }
    }
  }

  console.log(`✅ 完成！共统计 ${posts.length} 个帖子的标签`);
  await app.close();
}

recountTags().catch(err => {
  console.error('统计失败:', err);
  process.exit(1);
});
