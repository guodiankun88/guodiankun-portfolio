# 郭殿琨作品集网站（Decap CMS 版）

这是一个基于 Decap CMS + GitHub Pages 的个人作品集网站。你可以通过浏览器登录后台，直接在线编辑网站内容，所有修改会自动保存到 GitHub 仓库并触发网站重新部署。

## 架构说明

- **网站文件**：`index.html` + `content/*.json` + `images/`
- **内容管理**：Decap CMS（后台地址：`你的域名/admin`）
- **免费托管**：GitHub Pages
- **身份认证**：GitHub OAuth App + OAuth 代理（Vercel 免费部署）

## 部署前准备

1. 一个 GitHub 账号（当前使用：`guodiankun88`）
2. 一个 Vercel 账号（可用 GitHub 账号直接登录）
3. 本文件夹内的所有文件

## 第一步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. Repository name 填写：`guodiankun-portfolio`
3. 选择 **Public**（Public 仓库 GitHub Pages 免费）
4. 点击 **Create repository**
5. 将本文件夹下所有文件上传到仓库根目录：
   - `index.html`
   - `admin/`
   - `content/`
   - `images/`
   - `郭殿琨_简历.docx`
   - `README.md`

> 上传方式：可以直接在 GitHub 网页点击 "Add file" → "Upload files"，或使用 Git 命令行推送。

## 第二步：开启 GitHub Pages

1. 进入仓库主页，点击 **Settings**
2. 左侧选择 **Pages**
3. Source 选择 **Deploy from a branch**，Branch 选择 **main**，文件夹选择 **/(root)**
4. 点击 **Save**
5. 等待 1-3 分钟后，访问 `https://guodiankun88.github.io/guodiankun-portfolio`

## 第三步：创建 GitHub OAuth App

Decap CMS 需要通过 GitHub 账号登录，因此需要注册一个 OAuth App。

1. 访问 https://github.com/settings/developers
2. 点击 **OAuth Apps** → **New OAuth App**
3. 填写信息：
   - **Application name**：`郭殿琨作品集 CMS`
   - **Homepage URL**：`https://guodiankun88.github.io/guodiankun-portfolio`
   - **Authorization callback URL**：先填写 `https://your-oauth-proxy-url.vercel.app/callback`（后面会替换为真实地址）
4. 点击 **Register application**
5. 记下 **Client ID** 和点击 **Generate a new client secret** 后得到的 **Client secret**

## 第四步：部署 OAuth 代理到 Vercel

GitHub Pages 是纯静态托管，无法直接处理 OAuth 回调，因此需要用一个独立的 OAuth 代理。这里使用 Vercel 免费部署。

### 4.1 创建 OAuth 代理仓库

1. 访问 https://github.com/new
2. Repository name 填写：`guodiankun-portfolio-oauth`
3. 选择 **Private**（保护 Client Secret）
4. 点击 **Create repository**

### 4.2 上传 OAuth 代理代码

将本文件夹中 `oauth-proxy/` 目录下的所有文件上传到该仓库根目录：

```
oauth-proxy/
├── api/
│   ├── auth.js
│   └── callback.js
├── package.json
└── vercel.json
```

### 4.3 部署到 Vercel

1. 访问 https://vercel.com/new
2. 选择刚才创建的 `guodiankun-portfolio-oauth` 仓库
3. 点击 **Import**
4. 在 Environment Variables 中添加：
   - `GITHUB_CLIENT_ID` = 你的 GitHub OAuth Client ID
   - `GITHUB_CLIENT_SECRET` = 你的 GitHub OAuth Client secret
   - `REDIRECT_URL` = `https://guodiankun88.github.io/guodiankun-portfolio/admin/`
5. 点击 **Deploy**
6. 部署完成后，Vercel 会提供一个域名，例如 `https://guodiankun-portfolio-oauth-xxx.vercel.app`

### 4.4 更新回调地址

