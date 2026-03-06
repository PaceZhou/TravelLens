import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MangoMoment } from './mango-moment.entity';

@Injectable()
export class MangoMomentsService {
  constructor(
    @InjectRepository(MangoMoment)
    private mangoMomentsRepository: Repository<MangoMoment>,
  ) {}

  async create(userId: string, data: any) {
    const moment = this.mangoMomentsRepository.create({ userId, ...data });
    return this.mangoMomentsRepository.save(moment);
  }

  async findByUser(userId: string) {
    return this.mangoMomentsRepository.find({ 
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async delete(id: string) {
    await this.mangoMomentsRepository.delete(id);
    return { success: true };
  }
}
