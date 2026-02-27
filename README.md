交通厕所运维评价系统 — 起始脚手架

快速启动（开发）：

1. 复制环境变量样例并填写：

```bash
cp .env.example .env
# 编辑 .env，填写 MySQL 与 Azure AD 凭证
```

2. 安装依赖并运行（在 `frontend` 内）：

```bash
cd frontend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

说明：本仓库为最小脚手架，包含 Next.js 前端（含 API 路由）、Prisma 数据模型、NextAuth Azure 示例、以及 docx -> JSON 转换脚本骨架。