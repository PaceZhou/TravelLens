import { API_URL } from './config';

export const tagsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/tags`)
    return res.json()
  },
}
