# MangoGo × OpenClaw + Story 数据采集与文案规范 v1.1

> 本文档约束两个 Agent 的协作流程：
> - **OpenClaw**：负责景点素材采集（图片、原始文字、基础信息）
> - **Story**（Qwen 大模型驱动）：负责将采集的素材润色为真实自然的旅行文案
>
> 所有关键步骤须经负责人确认后方可执行，两个 Agent 须每 15 分钟汇报一次进度。

---

## 一、目录结构规范

```
openclaw_output/
├── {国家代码}/
│   └── {城市拼音}/
│       └── {景点ID}/
│           ├── {子景观ID}/
│           │   ├── images/
│           │   │   ├── covers/       # 封面图（横版/竖版各一张）
│           │   │   ├── details/      # 细节图
│           │   │   └── panorama/     # 全景/航拍图（可选）
│           │   ├── videos/           # 短视频封面帧（jpg）
│           │   └── meta.json         # 该子景观的所有数据
│           └── attraction.json       # 景点级别汇总信息
└── _index.json                       # 全量索引文件
```

**示例路径：**
```
CN/Beijing/CN_BJ_GREATWALL/CN_BJ_GREATWALL_MUTIANYU/
JP/Tokyo/JP_TK_SENSOJI/JP_TK_SENSOJI_MAIN/
FR/Paris/FR_PA_LOUVRE/FR_PA_LOUVRE_PYRAMID/
```

---

## 二、ID 编码规范

### 格式：`{国家码}_{城市码}_{景点码}_{子景观码}`

| 层级 | 规则 | 示例 |
|------|------|------|
| 国家码 | ISO 3166-1 两字母大写 | `CN` `JP` `FR` `US` `TH` `IT` |
| 城市码 | 城市英文缩写 2-4 字母大写 | `BJ`(北京) `SH`(上海) `TK`(东京) `PA`(巴黎) |
| 景点码 | 景点英文关键词，去空格全大写 | `GREATWALL` `SENSOJI` `EIFFELTOWER` |
| 子景观码 | 景点码_子景观英文 | `GREATWALL_MUTIANYU` `SENSOJI_MAIN` |

**完整 ID 示例：**

| spot_id | 含义 |
|---------|------|
| `CN_BJ_GREATWALL_MUTIANYU` | 中国·北京·长城·慕田峪段 |
| `CN_BJ_GREATWALL_BADALING` | 中国·北京·长城·八达岭段 |
| `JP_TK_SENSOJI_MAIN` | 日本·东京·浅草寺·主殿区 |
| `JP_TK_SENSOJI_NAKAMISE` | 日本·东京·浅草寺·仲见世商店街 |
| `FR_PA_LOUVRE_PYRAMID` | 法国·巴黎·卢浮宫·玻璃金字塔 |
| `TH_BK_WATPHO_MAIN` | 泰国·曼谷·卧佛寺·主殿 |

---

## 三、图片命名规范

### 格式：`{子景观ID}_{类型}_{序号}_{拍摄方向}.{扩展名}`

```
CN_BJ_GREATWALL_MUTIANYU_COVER_001_N.jpg
CN_BJ_GREATWALL_MUTIANYU_DETAIL_003_E.jpg
CN_BJ_GREATWALL_MUTIANYU_PANORAMA_001_360.jpg
CN_BJ_GREATWALL_MUTIANYU_PEOPLE_002_SW.jpg
CN_BJ_GREATWALL_MUTIANYU_NIGHT_001_W.jpg
CN_BJ_GREATWALL_MUTIANYU_SEASON_001_AUT_TOP.jpg
```

### 图片类型代码（TYPE）

