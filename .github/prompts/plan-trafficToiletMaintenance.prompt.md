TL;DR
目标：基于你提供的评价表实现“用户登录 -> 主界面 -> 菜单 -> 四模块”（用户登录、主界面、用户管理、评价表填报、评价表查看）。建议技术栈：Fullstack JS（Next.js 单仓库），后端使用 Prisma + MySQL，认证使用 Azure AD（NextAuth）。把 `.docx` 高保真映射为 JSON Schema 以供前端渲染与校验。

详细计划
1. Scaffold 项目
- 创建单仓库 Next.js 应用，包含 `frontend/`（Next.js app + API routes）和 `prisma/`。
- 根目录添加 `package.json`、`.env.example`、README。

2. 认证与配置
- 使用 NextAuth 集成 Azure AD（OIDC）：`frontend/pages/api/auth/[...nextauth].ts`。
- 环境变量 `.env`（示例）：`DATABASE_URL`、`NEXTAUTH_URL`、`NEXTAUTH_SECRET`、`AZURE_CLIENT_ID`、`AZURE_CLIENT_SECRET`。

3. 数据库模式与 ORM
- 使用 Prisma，创建 `prisma/schema.prisma`，包含模型：
  - `User`（id, email, name, role, permissions, azureId）
  - `FormTemplate`（id, name, schemaJson, docxSource）
  - `FormSubmission`（id, templateId, submitterId, dataJson, status, createdAt）
- 添加种子脚本 `prisma/seed.ts` 用于创建管理员账号与默认模板引用。

4. `.docx` -> JSON Schema 转换
- 新增工具 `tools/docx_to_json.js`（或 ts），使用 `mammoth` / `docx` 库提取表单内容并映射到 JSON Schema。
- 输出存放：`forms/templates/湖北普通国省道交通厕所运维.json`（高保真字段、类型、必填、枚举、验证规则）。
- 设定人工校验步骤，确保每个字段的映射正确。

5. API 端点（Next.js API routes）
- `api/auth/*`：NextAuth 管理。
- `api/users/`：`GET /`（用户列表），`POST /`（创建），`PUT /:id`，`DELETE /:id`（仅 admin）。
- `api/forms/templates/`：列出/获取模板。
- `api/forms/submissions/`：`POST /`（提交），`GET /`（列表，支持分页与过滤），`GET /:id`（查看）。
- 添加权限中间件 `frontend/lib/withAuth.ts`（基于 role：`admin`、`editor`、`viewer`）。

6. 前端页面与组件
- `frontend/pages/login.tsx`：Azure OIDC 登录入口与本地提示页面。
- `frontend/pages/index.tsx`：主界面，展示最近提交的评价表和通知新闻（`RecentSubmissions` 组件）。
- `frontend/components/Menu.tsx`：主导航（链接到用户管理、表单填报、表单查看）。
- `frontend/pages/users/index.tsx` 和 `frontend/pages/users/[id].tsx`：用户管理界面（仅 admin 可访问）。
- `frontend/pages/forms/new.tsx`：动态渲染 JSON Schema 表单并提交（建议使用 `@rjsf/core` 或自定义渲染器）。
- `frontend/pages/forms/[id].tsx`：查看单条提交详情及审核信息。

7. 通知与“最近提交”视图
- `RecentSubmissions` 组件：获取 `api/forms/submissions`，显示状态、提交人、时间，并提供快速查看入口。

8. 校验、日志与附件
- 后端在入库前基于 JSON Schema 做服务端验证。
- 支持图片/附件上传（本地 `uploads/` 或 Azure Blob 存储），在 `FormSubmission` 中引用附件路径。

9. 测试与 CI
- 使用 Jest（或你偏好的测试框架）对转换脚本、API 处理逻辑做单元测试。
- 添加 CI 工作流（安装、lint、测试、Prisma 迁移检查）。

10. 文档与部署
- README：环境变量、运行步骤、迁移与种子命令、Azure AD 配置要点。
- 部署建议：Vercel（Next.js）或 Azure App Service；数据库使用 Azure Database for MySQL。

本地快速启动示例（开发）
```bash
# 在仓库根目录
cp .env.example .env
# 编辑 .env 填入 MySQL 与 Azure 凭证
cd frontend
npm install
npx prisma migrate dev --name init
npm run dev
```

验证要点
- 使用 Azure 帐号登录并能进入主界面。
- 主界面显示最近提交与通知。
- 管理员可访问用户管理界面并设置权限。
- 在 `forms/new` 中打开模板，填写所有字段并提交，数据持久化到 `FormSubmission`。
- 在 `forms/[id]` 中能查看提交详情（含附件）。

决策说明
- 技术栈：Next.js（单仓库）便于快速构建 UI 与 API；Prisma + MySQL 满足你指定的数据库；NextAuth + Azure AD 满足“Azure”认证需求。
- 表单处理：先把 `.docx` 转成 JSON Schema（高保真映射），前端基于 Schema 动态渲染表单并做校验。

下一步（可选）
- 我可以立即生成基础脚手架（Next.js + Prisma + NextAuth）并在仓库中初始化核心文件；或
- 我可以先把 `.docx` 转换为初版 JSON Schema（需要你确认某些字段的语义）。

请确认你希望我执行的下一步："生成脚手架" 或 "转换表单到 JSON Schema"。
