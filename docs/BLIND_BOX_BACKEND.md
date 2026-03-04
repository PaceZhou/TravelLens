### 2.3 ResultView.tsx

```tsx
export const ResultView = ({ spot }: { spot: Spot }) => {
  return (
    <motion.div
      initial={{ scale: 0, rotateY: 180 }}
      animate={{ scale: 1, rotateY: 0 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="bg-white rounded-3xl p-8 max-w-md w-full mx-4"
    >
      {/* 目的地图片 */}
      <img 
        src={spot.coverImage} 
        alt={spot.title}
        className="w-full h-64 object-cover rounded-2xl mb-6"
      />
      
      {/* 标题 */}
      <h2 className="text-3xl font-bold text-gray-800 mb-2">
        {spot.title}
      </h2>
      
      {/* 推荐理由 */}
      <div className="bg-purple-50 rounded-xl p-4 mb-6">
        <p className="text-sm text-purple-800">
          ✨ {spot.reason}
        </p>
      </div>
      
      {/* 关键信息 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-sm">{spot.distance}km</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-gray-400 mr-2" />
          <span className="text-sm">{spot.bestTime}</span>
        </div>
      </div>
      
      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold">
          查看详情
        </button>
        <button className="px-6 border-2 border-gray-200 rounded-xl">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
```

---

## 三、后端 API 实现

### 3.1 盲盒抽取接口

```typescript
// backend/src/modules/blind-box/blind-box.controller.ts

@Controller('api/v1/blind-box')
export class BlindBoxController {
  
  @Post('draw')
  async draw(@Body() dto: DrawBlindBoxDto) {
    const { userId, location } = dto;
    
    // 调用算法服务
    const result = await this.blindBoxService.draw(userId, location);
    
    return {
      code: 200,
      data: {
        spot: result.spot,
        reason: result.reason,
        score: result.score
      }
    };
  }
}
```

### 3.2 算法服务

```typescript
// blind-box.service.ts

@Injectable()
export class BlindBoxService {
  
  async draw(userId: string, userLocation: Location) {
    // 1. 获取用户画像
    const user = await this.userRepository.findOne(userId);
    
    // 2. 获取候选景点
    const candidates = await this.spotRepository.findCandidates({
      excludeVisited: user.visitedSpotIds,
      maxDistance: 1000
    });
    
    // 3. 计算得分
    const scored = candidates.map(spot => ({
      spot,
      score: this.calculateScore(spot, user, userLocation)
    }));
    
    // 4. 加权随机选择
    const selected = this.weightedRandom(scored);
    
    // 5. 生成推荐理由
    const reason = this.generateReason(selected.spot, user);
    
    return { ...selected, reason };
  }
  
  private calculateScore(spot, user, location) {
    // 实现评分算法
  }
}
```