1. 回到 GitHub OAuth App 设置页
2. 将 **Authorization callback URL** 修改为：
   ```
   https://guodiankun-portfolio-oauth-xxx.vercel.app/callback
   ```
3. 点击 **Update application**

## 第五步：更新网站后台配置

1. 在网站仓库中找到 `admin/config.yml`
2. 找到这一行：
   ```yaml
   base_url: https://your-oauth-proxy-url.vercel.app
   ```
3. 替换为你的 OAuth 代理真实地址：
   ```yaml
   base_url: https://guodiankun-portfolio-oauth-xxx.vercel.app
   ```
4. 同样检查 `site_url` 和 `logo_url` 是否为你的真实 GitHub Pages 地址
5. 提交修改

## 第六步：登录后台编辑内容

1. 等待 GitHub Pages 重新部署（约 1 分钟）
2. 访问 `https://guodiankun88.github.io/guodiankun-portfolio/admin/`
3. 点击 **Login with GitHub**
4. 使用你的 GitHub 账号授权登录
5. 在后台左侧菜单选择要编辑的内容，例如「首页头图」「工作经历」「作品案例」等
6. 修改后点击右上角 **Publish**，Decap CMS 会自动生成 Git commit 并推送到仓库
7. GitHub Pages 会在几分钟后自动更新网站

## 文件结构说明

```
guodiankun-portfolio/
├── index.html              # 网站主页，自动读取 content/*.json 渲染内容
├── admin/
│   ├── index.html          # Decap CMS 后台入口
│   └── config.yml          # CMS 字段配置
├── content/
│   ├── profile.json        # 首页头图、姓名、简介
│   ├── about.json          # 关于我与教育背景
│   ├── strengths.json      # 核心优势
│   ├── experience.json     # 工作经历
│   ├── stats.json          # 数据亮点
│   ├── featured.json       # 重点项目
│   ├── skills.json         # 技能与工具
│   ├── portfolio.json      # 作品案例
│   ├── videos.json         # 视频作品
│   └── contact.json        # 联系方式
├── images/                 # 图片资源
├── 郭殿琨_简历.docx        # 简历下载文件
├── README.md               # 本说明文件
└── oauth-proxy/            # OAuth 代理代码（单独部署到 Vercel）
```

## 常见问题

### 后台打不开或登录失败

1. 确认 `admin/config.yml` 中的 `base_url` 已替换为正确的 Vercel 地址
2. 确认 GitHub OAuth App 的 callback URL 与 Vercel 地址一致
3. 确认 Vercel 项目的环境变量 `GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`、`REDIRECT_URL` 已正确设置
4. 在浏览器中打开 `https://你的vercel地址/auth` 应返回 GitHub 授权链接；如果没有，检查 Vercel 部署日志

### 修改内容后网站没有更新

1. GitHub Pages 部署需要 1-3 分钟，请稍等
2. 可以在仓库的 **Actions** 或 **Settings → Pages** 中查看部署状态
3. 清除浏览器缓存后刷新页面

### 想换图片怎么办

1. 进入后台编辑对应条目
2. 在图片字段点击 **Upload new** 上传新图片
3. 图片会自动保存到 `images/` 目录
4. 如果图片文件名重复，Decap CMS 会自动重命名

## 本地预览

如果你想在本地预览网站效果，可以在本文件夹内运行任意静态文件服务器：

```bash
# 如果你有 Python
python -m http.server 8000

# 或者使用 Node.js 的 http-server
npx http-server -p 8000
```

然后在浏览器打开 `http://localhost:8000`。

> 注意：本地预览时 Decap CMS 后台无法登录，因为 OAuth 回调地址必须是在线域名。

## 安全提示

- 不要将 `GITHUB_CLIENT_SECRET` 直接写入 `admin/config.yml` 或任何公开文件
- OAuth 代理仓库建议设置为 Private
- 如果怀疑 Client Secret 泄露，请到 GitHub OAuth App 设置中重新生成
