# MangoGo 完整逻辑检查报告

## ✅ 已有的正确设计

### posts表（已包含景点关联字段）
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,  ← 关联用户
  
  -- 景点关联（多种方式）
  spot_id UUID,  ← 用户手动选择的景点
  location_name VARCHAR(255),  ← 位置文字（如"上海虹口足球场"）
  poi_id VARCHAR(100),  ← POI兴趣点ID
  
  -- GPS定位
  latitude DECIMAL(10, 8),  ← 纬度
  longitude DECIMAL(11, 8),  ← 经度
  
  -- 地理层级
  country VARCHAR(50),
  province VARCHAR(50),
  city VARCHAR(50),
  district VARCHAR(50),
  
  -- 内容
  content TEXT,  ← 可能包含景点名
  
  -- 时间戳
  created_at TIMESTAMP,  ← 发布时间
  
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (spot_id) REFERENCES spots(id)
);
```

---

## 🎯 景点帖子关联的4种方式

### 方式1：用户手动选择（最准确）
```
用户发帖 → 搜索"虹口足球场" → 选择 → spot_id = "spot-123"
```

### 方式2：GPS定位匹配（自动）
```
用户发帖 → 获取GPS(121.4737, 31.2304) → 查询500米内景点 → spot_id = "spot-123"
```

### 方式3：位置名称匹配（自动）
```
用户输入位置"虹口足球场" → location_name = "虹口足球场" → 模糊匹配景点
```

### 方式4：内容关键词匹配（自动）
```
帖子内容包含"虹口足球场" → 搜索景点名 → 关联
```

---

## 📊 查询景点帖子的完整SQL

```sql
-- 查询"上海虹口足球场"(spot-123)的所有相关帖子
SELECT 
  p.*,
  u.username,
  u.avatar_url,
  s.name as spot_name
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN spots s ON p.spot_id = s.id
WHERE 
  -- 方式1：手动标记
  p.spot_id = 'spot-123'
  
  -- 方式2：GPS定位（500米内）
  OR (
    p.latitude IS NOT NULL 
    AND ST_Distance_Sphere(
      point(p.longitude, p.latitude),
      point(121.4737, 31.2304)
    ) < 500
  )
  
  -- 方式3：位置名称包含
  OR p.location_name LIKE '%虹口足球场%'
  
  -- 方式4：内容提到
  OR p.content LIKE '%虹口足球场%'
  
ORDER BY p.created_at DESC;
```

---

## ✅ 结论：设计完整

1. ✅ 数据库字段完整（spot_id, location_name, GPS, content）
2. ✅ 支持4种关联方式
3. ✅ 可以查询景点的所有相关帖子
4. ✅ 用户不选景点也能自动匹配

**逻辑闭环完整！** 🥭
