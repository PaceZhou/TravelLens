import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  // 增加请求体大小限制（支持图片上传）
  app.use(require('express').json({ limit: '50mb' }));
  app.use(require('express').urlencoded({ limit: '50mb', extended: true }));
  
  await app.listen(3001, '0.0.0.0');
  console.log('🥭 MangoGo Backend running on http://0.0.0.0:3001');
}
bootstrap();