| 代码 | 含义 | 用途 | 尺寸要求 |
|------|------|------|----------|
| `COVER` | 封面图 | 帖子主图，最重要 | 竖版 3:4 优先，≥1080×1440px |
| `DETAIL` | 细节图 | 帖子副图 | 任意比例，宽≥1080px |
| `PANORAMA` | 全景/航拍图 | 展示全貌 | 宽幅，宽≥2160px |
| `PEOPLE` | 人文图 | 含人物/生活气息 | 同 DETAIL |
| `FOOD` | 美食图 | 景区内特色美食 | 方形 1:1 优先 |
| `NIGHT` | 夜景图 | 夜晚灯光效果 | 同 COVER |
| `SEASON` | 季节图 | 特定季节特色景色 | 文件名后加季节码 |

### 季节码（SEASON 类型专用后缀）

| 代码 | 季节 |
|------|------|
| `SPR` | 春季 |
| `SUM` | 夏季 |
| `AUT` | 秋季 |
| `WIN` | 冬季 |

### 拍摄方向代码（可选）

`N` 北 / `S` 南 / `E` 东 / `W` 西 / `NE` `NW` `SE` `SW` 斜角 / `360` 全景 / `TOP` 俯拍 / `LOW` 仰拍

### 图片质量硬性要求

```
COVER：    竖版 3:4，最小 1080×1440px，文件 ≤ 3MB
DETAIL：   宽 ≥ 1080px，文件 ≤ 2MB
PANORAMA： 宽 ≥ 2160px，文件 ≤ 5MB
格式：     JPG（质量85%+）或 WebP
禁止：     水印、Logo、文字叠加、严重过曝/欠曝、截图
```

---

## 四、JSON 数据格式规范

### 4.1 子景观数据文件 `meta.json`

