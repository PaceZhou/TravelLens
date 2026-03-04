# TravelLens - 完整项目结构

## 项目根目录

```
TravelLens/
├── frontend/                 # Flutter 前端
├── backend/                  # Node.js 后端
├── docs/                     # 项目文档
├── scripts/                  # 自动化脚本
├── .github/                  # GitHub Actions
└── README.md
```

---

## 前端目录结构 (Flutter)

```
frontend/
├── lib/
│   ├── main.dart
│   ├── app/
│   │   ├── app.dart                    # App 入口
│   │   ├── routes/
│   │   │   ├── app_routes.dart         # 路由定义
│   │   │   └── app_pages.dart          # 页面绑定
│   │   ├── theme/
│   │   │   ├── app_theme.dart          # 主题配置
│   │   │   └── app_colors.dart         # 颜色定义
│   │   └── config/
│   │       ├── app_config.dart         # 全局配置
│   │       └── env_config.dart         # 环境变量
│   │
│   ├── core/
│   │   ├── network/
│   │   │   ├── dio_client.dart         # Dio 封装
│   │   │   ├── api_endpoints.dart      # API 端点
│   │   │   └── interceptors/
│   │   │       ├── auth_interceptor.dart
│   │   │       └── error_interceptor.dart
│   │   ├── storage/
│   │   │   ├── local_storage.dart      # 本地存储
│   │   │   └── secure_storage.dart     # 安全存储
│   │   ├── utils/
│   │   │   ├── logger.dart             # 日志工具
│   │   │   ├── validators.dart         # 验证器
│   │   │   └── formatters.dart         # 格式化工具
│   │   └── constants/
│   │       ├── app_constants.dart
│   │       └── api_constants.dart
│   │
│   ├── data/
│   │   ├── models/
│   │   │   ├── spot_model.dart
│   │   │   ├── photo_spot_model.dart
│   │   │   ├── food_model.dart
│   │   │   ├── post_model.dart
│   │   │   └── user_model.dart
│   │   ├── repositories/
│   │   │   ├── spot_repository.dart
│   │   │   ├── community_repository.dart
│   │   │   └── user_repository.dart
│   │   └── providers/
│   │       ├── spot_provider.dart
│   │       ├── community_provider.dart
│   │       └── auth_provider.dart
│   │
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── spot.dart
│   │   │   ├── photo_spot.dart
│   │   │   └── post.dart
│   │   └── usecases/
│   │       ├── get_nearby_spots.dart
│   │       ├── get_spot_detail.dart
│   │       └── create_post.dart
│   │
│   └── presentation/
│       ├── pages/
│       │   ├── map/
│       │   │   ├── map_page.dart
│       │   │   ├── map_controller.dart
│       │   │   └── widgets/
│       │   │       ├── spot_marker.dart
│       │   │       ├── spot_card.dart
│       │   │       └── cluster_marker.dart
│       │   ├── spot_detail/
│       │   │   ├── spot_detail_page.dart
│       │   │   ├── spot_detail_controller.dart
│       │   │   └── widgets/
│       │   │       ├── photo_spot_card.dart
│       │   │       ├── food_card.dart
│       │   │       └── spot_gallery.dart
│       │   ├── community/
│       │   │   ├── community_page.dart
│       │   │   ├── community_controller.dart
│       │   │   └── widgets/
│       │   │       ├── post_card.dart
│       │   │       └── post_grid.dart
│       │   └── profile/
│       │       ├── profile_page.dart
│       │       └── profile_controller.dart
│       └── widgets/
│           ├── common/
│           │   ├── loading_widget.dart
│           │   ├── error_widget.dart
│           │   └── empty_widget.dart
│           └── buttons/
│               └── primary_button.dart
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── test/
│   ├── unit/
│   ├── widget/
│   └── integration/
│
├── pubspec.yaml
├── analysis_options.yaml
└── README.md
```
