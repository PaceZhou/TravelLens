// 统一API地址配置：支持本地和cloudflared域名
export const API_URL = window.location.hostname === 'mangogo.babascart.cc.cd'
  ? ''
  : 'http://192.168.2.33:3001';