```json
{
  "schema_version": "1.0",
  "spot_id": "CN_BJ_GREATWALL_MUTIANYU",

  "geo": {
    "country": "中国",
    "country_en": "China",
    "country_code": "CN",
    "continent": "亚洲",
    "province": "北京市",
    "province_en": "Beijing",
    "city": "北京",
    "city_en": "Beijing",
    "district": "怀柔区",
    "district_en": "Huairou District",
    "attraction_name": "长城",
    "attraction_name_en": "Great Wall of China",
    "attraction_id": "CN_BJ_GREATWALL",
    "spot_name": "慕田峪长城",
    "spot_name_en": "Mutianyu Great Wall",
    "address": "北京市怀柔区慕田峪村",
    "coordinates": {
      "lat": 40.4432,
      "lng": 116.5671
    }
  },

  "info": {
    "category": "历史遗迹",
    "sub_category": "古代建筑",
    "opening_hours": "08:00-17:30（4-10月），08:30-17:00（11-3月）",
    "ticket_price": "¥40（成人）",
    "ticket_price_note": "缆车另收费约¥100",
    "best_season": ["春", "秋"],
    "best_months": [4, 5, 10, 11],
    "visit_duration_hours": 3,
    "transport": "北京市区打车约1.5小时，或乘旅游专线巴士",
    "tips": [
      "建议早上8点前入园，游客少拍照更从容",
      "秋季10月中旬红叶期是最佳拍摄时机",
      "山路较陡，建议穿运动鞋，带足饮用水",
      "缆车上去、步行下来是最佳游览方式"
    ],
    "nearby_spots": ["CN_BJ_GREATWALL_JINSHANLING", "CN_BJ_GREATWALL_SIMATAI"],
    "suitable_for": ["摄影", "徒步", "历史爱好者", "家庭出游", "情侣"],
    "UNESCO_heritage": true,
    "popularity_score": 9.2
  },

  "tags": {
    "zh": ["长城", "北京", "世界遗产", "历史", "徒步", "打卡", "慕田峪", "古迹", "爬山", "旅行", "秋色", "红叶"],
    "en": ["GreatWall", "Beijing", "UNESCO", "History", "Hiking", "Autumn"]
  },

  "images": [
    {
      "filename": "CN_BJ_GREATWALL_MUTIANYU_COVER_001_N.jpg",
      "type": "COVER",
      "width": 1080,
      "height": 1440,
      "size_kb": 856,
      "description": "慕田峪长城秋季全景，城墙蜿蜒于红叶山间",
      "description_en": "Mutianyu Great Wall in autumn, winding through red foliage",
      "season": "秋",
      "time_of_day": "上午",
      "source_url": "https://example.com/original_url",
      "license": "CC-BY-2.0"
    },
    {
      "filename": "CN_BJ_GREATWALL_MUTIANYU_DETAIL_001_E.jpg",
      "type": "DETAIL",
      "width": 1440,
      "height": 1080,
      "size_kb": 623,
      "description": "城墙烽火台青砖细节，历经千年风霜斑驳",
      "description_en": "Close-up of watchtower bricks worn by centuries of wind",
      "season": "春",
      "time_of_day": "下午",
      "source_url": "https://example.com/original_url2",
      "license": "CC-BY-2.0"
    }
  ],

  "posts": [
    {
      "post_id": "CN_BJ_GREATWALL_MUTIANYU_POST_001",
      "style": "旅行日记",
      "tone": "感叹",
      "season": "秋",
      "content": "站在慕田峪长城上，望着脚下连绵起伏的城墙，才真正明白了什么叫"不到长城非好汉"。秋天的慕田峪是我见过最美的长城段，红叶把整座山都点燃了，和灰色的古砖形成绝美的对比。比八达岭少了很多游客，多了很多宁静，适合慢慢走、细细看。",
      "location": "慕田峪长城",
      "city": "北京",
      "cover_image": "CN_BJ_GREATWALL_MUTIANYU_COVER_001_N.jpg",
      "detail_images": [
        "CN_BJ_GREATWALL_MUTIANYU_DETAIL_001_E.jpg",
        "CN_BJ_GREATWALL_MUTIANYU_PEOPLE_001_W.jpg"
      ],
      "tags": ["长城", "北京", "慕田峪", "秋色", "世界遗产", "打卡", "旅行"]
    },
    {
      "post_id": "CN_BJ_GREATWALL_MUTIANYU_POST_002",
      "style": "攻略干货",
      "tone": "实用",
      "season": "通用",
      "content": "慕田峪长城避坑指南🧱\n\n① 早8点前入园，人少拍照好看\n② 建议坐缆车上去，徒步下来\n③ 秋季10月中旬红叶最美\n④ 自驾比坐旅游大巴灵活很多\n⑤ 园区内有餐厅但价格偏贵，建议自带零食\n⑥ 全程走完约需3小时，量力而行",
      "location": "慕田峪长城",
      "city": "北京",
      "cover_image": "CN_BJ_GREATWALL_MUTIANYU_PANORAMA_001_360.jpg",
      "detail_images": [
        "CN_BJ_GREATWALL_MUTIANYU_DETAIL_002_TOP.jpg"
      ],
      "tags": ["长城攻略", "北京", "旅行干货", "慕田峪", "自助游", "省钱攻略"]
    }
  ],

  "collection_meta": {
    "collected_at": "2026-03-07T10:00:00Z",
    "collector_version": "openclaw_v1.0",
    "data_quality_score": null,
    "review_status": "pending",
    "reviewer": null,
    "reviewed_at": null,
    "notes": ""
  }
}
```

### 4.2 景点汇总文件 `attraction.json`

```json
{
  "attraction_id": "CN_BJ_GREATWALL",
  "attraction_name": "长城",
  "attraction_name_en": "Great Wall of China",
  "geo": {
    "country": "中国",
    "country_code": "CN",
    "city": "北京",
    "city_en": "Beijing"
  },
  "spots": [
    "CN_BJ_GREATWALL_MUTIANYU",
    "CN_BJ_GREATWALL_BADALING",
    "CN_BJ_GREATWALL_JINSHANLING",
    "CN_BJ_GREATWALL_SIMATAI"
  ],
  "total_images": 48,
  "total_posts": 16,
  "collected_at": "2026-03-07T10:00:00Z"
}
```

### 4.3 全量索引文件 `_index.json`

