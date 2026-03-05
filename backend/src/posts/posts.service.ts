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

  async findAll(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit
    const [posts, total] = await this.postsRepository.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    
    // 统计每个帖子的真实点赞数
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await this.postsRepository.query(
          'SELECT COUNT(*) as count FROM likes WHERE postId = ?',
          [post.id]
        );
        return {
          ...post,
          likes: parseInt(likeCount[0].count) || 0,
        };
      })
    );
    
    return {
      posts: postsWithLikes,
      total,
      page,
      limit,
      hasMore: skip + posts.length < total,
    };
  }

  async like(postId: string) {
    await this.postsRepository.increment({ id: postId }, 'likes', 1);
    return this.postsRepository.findOne({ where: { id: postId } });
  }

  async delete(postId: string) {
    await this.postsRepository.delete(postId);
    return { success: true };
  }

  async update(postId: string, data: any) {
    await this.postsRepository.update(postId, {
      content: data.content,
      images: data.images,
      tags: data.tags,
    });
    return this.postsRepository.findOne({ where: { id: postId } });
  }
}
