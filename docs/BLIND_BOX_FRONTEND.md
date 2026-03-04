# 旅行盲盒 - 前端实现方案

## 一、UI/UX 设计

### 1.1 入口设计

**位置**: 首页地图右下角悬浮按钮

```tsx
// 盲盒按钮
<button className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl">
  <Gift className="w-8 h-8 text-white animate-bounce" />
</button>
```

---

### 1.2 抽取动画流程

**Step 1**: 点击按钮 → 全屏弹窗  
**Step 2**: 3D 盲盒旋转动画 (3秒)  
**Step 3**: 盲盒打开，卡片飞出  
**Step 4**: 展示目的地详情

---

## 二、核心组件实现

### 2.1 BlindBoxModal.tsx

```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlindBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BlindBoxModal = ({ isOpen, onClose }: BlindBoxModalProps) => {
  const [stage, setStage] = useState<'idle' | 'drawing' | 'result'>('idle');
  const [result, setResult] = useState<Spot | null>(null);

  const handleDraw = async () => {
    setStage('drawing');
    
    // 调用盲盒 API
    const response = await fetch('/api/v1/blind-box/draw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        location: userLocation
      })
    });
    
    const data = await response.json();
    
    // 等待动画完成
    setTimeout(() => {
      setResult(data.spot);
      setStage('result');
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
        >
          {stage === 'idle' && <IdleView onDraw={handleDraw} />}
          {stage === 'drawing' && <DrawingAnimation />}
          {stage === 'result' && <ResultView spot={result} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

---

### 2.2 DrawingAnimation.tsx

```tsx
import { motion } from 'framer-motion';

export const DrawingAnimation = () => {
  return (
    <div className="flex flex-col items-center">
      {/* 3D 盲盒旋转 */}
      <motion.div
        className="w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl shadow-2xl"
        animate={{
          rotateY: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <Gift className="w-24 h-24 text-white" />
        </div>
      </motion.div>
      
      <motion.p
        className="mt-8 text-white text-xl font-bold"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        正在为你寻找神秘目的地...
      </motion.p>
    </div>
  );
};
```
