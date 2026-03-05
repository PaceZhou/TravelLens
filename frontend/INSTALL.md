# 🚀 TravelLens 本地运行指南

## 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

---

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/PaceZhou/TravelLens.git
cd TravelLens/frontend
```

### 2. 安装依赖

```bash
npm install
```

这会自动安装：
- React 18
- Tailwind CSS
- Lucide React (图标)
- Leaflet (地图)
- Framer Motion (动画)

### 3. 启动开发服务器

```bash
npm run dev
```

访问: http://localhost:5173

---

## 功能预览

- 🎁 **盲盒抽卡** - 点击 DRAW 按钮体验
- 🗺️ **地图探索** - 查看北京景点
- 📍 **距离计算** - 实时显示距离

---

## 故障排除

### 样式不显示？
确保 Tailwind CSS 已正确配置：
- `tailwind.config.js` 存在
- `postcss.config.js` 存在
- `src/index.css` 包含 Tailwind 指令

### 图标不显示？
```bash
npm install lucide-react
```

---

老板，现在项目可以完美运行了！✅
