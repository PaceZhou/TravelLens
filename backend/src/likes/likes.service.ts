import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './like.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async toggle(userId: string, postId: string) {
    const existing = await this.likesRepository.findOne({
      where: { userId, postId },
    });

    if (existing) {
      await this.likesRepository.remove(existing);
      return { liked: false };
    } else {
      const like = this.likesRepository.create({ userId, postId });
      await this.likesRepository.save(like);
      return { liked: true };
    }
  }

  async isLiked(userId: string, postId: string) {
    const like = await this.likesRepository.findOne({
      where: { userId, postId },
    });
    return !!like;
  }

  async getCount(postId: string) {
    return this.likesRepository.count({ where: { postId } });
  }
}
