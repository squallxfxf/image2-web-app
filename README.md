# Image2 Web App MVP

可上线 MVP：AI 图片生成 + 图片卡片级提示词管理（IMAGE2/LTX2.3/WAN2.2 严格绑定到 `generatedImageId`）。

## 功能（第一阶段）
- 登录注册（Auth.js + Credentials/Google）
- 积分系统（预扣、失败退款、流水）
- 图片生成任务（BullMQ + Redis）
- OpenAI Image API 生成 + S3/R2 上传
- 图片卡片（预览/下载/复制/收藏）
- 卡片内四类提示词：描述、IMAGE2、LTX2.3、WAN2.2
- 单独 AI 优化、版本记录、对话记录
- 图片列表与搜索/分页/收藏筛选
- CSV / Excel 导出
- 管理后台（用户、任务、图片、积分流水）

## 启动
1. 复制环境变量
```bash
cp .env.example .env
```
2. 启动基础依赖
```bash
docker compose up -d postgres redis
```
3. 安装依赖和数据库
```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run seed
```
4. 启动服务
```bash
npm run dev
npm run worker
```

## Docker Compose 一键运行
```bash
docker compose up --build
```

## 默认测试账号
- 管理员：`admin@example.com` / `Admin123456!`
- 普通用户：`user@example.com` / `User123456!`

## API
- `POST /api/generate/image`
- `GET /api/jobs/:id`
- `POST /api/generate/prompts`
- `POST /api/prompt/optimize`
- `PATCH /api/images/:id`
- `GET /api/images`
- `GET /api/images/export?format=csv|xlsx`


## 第二阶段（已预留）
- Stripe Checkout 会话接口：`POST /api/billing/create-checkout-session`
- SSE 任务状态流：`GET /api/jobs/:id/stream`
- 管理端成本统计接口：`GET /api/admin/costs`
