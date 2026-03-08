import { API_URL } from './config';

export const followsAPI = {
  follow: (followerId: string, followingId: string) =>
    fetch(`${API_URL}/follows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerId, followingId }),
    }).then(res => res.json()),

  unfollow: (followerId: string, followingId: string) =>
    fetch(`${API_URL}/follows/${followerId}/${followingId}`, { method: 'DELETE' }).then(res => res.json()),

  isFollowing: (followerId: string, followingId: string): Promise<{ isFollowing: boolean }> =>
    fetch(`${API_URL}/follows/status/${followerId}/${followingId}`).then(res => res.json()),

  getFollowers: (userId: string) =>
    fetch(`${API_URL}/follows/followers/${userId}`).then(res => res.json()),

  getFollowing: (userId: string) =>
    fetch(`${API_URL}/follows/following/${userId}`).then(res => res.json()),

  getCount: (userId: string): Promise<{ following: number; followers: number }> =>
    fetch(`${API_URL}/follows/count/${userId}`).then(res => res.json()),
};
