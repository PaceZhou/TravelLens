const API_URL = 'http://192.168.2.33:3001';

export const commentsAPI = {
  create: async (data: { postId: string; userId: string; content: string; replyToUserId?: string; replyToUsername?: string }) => {
    const res = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getByPostId: async (postId: string) => {
    const res = await fetch(`${API_URL}/comments/post/${postId}`);
    return res.json();
  },
};
