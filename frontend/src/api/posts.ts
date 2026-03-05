const API_URL = 'http://192.168.2.33:3001';

export const postsAPI = {
  create: async (userId: string, data: any) => {
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...data }),
    });
    return res.json();
  },

  getAll: async () => {
    const res = await fetch(`${API_URL}/posts`);
    return res.json();
  },

  like: async (postId: string) => {
    const res = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'PUT',
    });
    return res.json();
  },
};
