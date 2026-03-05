const API_URL = 'http://192.168.2.33:3001'

export const collectionsAPI = {
  toggle: async (userId: string, postId: string) => {
    const res = await fetch(`${API_URL}/collections/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, postId }),
    })
    return res.json()
  },

  check: async (userId: string, postId: string) => {
    const res = await fetch(`${API_URL}/collections/check/${userId}/${postId}`)
    return res.json()
  },

  getUserCollections: async (userId: string) => {
    const res = await fetch(`${API_URL}/collections/user/${userId}`)
    return res.json()
  },
}
