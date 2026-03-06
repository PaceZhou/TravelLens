import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './user.entity';
import { Post } from '../posts/post.entity';
import { Like } from '../likes/like.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ username, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new Error('User not found');
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid password');
    
    return { id: user.id, username: user.username };
  }

  async getUserPostsCount(username: string): Promise<number> {
    return this.postRepository.count({ where: { userId: username } });
  }

  async getUserTotalLikes(username: string): Promise<number> {
    const posts = await this.postRepository.find({ where: { userId: username } });
    const postIds = posts.map(p => p.id);
    if (postIds.length === 0) return 0;
    return this.likeRepository.count({ where: { postId: In(postIds) } });
  }

  async updateAvatar(username: string, avatar: string) {
    await this.userRepository.update({ username }, { avatar });
    return { success: true };
  }

  async getUser(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
}
