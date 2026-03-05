import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(userId: string, data: any) {
    const post = this.postsRepository.create({
      userId,
      content: data.content,
      images: data.images || [],
      tags: data.tags || [],
      location: data.location || '',
      city: data.city || '',
    });
    return this.postsRepository.save(post);
  }

  async findAll() {
    return this.postsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async like(postId: string) {
    await this.postsRepository.increment({ id: postId }, 'likes', 1);
    return this.postsRepository.findOne({ where: { id: postId } });
  }
}
