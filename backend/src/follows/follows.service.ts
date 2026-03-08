import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { Notification } from '../notifications/notification.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async follow(followerId: string, followingId: string) {
    const existing = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    if (existing) return existing;

    const follow = this.followRepository.create({ followerId, followingId });
    const saved = await this.followRepository.save(follow);

    // 写通知
    const notification = this.notificationRepository.create({
      userId: followingId,
      type: 'follow',
      fromUserId: followerId,
      postId: null,
    });
    await this.notificationRepository.save(notification);

    return saved;
  }

  async unfollow(followerId: string, followingId: string) {
    await this.followRepository.delete({ followerId, followingId });
    return { success: true };
  }

  async isFollowing(followerId: string, followingId: string) {
    const existing = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    return { isFollowing: !!existing };
  }

  async getFollowers(userId: string) {
    const follows = await this.followRepository.find({
      where: { followingId: userId },
    });
    return Promise.all(
      follows.map(async (f) => {
        const user = await this.userRepository.findOne({ where: { id: f.followerId } });
        return { id: f.followerId, username: user?.username, avatar: user?.avatar };
      }),
    );
  }

  async getFollowing(userId: string) {
    const follows = await this.followRepository.find({
      where: { followerId: userId },
    });
    return Promise.all(
      follows.map(async (f) => {
        const user = await this.userRepository.findOne({ where: { id: f.followingId } });
        return { id: f.followingId, username: user?.username, avatar: user?.avatar };
      }),
    );
  }

  async getCount(userId: string) {
    const following = await this.followRepository.count({ where: { followerId: userId } });
    const followers = await this.followRepository.count({ where: { followingId: userId } });
    return { following, followers };
  }
}