```json
{
  "generated_at": "2026-03-07T10:00:00Z",
  "schema_version": "1.0",
  "stats": {
    "total_countries": 12,
    "total_cities": 38,
    "total_attractions": 95,
    "total_spots": 267,
    "total_images": 1840,
    "total_posts": 534
  },
  "entries": [
    {
      "spot_id": "CN_BJ_GREATWALL_MUTIANYU",
      "attraction_id": "CN_BJ_GREATWALL",
      "country_code": "CN",
      "city": "北京",
      "spot_name": "慕田峪长城",
      "path": "CN/Beijing/CN_BJ_GREATWALL/CN_BJ_GREATWALL_MUTIANYU/meta.json",
      "image_count": 12,
      "post_count": 4,
      "review_status": "pending"
    }
  ]
}
```

---

## 五、内容质量标准

### 5.1 文字内容要求

| 字段 | 要求 |
|------|------|
| `content`（帖子正文） | 150-400字，第一人称旅行日记语气，禁止广告推广语气 |
| 每个子景观 `posts` 数量 | **至少 2 篇**（日记体 + 攻略体各一篇） |
| `tips` 数组 | 3-6 条，具体可执行，非泛泛而谈 |
| `description`（图片描述） | 10-30字，描述画面内容，非景点介绍 |
| 禁止内容 | 广告词、极端夸张词汇、复制百科内容、虚假信息 |

### 5.2 每个子景观最低交付标准

```
COVER 图：   ≥ 2 张（不同角度或季节）
DETAIL 图：  ≥ 4 张
PEOPLE 图：  ≥ 1 张（展示人文气息）
posts：      ≥ 2 篇（日记体 + 攻略体）
tags.zh：    8-15 个中文标签
tips：       ≥ 3 条实用建议
coordinates：必填，精度到小数点后4位
```

---

## 六、禁止项清单（直接打回重采）

### 图片

- 含水印、Logo、平台角标
- 分辨率低于 1080px（宽）
- 过曝、欠曝、严重噪点或模糊
- 内容与景点无关
- 屏幕截图、网页截图

### 文字

- 复制粘贴百度百科或官网介绍
- 广告推广语气（"超值""强烈推荐购买"）
- `content` 字数低于 100 字
- 同一景点两篇帖子正文重复度 > 30%
- `spot_id` / `attraction_id` 与实际不符

### JSON 结构

- `coordinates` 缺失或填写 `(0, 0)`
- 必填字段为空字符串（应为 `null`）
- `images` 数组中文件名与实际文件不对应
- `cover_image` 指向不存在的文件
- `city` 字段与城市标准表不一致

---

## 七、城市名称标准对照表

> **重要：** `city` 字段必须严格使用以下标准名称，不得有任何变体，否则数据库城市筛选会分裂。

| 国家 | 标准 city 值 | 禁止写法 |
|------|-------------|----------|
| 中国 | `北京` | 北京市、BeiJing |
| 中国 | `上海` | 上海市、Shanghai |
| 中国 | `成都` | 成都市 |
| 中国 | `西安` | 陕西西安 |
| 中国 | `杭州` | 浙江杭州 |
| 中国 | `桂林` | 广西桂林 |
| 日本 | `东京` | 日本东京、Tokyo |
| 日本 | `京都` | 日本京都、Kyoto |
| 日本 | `大阪` | 日本大阪、Osaka |
| 泰国 | `曼谷` | 泰国曼谷、Bangkok |
| 法国 | `巴黎` | 法国巴黎、Paris |
| 意大利 | `罗马` | 意大利罗马、Roma |
| 意大利 | `威尼斯` | 意大利威尼斯 |
| 美国 | `纽约` | 美国纽约、New York |
| 英国 | `伦敦` | 英国伦敦、London |

*如遇表中未收录城市，提交前须先与负责人确认标准名称再填写。*

---

## 八、图片与帖子组合一致性规则

1. **季节一致**：同一篇 post 的 `cover_image` 与 `detail_images` 必须是同一季节（不可封面秋景、副图冬雪）
2. **内容一致**：图片内容与帖子正文描述的场景对应
3. **风格匹配**：日记体 post 配情绪化的 COVER/PEOPLE 图，攻略体 post 配信息量大的 PANORAMA/DETAIL 图

