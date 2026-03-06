// 动态API地址：支持本地和cloudflared域名
const API_URL = window.location.hostname === 'mangogo.babascart.cc.cd' 
  ? 'https://mangogo.babascart.cc.cd' 
  : 'http://192.168.2.33:3001';

export const authAPI = {
  register: async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Register failed');
    return res.json();
  },

  login: async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
};
