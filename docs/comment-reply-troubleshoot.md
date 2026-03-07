# 评论区回复功能 - 相关文件与排查指南

## 一、回复功能涉及的文件与行号

### 1. 移动端评论抽屉（主入口）

| 文件 | 行号 | 说明 |
|------|------|------|
| `frontend/src/components/MobileCommentDrawer.tsx` | 31 | `replyTo` 状态，点击「回复」时写入被回复人 username |
| 44-48 | 顶级评论过滤 `!c.parentCommentId`，回复列表 `getReplies(commentId)` |
| 148-155 | 顶级评论下方的「回复」按钮，`onClick` 里 `setReplyTo(comment.username)` |
| 170-197 | 回复列表渲染：`visibleReplies.map`，展示 `reply.username`、`reply.replyToUsername` |
| 224-231 | 底部输入区：有 `replyTo` 时显示 MentionTag，placeholder `回复 @${replyTo}...` |
| 32-41 | `handleSend`：调用 `onSendComment(commentText, replyTo \|\| undefined)` |

### 2. 帖子详情（数据与提交）

| 文件 | 行号 | 说明 |
|------|------|------|
| `frontend/src/components/MobilePostDetail.tsx` | 53-56 | 拉取评论 `GET /comments/post/:postId`，`setComments(data)` |
| 76-99 | `handleSendComment(content, replyToUsername?)`：POST `/comments`，body 含 `replyToUsername`，成功后重新拉评论 |
| 260-263 | 把 `comments`、`onSendComment={handleSendComment}` 传给 `MobileCommentDrawer` |

### 3. 后端

| 文件 | 行号 | 说明 |
|------|------|------|
| `backend/src/comments/comments.service.ts` | 31-44 | 创建评论时：若有 `replyToUsername` 且无 `parentCommentId`，用 `findOne` 查「被回复评论」并设置 `parentCommentId` |
| 69-86 | `findByPostId`：带 `user` 关系，返回扁平列表（先 root 再 replies） |
| `backend/src/comments/comment.entity.ts` | 20-26 | `replyToUserId`、`replyToUsername`、`parentCommentId` 字段定义 |

### 4. 其他评论组件（非当前移动端主流程）

- `frontend/src/components/CommentSection.tsx` 约 153 行：有「回复」按钮但未绑定逻辑。
- `frontend/src/components/InstagramComment.tsx`：PC 端评论，用 `replyToUsername` + `c.replyToUsername === comment.user.username` 做回复树。

---

## 二、当前发现的问题

### 问题 1：评论列表数据结构与前端约定不一致（导致名字不显示、回复错人）

- **现象**：评论者名字可能不显示；点击「回复」后可能挂到错误的评论下。
- **原因**：后端 `findByPostId` 返回的是带 `user` 关系的 Comment（`comment.user.username`），而 `MobileCommentDrawer` 用的是**扁平**的 `comment.username` 和 `comment.parentCommentId`。
  - 若接口没有做扁平化，则 `comment.username` 为 `undefined`，显示空白。
  - 点击回复时 `setReplyTo(comment.username)` 得到 `undefined`，提交的 `replyToUsername` 也可能不对。

**涉及渲染位置**：

- `MobileCommentDrawer.tsx`：127 行 `comment.username`，150 行 `setReplyTo(comment.username)`，178 行 `reply.username`。

### 问题 2：后端根据「被回复评论」查 parentCommentId 的逻辑错误

- **位置**：`backend/src/comments/comments.service.ts` 第 34-37 行。
- **现状**：`findOne` 仅按 `postId` + `createdAt: 'DESC'` 取**该帖子下最新一条评论**，完全没有用 `replyToUsername`。
- **结果**：前端传的「回复给谁」被忽略，所有回复都可能挂到同一条（最新）评论下，导致回复错位。

### 问题 3：Comment 类型缺少 parentCommentId

- **位置**：`MobileCommentDrawer.tsx` 中 `Comment` interface（约 5-13 行）。
- **现状**：类型里没有 `parentCommentId`，但 45-48 行用了 `c.parentCommentId`。
- **影响**：类型与实现不一致，不利于排查和后续改回复逻辑。

---

## 三、排查步骤建议

1. **看接口返回结构**  
   在浏览器 Network 里看 `GET /comments/post/:postId` 的响应：每条是否有 `user.username`、是否有 `parentCommentId`。确认前端拿到的和 `MobileCommentDrawer` 用的字段是否一致。

2. **确认名字来源**  
   在 `MobileCommentDrawer` 里给 `comment` / `reply` 打 `console.log`，看是否有 `username` 还是只有 `user.username`。若只有 `user`，则 127、150、178 行都需要改为从 `user` 取或先做一层扁平化。

3. **确认回复目标**  
   点击某条评论的「回复」后，在 `handleSend` 或 `handleSendComment` 里打印 `replyTo` / `replyToUsername`，确认是否为目标用户名；再在 Network 里看 POST `/comments` 的 body 是否包含正确的 `replyToUsername`。

4. **确认后端挂载逻辑**  
   在后端 `create()` 里（或通过日志）打印：根据 `replyToUsername` 查到的 `replyToComment` 是谁、最终写入的 `parentCommentId` 是什么。可快速验证「问题 2」是否存在。

5. **回复列表是否按 parentCommentId 正确归组**  
   在 `getReplies(commentId)` 里确认传入的 `commentId` 是顶级评论 id，且接口返回的每条回复都有正确的 `parentCommentId` 与之对应。

---

## 四、建议修改方向（简要）

1. **前端**：在 `MobilePostDetail` 拿到评论列表后，做一层映射，把 `user.username` 展平为 `username`，并保证每条都有 `parentCommentId`（与后端一致）；或统一在 `MobileCommentDrawer` 里用 `comment.user?.username` 和 `reply.user?.username`，并补全类型（含 `parentCommentId`、可选的 `user`）。
2. **后端**：在 `create()` 里根据 `replyToUsername` 查找被回复评论时，应按「该帖子下、评论作者 username = replyToUsername」来查（并明确策略：例如取最新一条或要求前端传 `parentCommentId`）；若前端改为传 `parentCommentId`，则后端可直接使用，不再用 `replyToUsername` 去查。
3. **可选**：若希望「回复某条二级回复」也正确归到同一楼，前端在点击二级回复的「回复」时，应传该楼的根评论 id 作为 `parentCommentId`，后端同上直接使用。

完成以上修改后，再按第三节步骤做一次完整排查即可验证回复功能是否正常。
