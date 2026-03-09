# MangoGo 项目规范

## 项目信息
- **项目名**: MangoGo (芒果Go) - 旅行社交平台
- **技术栈**: NestJS (backend) + React/Vite (frontend) + SQLite
- **后端端口**: 3001（绑定 127.0.0.1，不暴露公网）
- **前端端口**: 5173（Vite，host: true，局域网可访问）

## 工作流程要求（必须遵守）

### 每次修改代码后，必须：
1. 执行 `git add` + `git commit`，提交修改
2. 在回复中告知用户本次 commit 的哈希值（前7位）和提交信息

### Git 提交格式
```
<type>: <简短描述>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```
type 可选：`feat`（新功能）、`fix`（修复）、`refactor`（重构）、`docs`（文档）

## 关键文件
- `backend/src/main.ts` — NestJS 入口，监听 3001
- `backend/src/app.module.ts` — TypeORM 配置，SQLite: `backend/mangogo.db`
- `frontend/src/api/config.ts` — `API_URL = ''`（空字符串，走 Vite proxy）
- `frontend/vite.config.ts` — proxy 转发到 localhost:3001

## 注意事项
- 图片以 Base64 存储在 SQLite，无独立上传目录
- `synchronize: true`（TypeORM 自动同步 schema）
- 所有 API 请求走 Vite proxy，后端无需暴露到公网
