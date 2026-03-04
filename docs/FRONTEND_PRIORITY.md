# TravelLens - 前端可视化界面优先级

## 🎨 界面开发优先级

### 第一优先级 (Week 1-2) - 核心演示

#### 1. 首页地图 (最高优先级)

**视觉要点**:
- 全屏地图
- 动态标记点 (带呼吸动画)
- 底部横向滚动卡片
- 顶部搜索栏

**技术实现**:
```tsx
// 使用 Leaflet + React
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

<MapContainer center={[39.9, 116.4]} zoom={12}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {spots.map(spot => (
    <Marker position={[spot.lat, spot.lng]} />
  ))}
</MapContainer>
```

---

#### 2. 盲盒功能 (核心亮点)

**视觉要点**:
- 悬浮按钮 (渐变色 + 阴影)
- 全屏弹窗 (黑色半透明背景)
- 3D 盲盒旋转 (Framer Motion)
- 卡片翻转揭晓

**动画时序**:
```
0s: 点击按钮
0-3s: 盲盒旋转 + "正在寻找..."
3-4s: 盲盒打开动画
4s: 卡片飞出 + 翻转
5s: 展示结果
```

---

### 第二优先级 (Week 3) - 详情页

#### 3. 景点详情页

**视觉要点**:
- 顶部大图轮播
- Tab 切换 (概览/机位/美食)
- 机位卡片 (图片 + 时间 + 建议)
- 底部操作栏

---

### 第三优先级 (Week 4) - 社区

#### 4. 社区瀑布流

**视觉要点**:
- 双列布局
- 图片懒加载
- 点赞动画
- 下拉刷新

---

## 🎯 设计规范

### 颜色系统

```css
/* 主色调 */
--primary: #14B8A6;      /* 青色 */
--secondary: #A855F7;    /* 紫色 */
--accent: #EC4899;       /* 粉色 */

/* 中性色 */
--gray-50: #F9FAFB;
--gray-800: #1F2937;

/* 渐变 */
--gradient-primary: linear-gradient(135deg, #14B8A6 0%, #0891B2 100%);
--gradient-blind-box: linear-gradient(135deg, #A855F7 0%, #EC4899 100%);
```

### 字体系统

```css
/* 标题 */
font-family: 'Inter', sans-serif;
font-weight: 700;

/* 正文 */
font-family: 'Inter', sans-serif;
font-weight: 400;
```

### 圆角规范

```css
--radius-sm: 8px;   /* 按钮 */
--radius-md: 16px;  /* 卡片 */
--radius-lg: 24px;  /* 弹窗 */
--radius-xl: 32px;  /* 大卡片 */
```
