import { API_URL } from './config';

export const messagesAPI = {
  send: (senderId: string, receiverId: string, content: string) =>
    fetch(`${API_URL}/messages/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, receiverId, content }),
    }).then(res => res.json()),

  getConversations: (userId: string) =>
    fetch(`${API_URL}/messages/conversations/${userId}`).then(res => res.json()),

  getThread: (userId: string, partnerId: string) =>
    fetch(`${API_URL}/messages/thread/${userId}/${partnerId}`).then(res => res.json()),

  markAsRead: (userId: string, partnerId: string) =>
    fetch(`${API_URL}/messages/read/${userId}/${partnerId}`, { method: 'PATCH' }).then(res => res.json()),

  getUnreadCount: (userId: string): Promise<number> =>
    fetch(`${API_URL}/messages/unread-count/${userId}`).then(res => res.json()),
};