---

## 九、版权与来源要求

- 每张图片必须记录 `source_url`（原始页面 URL）和 `license`（版权协议）
- 优先采集 Creative Commons（CC）协议授权图片
- 商业版权图片不得采集
- 平台用户上传图片需确认授权再使用

---

## 十、审查流程

### 提交批次要求

首次试运行：**2个国家 × 3个城市 × 各3个景点**，通过后再全量展开。

### 我的审查清单（每批次提交后执行）

1. **`_index.json` 完整性** — stats 数字与实际文件数是否一致
2. **随机抽查 5 个 `meta.json`** — 字段完整性、ID 格式、坐标合理性
3. **图片文件名规范** — 抽查 20 张，命名是否符合规范
4. **post 内容质量** — 语气是否自然、字数是否达标、是否有复制痕迹
5. **图片与 JSON 对应** — `images` 数组中的文件名是否都实际存在
6. **城市字段标准性** — `city` 是否与城市标准对照表一致
7. **图片组合一致性** — 同一 post 的图片季节/内容是否匹配

### 审查结果状态

| 状态 | 含义 |
|------|------|
| `pending` | 待审查 |
| `approved` | 通过，可导入 |
| `rejected` | 整体打回重采 |
| `partial` | 部分通过，需补充指定字段 |

---

## 十一、Story（品牌故事官）工作规范

> Story 使用 Qwen 大模型，负责将 OpenClaw 采集的原始素材加工为真实自然的旅行文案。
> **Story 不写代码，不处理技术问题，只做文字工作。**

### 11.1 Story 的职责边界

| 职责范围内 | 职责范围外（禁止） |
|-----------|----------------|
| 将原始景点描述润色为旅行日记风格 | 修改 JSON 结构或字段名 |
| 补充 tips（基于真实景点信息推断） | 编写任何代码或脚本 |
| 优化标签措辞，使其更符合社交平台语气 | 自行修改图片命名或目录 |
| 统一同一景点多篇帖子的语气风格 | 凭空捏造景点信息、票价、开放时间 |
| 检查文案是否过于夸张并主动降调 | 未经确认就批量处理多个景点 |

### 11.2 Story 的工作步骤

**Step 1：接收素材（等待 OpenClaw 完成原始采集）**
- 确认收到 OpenClaw 输出的 `meta.json`，检查 `geo`、`info`、`images` 字段是否完整
- 若字段有缺失，**立即停下，向负责人汇报**，不得自行补全结构性数据

**Step 2：汇报计划，等待确认**
- 告知负责人本次准备润色哪些景点（列出 spot_id 清单）
- **收到负责人明确同意后**，才开始动笔

**Step 3：润色 posts[].content（核心工作）**

润色原则：
```
✅ 第一人称，像真实游客写的，带有个人感受和细节观察
✅ 语气自然，有情绪但不夸张（不用"震撼""绝美""必打卡"等网红词）
✅ 细节真实，结合 info.tips 和 geo 信息写具体场景
✅ 日记体：150-300字，有起承转合
✅ 攻略体：分条列点，信息准确，语气亲切不说教
❌ 禁止：广告词、极端词、不可核实的数据（"排队2小时"需有来源）
❌ 禁止：套用固定模板，每篇必须有独特的切入点
```

**Step 4：补充/优化 tags**
- 在原有标签基础上，补充 2-3 个更贴近年轻旅行者用语的标签
- 不得删除 OpenClaw 已填写的地理类标签（城市名、景点名）

**Step 5：补充 tips（可选）**
- 若 OpenClaw 提供的 tips 过于笼统（如"建议早去"），Story 可基于景点性质补充更具体的建议
- 补充内容需标注 `"source": "inferred"` 以便审查时区分

