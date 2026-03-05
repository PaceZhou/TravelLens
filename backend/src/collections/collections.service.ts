import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>,
  ) {}

  async toggle(userId: string, postId: string) {
    const existing = await this.collectionsRepository.findOne({
      where: { userId, postId },
    });

    if (existing) {
      await this.collectionsRepository.remove(existing);
      return { collected: false };
    } else {
      const collection = this.collectionsRepository.create({ userId, postId });
      await this.collectionsRepository.save(collection);
      return { collected: true };
    }
  }

  async isCollected(userId: string, postId: string) {
    const collection = await this.collectionsRepository.findOne({
      where: { userId, postId },
    });
    return !!collection;
  }

  async getUserCollections(userId: string) {
    return this.collectionsRepository.find({
      where: { userId },
      relations: ['post', 'post.user'],
      order: { createdAt: 'DESC' },
    });
  }
}
