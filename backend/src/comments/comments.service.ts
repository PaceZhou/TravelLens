import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(data: any) {
    const comment = this.commentsRepository.create(data);
    return this.commentsRepository.save(comment);
  }

  async findByPostId(postId: string) {
    return this.commentsRepository.find({
      where: { postId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }
}
