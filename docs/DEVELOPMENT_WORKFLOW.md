### 5.2 景点详情模块

**页面结构**:
```
┌─────────────────────────┐
│   顶部大图轮播           │ (Hero 动画)
├─────────────────────────┤
│   标题 + 距离 + 标签     │
├─────────────────────────┤
│   Tab 切换栏             │
│   [概览][机位][美食][攻略]│
├─────────────────────────┤
│                         │
│   内容区 (可滚动)        │
│                         │
│   - 概览: 历史介绍       │
│   - 机位: 拍照点列表     │
│   - 美食: 周边餐厅       │
│   - 攻略: 用户分享       │
│                         │
└─────────────────────────┘
│   底部操作栏             │
│   [收藏][分享][导航]     │
└─────────────────────────┘
```

**API 接口**:
```
GET /api/v1/spots/{id}
Response:
{
  "id": 1,
  "title": "故宫博物院",
  "distance": 2100,
  "coordinates": {"lat": 39.916, "lng": 116.397},
  "images": ["url1", "url2"],
  "history": "...",
  "photo_spots": [...],
  "foods": [...],
  "tips": "..."
}
```

---

### 5.3 社区模块

**功能点**:
- 双列瀑布流 (Pinterest 风格)
- 下拉刷新 + 上拉加载
- 点赞/收藏/评论
- 关联景点标签

**技术实现**:
```dart
// 使用 flutter_staggered_grid_view
StaggeredGridView.countBuilder(
  crossAxisCount: 2,
  itemCount: posts.length,
  itemBuilder: (context, index) => PostCard(posts[index]),
  staggeredTileBuilder: (index) => StaggeredTile.fit(1),
)
```

---

## 六、开发流程与团队协作

### 6.1 Git 工作流

```
main (生产环境)
  ↑
develop (开发环境)
  ↑
feature/map-module (功能分支)
feature/community-module
feature/spot-detail
```

**分支命名规范**:
- `feature/功能名` - 新功能
- `bugfix/问题描述` - Bug 修复
- `hotfix/紧急修复` - 生产环境紧急修复

---

### 6.2 开发阶段划分

**Phase 1: 基础架构 (Week 1-2)**
- [ ] 前端项目脚手架搭建
- [ ] 后端项目脚手架搭建
- [ ] 数据库表结构创建
- [ ] API 接口文档定义
- [ ] CI/CD 流水线配置

**Phase 2: 核心功能 (Week 3-5)**
- [ ] 地图探索模块
- [ ] 景点详情模块
- [ ] 用户认证模块

**Phase 3: 社区功能 (Week 6-7)**
- [ ] 帖子发布
- [ ] 瀑布流展示
- [ ] 点赞评论

**Phase 4: 优化上线 (Week 8)**
- [ ] 性能优化
- [ ] 测试覆盖
- [ ] 应用商店上架
