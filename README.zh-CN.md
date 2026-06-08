# Arcanum Lux

> 沉浸式 AI 塔罗占卜应用 —— 在星辰与牌阵之间，找到属于你的答案。

Arcanum Lux 是一款开源的 AI 塔罗占卜前端应用，采用 BYOK（Bring Your Own Key，自带密钥）模式运行。用户通过浏览器内置的设置页面配置自己的 OpenAI 兼容 API 密钥，所有塔罗牌数据与占卜历史均保存在浏览器本地存储中，无需任何后端服务。

---

## 特性

- **沉浸式占卜仪式** —— 从提出问题到翻开每一张牌，完整的仪式化体验，包含 3D 翻牌动画、金色粒子特效与魔法阵装饰
- **AI 深度解读** —— 融合传统塔罗学识与现代心理学视角，AI 塔罗师提供连贯、深入且充满神秘感的对话式解读
- **78 张精致卡牌** —— 二次元风格绘制的完整塔罗牌组（22 张大阿卡纳 + 56 张小阿卡纳），附带画廊收藏系统
- **多种牌阵支持** —— 单牌占卜、三牌牌阵、凯尔特十字、关系牌阵
- **每日塔罗** —— 每日一张牌，配合连续签到机制
- **双语支持** —— 完整的中英文双语界面与解读内容
- **BYOK 模式** —— 用户自带 OpenAI 兼容 API Key，纯前端静态部署，零服务器成本
- **本地数据** —— 所有占卜历史、用户配置均存储在浏览器本地，隐私友好
- **视觉盛宴** —— 星空视差背景、极光效果、磨砂玻璃 UI、金色渐变主题

## 技术栈

| 层级 | 技术 | 版本 |
|---|---|---|
| 框架 | Next.js (App Router, 静态导出) | 15.x |
| 语言 | TypeScript (严格模式) | 5.x |
| UI 库 | React | 19.x |
| 样式 | Tailwind CSS | 4.x |
| 动画 | Framer Motion | 11.x |
| 状态管理 | Zustand (本地持久化) | 5.x |
| 图标 | Phosphor Icons | 2.x |
| 图片优化 | sharp | 0.34.x |

## 快速开始

### 环境要求

- **Node.js** >= 18
- **npm** >= 9（或其他兼容包管理器）

### 安装与运行

```bash
# 克隆仓库
git clone <repository-url>
cd arcanum-lux

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 `http://localhost:3000`，进入 `/settings` 页面配置：

1. **API Key** —— 你的 OpenAI 兼容 API 密钥
2. **Base URL** —— API 端点地址（默认 `https://api.openai.com/v1`）
3. **Model** —— 模型名称（默认 `gpt-4.1-mini`）

配置完成后，前往 `/reading` 开始占卜。

## 页面路由

| 路由 | 说明 |
|---|---|
| `/` | 着陆页（品牌展示、功能介绍、定价方案） |
| `/reading` | 占卜室 —— BYOK 塔罗对话，三牌牌阵，仪式化翻牌流程 |
| `/gallery` | 卡牌画廊 —— 浏览 78 张塔罗牌 |
| `/daily` | 每日塔罗 —— 每日一抽 |
| `/history` | 占卜历史 —— 查看过往解读记录 |
| `/profile` | 个人空间 —— 统计数据与成就 |
| `/pricing` | 方案定价 —— BYOK/免费方案与未来托管方案说明 |
| `/settings` | 设置 —— API 密钥配置、语言选择、本地数据管理 |

## 部署指南

### 本地构建与预览

```bash
# 构建静态站点
npm run build

# 预览构建结果
npm run preview
```

构建产物输出至 `out/` 目录，可直接部署到任何静态文件托管服务。

### Vercel 部署

#### 方式一：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目根目录执行部署
vercel

# 生产环境部署
vercel --prod
```

#### 方式二：通过 GitHub 集成（推荐）

1. 将代码推送至 GitHub 仓库
2. 登录 [Vercel](https://vercel.com)，点击 **New Project**
3. 导入你的 GitHub 仓库
4. 配置构建参数：
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
   - **Install Command**: `npm install`
5. 点击 **Deploy**，等待构建完成

#### Vercel 环境变量（可选）

本项目为纯前端静态导出，**不需要**在服务端配置环境变量。用户的 API Key 在浏览器端配置并存储在 localStorage 中。

### 其他平台

`out/` 目录同样适用于 Netlify、Cloudflare Pages、GitHub Pages 或任何静态文件服务器。

> **注意**：BYOK 模式要求用户配置的模型提供商允许来自部署站点的 CORS 请求。如果提供商阻止浏览器请求，需要使用支持 CORS 的 OpenAI 兼容网关，或添加 Serverless 代理层。

## 素材优化

原始素材保存在 `assets/original-images/` 目录下，运行时使用的图片是优化后的 WebP 格式，存放于 `public/images/` 目录。

```bash
# 重新生成优化后的 WebP 图片
npm run assets:optimize
```

该脚本会自动将 `assets/original-images/` 中的原图转换为 WebP 并输出到 `public/images/`，原始素材不会被修改。

## 许可证

本项目采用**双重许可**模式，代码与素材分别适用不同的许可条款。

### 代码部分

源代码基于 [GNU General Public License v3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl-3.0.html) 发布，**附加以下限制条款**：

> **禁止商业化使用**：在 GPL-3.0 授予的权利之外，**明确禁止**将本项目的源代码或其任何修改版本（衍生作品）用于商业目的，包括但不限于：
>
> - 将修改后的代码作为商业产品或服务的一部分进行分发或销售
> - 将修改后的代码部署为付费服务或订阅制产品
> - 将本项目代码整合至闭源专有软件中
>
> 如需商业授权，请联系项目作者获取单独的商业许可协议。

### 素材与提示词部分

本项目包含的非代码素材——如图片素材、提示词素材等——基于 [Creative Commons 署名-非商业性使用-禁止演绎 4.0 国际许可协议 (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/) 发布，**并附加以下限制条款**：

> 在 CC BY-NC-ND 4.0 协议授予的权利之外，**明确禁止**以下使用方式：
>
> - 以任何形式再分发上述素材，无论是否经过修改
> - 将上述素材用于任何其他项目、产品或服务（包括非商业项目）
> - 将上述素材纳入任何面向第三方分发的汇编或打包作品中
>
> 如需上述范围以外的使用授权（包括商业许可），请联系版权所有者获取书面授权。

### 联系与授权

如需获取商业许可或素材使用授权，请通过以下方式联系：

- 邮箱：tarot@xter.org

---

## 友情链接

- [Linux.do](https://linux.do)

<p align="center">
  <sub>Arcanum Lux — 塔罗仅供娱乐与自我反思。</sub>
</p>