**Step 6：完成后汇报，不得自行流转**
- 将润色后的 `posts` 内容以对比格式（原文 vs 润色后）提交给负责人审查
- **等待审查通过后**，才将修改写入 `meta.json`

### 11.3 Story 的文案质量标准

**好文案示例（日记体）：**
```
去慕田峪那天，北京刚下过雨，山里有薄薄的雾。缆车往上走的时候，
城墙一截一截从雾里露出来，有点像在看一张老照片慢慢显影。
秋天的长城比我想象中安静，没有八达岭那种人挤人，
可以站在烽火台上发很久的呆，风把头发吹乱也不想走。
```

**差文案示例（禁止）：**
```
慕田峪长城是北京最美的长城段！景色震撼无比，强烈推荐！
是打卡圣地，去了绝对不后悔！超值超值！！
```

### 11.4 禁止行为（Story 专项）

- 未经确认直接批量处理整个城市的景点
- 将润色内容直接覆盖原文件（必须先提交对比稿）
- 凭空添加景点不存在的特色（如景点实际不通缆车却写了缆车体验）
- 使用 AI 生成腔（"令人心旷神怡""不禁感叹大自然的鬼斧神工"等套语）
- 试图处理任何技术性工作（JSON 验证、文件重命名等）

---

## 十二、OpenClaw + Story 协作流程

```
┌─────────────────────────────────────────────────────┐
│                   负责人下达任务                        │
│          （指定国家、城市、景点范围）                     │
└──────────────────────┬──────────────────────────────┘
                       │ 确认后开始
                       ▼
┌─────────────────────────────────────────────────────┐
│                  OpenClaw 采集阶段                     │
│  · 按规范采集图片、基础文字、geo/info 字段               │
│  · 每 15 分钟汇报：已完成X个spot，当前处理：XXX          │
│  · 完成一个景点后暂停，等待负责人确认再继续               │
└──────────────────────┬──────────────────────────────┘
                       │ OpenClaw 提交原始 meta.json
                       ▼
┌─────────────────────────────────────────────────────┐
│               负责人审查原始素材                        │
│  · 检查图片命名、字段完整性、坐标准确性                   │
│  · approved → 交给 Story；rejected → 打回 OpenClaw    │
└──────────────────────┬──────────────────────────────┘
                       │ 确认后交棒
                       ▼
┌─────────────────────────────────────────────────────┐
│                  Story 润色阶段                        │
│  · 汇报本次润色计划，等待确认                            │
│  · 对 posts[].content 和 tags 进行润色                 │
│  · 每 15 分钟汇报：已完成X篇，当前处理：XXX              │
│  · 提交对比稿（原文 vs 润色后），等待审查                 │
└──────────────────────┬──────────────────────────────┘
                       │ 审查通过
                       ▼
┌─────────────────────────────────────────────────────┐
│              最终审查 + 数据库导入                      │
│  · 图片转 base64                                      │
│  · 写入 posts 表                                      │
│  · 验证展示效果                                        │
└─────────────────────────────────────────────────────┘
```

---

## 十三、15 分钟进度汇报模板

**OpenClaw 汇报格式：**
```
[进度汇报 HH:MM]
当前任务：{国家}/{城市}
已完成：{X} 个 spot
正在处理：{spot_id}
遇到问题：{无 / 具体描述}
预计下次汇报完成：{spot_id}
```

**Story 汇报格式：**
```
[进度汇报 HH:MM]
当前任务：润色 {spot_id}
已完成：{X} 篇 post
正在处理：{post_id}（日记体/攻略体）
遇到问题：{无 / 具体描述}
预计下次汇报完成：{spot_id} 全部润色
```

> **注意：超过 15 分钟无汇报，负责人有权暂停任务要求说明情况。**

---

## 十四、数据导入流程（备忘）

```
OpenClaw 采集 → 负责人审查 → Story 润色 → 负责人终审 →
图片转 base64 → 写入 posts 表（content/images/location/city/tags）→ 验证展示效果
```

---

*MangoGo 项目组 · 规范版本 v1.1 · 2026-03-08*
