const API_URL = 'http://192.168.2.33:3001'

export const tagsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/tags`)
    return res.json()
  },
}
