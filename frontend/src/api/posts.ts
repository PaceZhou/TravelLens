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

  getAll: async (page: number = 1, limit: number = 50) => {
    const res = await fetch(`${API_URL}/posts?page=${page}&limit=${limit}`);
    return res.json();
  },

  like: async (postId: string) => {
    const res = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'PUT',
    });
    return res.json();
  },

  delete: async (postId: string) => {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  update: async (postId: string, data: any) => {
    const res = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
