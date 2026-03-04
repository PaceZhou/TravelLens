# TravelLens - 旅行盲盒核心算法设计

## 一、功能定位

**名称**: "去哪儿盲盒" / "Travel Mystery Box"  
**slogan**: "让算法带你去未知的远方"

**核心体验**:
- 用户点击"抽盲盒"按钮
- 酷炫动画 (3D 卡片翻转)
- 揭晓一个意想不到的旅行目的地
- 附带完整的出行攻略

---

## 二、科学算法设计

### 2.1 多维度评分系统

不是纯随机，而是基于**用户画像 + 时间因素 + 热度平衡**的智能推荐。

#### 评分公式

```
最终得分 = 
  个性化匹配度 (40%) +
  时间适宜度 (25%) +
  距离合理性 (20%) +
  热度平衡因子 (10%) +
  随机惊喜值 (5%)
```

---

### 2.2 个性化匹配度 (40%)

**基于用户历史行为**:

```typescript
function calculatePersonalityScore(spot: Spot, user: User): number {
  let score = 0;
  
  // 1. 标签匹配 (20分)
  const userPreferredTags = user.likedSpots.flatMap(s => s.tags);
  const matchedTags = spot.tags.filter(tag => 
    userPreferredTags.includes(tag)
  );
  score += (matchedTags.length / spot.tags.length) * 20;
  
  // 2. 价格偏好 (10分)
  const avgPrice = user.visitedSpots.map(s => s.avgCost).average();
  const priceDiff = Math.abs(spot.avgCost - avgPrice);
  score += Math.max(0, 10 - priceDiff / 100);
  
  // 3. 活动类型偏好 (10分)
  if (user.preferredActivities.includes(spot.activityType)) {
    score += 10;
  }
  
  return score;
}
```

---

### 2.3 时间适宜度 (25%)

**考虑季节、天气、节假日**:

```typescript
function calculateTimeScore(spot: Spot, currentDate: Date): number {
  let score = 0;
  
  // 1. 最佳季节 (15分)
  const currentSeason = getSeason(currentDate);
  if (spot.bestSeasons.includes(currentSeason)) {
    score += 15;
  }
  
  // 2. 天气适宜度 (5分)
  const weather = getWeatherForecast(spot.location);
  if (weather.condition === 'sunny' || weather.condition === 'cloudy') {
    score += 5;
  }
  
  // 3. 节假日加成 (5分)
  if (isHoliday(currentDate) && spot.crowdLevel < 0.7) {
    score += 5;
  }
  
  return score;
}
```

---

### 2.4 距离合理性 (20%)

**不要太近（没惊喜），不要太远（不现实）**:

```typescript
function calculateDistanceScore(
  spot: Spot, 
  userLocation: Location
): number {
  const distance = calculateDistance(userLocation, spot.location);
  
  // 理想距离区间: 50km - 500km
  if (distance < 50) {
    return distance / 50 * 10; // 太近扣分
  } else if (distance >= 50 && distance <= 500) {
    return 20; // 满分
  } else {
    return Math.max(0, 20 - (distance - 500) / 100); // 太远递减
  }
}
```

---

### 2.5 热度平衡因子 (10%)

**避免只推荐热门景点，给小众景点机会**:

```typescript
function calculatePopularityScore(spot: Spot): number {
  const popularityIndex = spot.viewCount / MAX_VIEW_COUNT;
  
  // 使用反向 S 曲线，给中等热度景点更高权重
  if (popularityIndex < 0.3) {
    return 10; // 小众景点满分
  } else if (popularityIndex < 0.7) {
    return 8; // 中等热度
  } else {
    return 5; // 超热门景点降权
  }
}
```

---

### 2.6 随机惊喜值 (5%)

**保持不可预测性**:

```typescript
function getRandomBonus(): number {
  return Math.random() * 5;
}
```

---

## 三、完整算法实现

```typescript
interface BlindBoxResult {
  spot: Spot;
  score: number;
  reason: string;
}

async function drawTravelBlindBox(
  userId: string,
  userLocation: Location
): Promise<BlindBoxResult> {
  
  // 1. 获取候选景点 (排除已去过的)
  const user = await getUserProfile(userId);
  const visitedSpotIds = user.visitedSpots.map(s => s.id);
  const candidates = await getSpots({
    excludeIds: visitedSpotIds,
    radius: 1000 // 1000km 范围内
  });
  
  // 2. 计算每个景点的综合得分
  const scoredSpots = candidates.map(spot => {
    const personalityScore = calculatePersonalityScore(spot, user);
    const timeScore = calculateTimeScore(spot, new Date());
    const distanceScore = calculateDistanceScore(spot, userLocation);
    const popularityScore = calculatePopularityScore(spot);
    const randomBonus = getRandomBonus();
    
    const totalScore = 
      personalityScore * 0.4 +
      timeScore * 0.25 +
      distanceScore * 0.2 +
      popularityScore * 0.1 +
      randomBonus * 0.05;
    
    return { spot, score: totalScore };
  });
  
  // 3. 使用加权随机选择 (分数越高概率越大，但不是绝对)
  const selected = weightedRandomSelect(scoredSpots);
  
  // 4. 生成推荐理由
  const reason = generateReason(selected.spot, user);
  
  return {
    spot: selected.spot,
    score: selected.score,
    reason
  };
}
```
