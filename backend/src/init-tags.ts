import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TagsService } from './tags/tags.service';
import { travelTags } from './tags/travel-tags';

async function initTags() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tagsService = app.get(TagsService);

  console.log('开始初始化标签...');
  
  for (const tagName of travelTags) {
    await tagsService.incrementCount(tagName);
    console.log(`✓ ${tagName}`);
  }

  console.log(`\n✅ 成功初始化 ${travelTags.length} 个标签！`);
  await app.close();
}

initTags().catch(err => {
  console.error('初始化失败:', err);
  process.exit(1);
});
