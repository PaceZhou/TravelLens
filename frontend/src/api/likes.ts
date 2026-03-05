const API_URL = 'http://192.168.2.33:3001'

export const likesAPI = {
  toggle: async (userId: string, postId: string) => {
    const res = await fetch(`${API_URL}/likes/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, postId }),
    })
    return res.json()
  },

  check: async (userId: string, postId: string) => {
    const res = await fetch(`${API_URL}/likes/check/${userId}/${postId}`)
    return res.json()
  },

  getCount: async (postId: string) => {
    const res = await fetch(`${API_URL}/likes/count/${postId}`)
    return res.json()
  },
}
