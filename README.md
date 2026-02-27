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

文件上传说明
- 上传接口：`POST /api/uploads`，接受 JSON 格式的 body：`{ name: string, data: string }`，其中 `data` 需为 `data:<mime>;base64,<base64payload>` 格式。
- 允许类型：`image/png`, `image/jpeg`, `image/webp`, `application/pdf`。
- 单文件大小上限：5 MB。上传后文件保存在 `frontend/public/uploads`，返回的 `url` 可直接链接访问。

运行提示
- 在开始前请确保 `.env` 已正确配置 `DATABASE_URL` 与 Azure AD 凭证。
- 开发时使用 `npx prisma migrate dev --name init` 来运行迁移并创建数据库表；生产使用 `npx prisma migrate deploy`。

下一步
- 我将继续添加简单的单元测试以及 CI 配置（或按你的偏好配置）。

Deployment & seed instructions

1) Prepare environment variables

- Copy `.env.example` to `.env` and fill values. Required keys:
	- `DATABASE_URL` (e.g. Azure MySQL connection string)
	- `NEXTAUTH_URL` (e.g. `https://your-site.example`)
	- `NEXTAUTH_SECRET` (random secret)
	- `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`

2) Generate Prisma client and run migrations

From the project root (where `prisma/schema.prisma` lives):

```bash
# generate client
npm run prisma:generate

# development migrate (creates migration and updates DB)
npm run prisma:migrate:dev

# production: apply migrations
npm run prisma:migrate:deploy
```

3) Seed admin user

Create an admin user record (this does not set a password — Azure AD users will be linked by email):

```bash
# optional env overrides
ADMIN_EMAIL=admin@yourdomain.com ADMIN_NAME=管理员 npm run seed
```

4) Run the Next.js app (development)

```bash
cd frontend
npm install
npx prisma generate
npm run dev
```

5) Production deployment recommendations

- Host the Next.js app on Vercel or Azure App Service.
- Use Azure Database for MySQL (you already provided a Navicat connection string example). Ensure SSL and firewall rules allow the app to connect.
- For file uploads in production, move from `public/uploads` to Azure Blob Storage and store blob URLs in submissions.
- Configure `NEXTAUTH_URL` to your production URL and register an Azure AD app with correct redirect URIs.
- Use `prisma migrate deploy` as part of your deploy pipeline and run `npm run seed` once after migrations.

Security & operational notes

- Protect access to `/api/users` endpoints — only `admin` role should be allowed to create/update/delete users. Current scaffold provides listing only.
- Consider adding rate limiting and request size limits in production.
- Use HTTPS and rotate `NEXTAUTH_SECRET` and other secrets securely (Key Vault or environment secrets).

Vercel deployment

1. Create a Vercel project and connect your GitHub repository.

2. In project settings set the **Root Directory** to `frontend` (or keep root and the included `vercel.json` will instruct Vercel to build from `frontend`).

3. Add the following environment variables in Vercel (Project > Settings > Environment Variables):
	- `DATABASE_URL` (your Azure MySQL connection string)
	- `NEXTAUTH_URL` (e.g., `https://your-site.vercel.app`)
	- `NEXTAUTH_SECRET` (random secret)
	- `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_TENANT_ID`

4. Run database migrations before the first deploy. You can run migrations from CI using the included GitHub Actions workflow `.github/workflows/prisma-deploy.yml` which runs on push to `main`. To use it, set the repository secrets `DATABASE_URL`, and optional `ADMIN_EMAIL`/`ADMIN_NAME` for seeding.

5. Deploy: once the environment variables are set, Vercel will build the Next.js app automatically on push. The app will be available at the Vercel URL.

Notes:
- Vercel serverless functions can't run long migrations reliably; prefer running `prisma migrate deploy` from CI or a trusted runner (the supplied workflow does this).
- For production file uploads, replace the local `public/uploads` with Azure Blob Storage and update `frontend/pages/api/uploads.js` to upload to Blob Storage and return blob URLs.
