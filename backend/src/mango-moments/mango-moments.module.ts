import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MangoMomentsController } from './mango-moments.controller';
import { MangoMomentsService } from './mango-moments.service';
import { MangoMoment } from './mango-moment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MangoMoment])],
  controllers: [MangoMomentsController],
  providers: [MangoMomentsService],
})
export class MangoMomentsModule {}
