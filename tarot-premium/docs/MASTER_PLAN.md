# Arcanum Premium UI - Master Plan

> 独立于现有 `tarot-agno/frontend` 的全新商业化级塔罗 UI，代号 **Arcanum Lux**。

---

## 1. 产品定位

**Arcanum Lux** 是一款面向 C 端用户的商业化塔罗 AI 产品前端。核心体验为：

- 沉浸式占卜仪式（问题 → 牌阵 → 抽牌动画 → AI 解读）
- 二次元魔女引导角色
- 精致卡牌收藏画廊
- 用户成长体系（每日塔罗、历史记录、成就）
- 商业化闭环（免费试用 → 订阅充值 → 高级功能）

**设计语言**：神秘深邃 + 精致金色 + 二次元角色，继承现有 Arcanum 的色彩基因，但交互和视觉全面升级。

---

## 2. 技术栈

| Layer | Tech | Version | Rationale |
|---|---|---|---|
| Framework | Next.js (App Router) | 15.x | SSR/SSG for SEO landing pages, RSC for performance |
| Language | TypeScript | 5.x | Type safety across stack |
| Styling | Tailwind CSS | 4.x | Utility-first, custom theme tokens |
| Animation | Framer Motion | 11.x | 3D card flip, spring physics, layout transitions |
| State | Zustand | 5.x | Lightweight global state (auth, reading session) |
| Data Fetching | TanStack Query | 5.x | Cache, pagination, optimistic updates |
| Icons | @phosphor-icons/react | 2.x | Consistent icon set |
| Auth | NextAuth.js | 5.x | Email + OAuth + phone |
| Payment | Stripe.js | - | Subscription + one-time purchases |
| i18n | next-intl | 4.x | Type-safe bilingual zh/en |
| Canvas | @react-three/fiber (optional) | - | Advanced particle/card effects if needed |

---

## 3. Design Tokens

### 3.1 Color Palette

继承现有 Arcanum 色彩基因，扩展为完整设计系统：

```
Core Dark (Base)
  void          #06060F   最深背景
  abyss         #0B0B1A   面板/抽屉背景
  midnight      #111128   卡片/气泡背景
  obsidian      #1A1A35   悬停态/提升面
  onyx          #252545   分割线/边框

Gold Accent (Primary)
  gold-50       #FDF8ED   极浅金 (tooltip bg)
  gold-100      #F5E6C0   浅金
  gold-200      #E8D5B5   柔金
  gold-300      #D4B88C   中金
  gold-400      #C9A84C   主金 (品牌色)
  gold-500      #B8942E   深金 (hover)
  gold-600      #9A7B24   暗金 (active)
  gold-glow     rgba(201,168,76,0.15)  金色辉光

Arcane (Secondary)
  arcane-deep   #1E1B4B   深靛 (用户气泡)
  arcane-mid    #312E81   中靛
  arcane-glow   #6366F1   亮靛 (加载/推理中)

Semantic
  success       #34D399   翡翠绿
  warning       #FBBF24   琥珀黄
  danger        #F87171   柔红
  info          #60A5FA   天蓝

Special
  card-back     #1A1040   卡背底色
  card-glow     rgba(201,168,76,0.3)  翻牌辉光
  ritual-purple #7C3AED   仪式紫 (高级/稀有)
```

### 3.2 Typography

```
Display     "Cinzel Decorative"  serif    品牌标题、Logo
Heading     "Outfit"             sans     页面标题、卡片名称 (weight 500/600/700)
Body        "Source Serif 4"     serif    正文、解读文本、文学性内容
UI          "Outfit"             sans     按钮、导航、表单、UI 控件
Mono        "JetBrains Mono"     mono     编号、日期、数据标签
```

### 3.3 Spacing & Layout

```
Page max-width:    1400px (content) / full-bleed (hero/backgrounds)
Section gap:       6rem (96px) desktop / 4rem (64px) mobile
Card border-radius: 16px (large) / 12px (medium) / 8px (small)
Glass border:      1px solid rgba(201,168,76,0.08)
Glass shadow:      inset 0 1px 0 rgba(255,255,255,0.05)
```

---

## 4. Page Architecture

### 4.1 页面总览

| # | Route | Name | Auth | Layout | Priority |
|---|---|---|---|---|---|
| 1 | `/` | Landing | No | Marketing | P0 |
| 2 | `/auth/login` | Login | No | Auth | P0 |
| 3 | `/auth/register` | Register | No | Auth | P0 |
| 4 | `/reading` | Reading Room | Yes | App | P0 |
| 5 | `/gallery` | Card Gallery | Yes | App | P1 |
| 6 | `/daily` | Daily Tarot | Yes | App | P1 |
| 7 | `/history` | Reading History | Yes | App | P1 |
| 8 | `/profile` | User Profile | Yes | App | P2 |
| 9 | `/pricing` | Subscription | Yes | App | P0 |
| 10 | `/settings` | Settings | Yes | App | P2 |
| 11 | `/admin` | Admin Panel | Admin | Admin | P3 |

### 4.2 App Shell (Authenticated Layout)

```
+----------------------------------------------------------+
|  Top Bar: Logo | [Daily] [Reading] [Gallery] | Avatar/Menu |
+----------------------------------------------------------+
|        |                                                   |
|  Side  |                                                   |
|  Nav   |              Main Content Area                    |
|        |                                                   |
|  - 占卜 |                                                   |
|  - 画廊 |                                                   |
|  - 每日 |                                                   |
|  - 历史 |                                                   |
|  - 我的 |                                                   |
|        |                                                   |
+--------+---------------------------------------------------+
|  Bottom: Legal links | Language toggle | Version           |
+----------------------------------------------------------+
```

**Mobile**: Side nav collapses to bottom tab bar (5 icons).

---

## 5. Detailed Page Specifications

### 5.1 Landing Page (`/`)

**目的**：转化访客为注册用户。

**Sections**:

1. **Hero** (min-h-[100dvh])
   - 全屏视差星空背景 (3 层: 远景星点 + 中景星云 + 近景微尘)
   - 魔女角色立绘 (居中偏左, anime 全身)
   - 右侧: 品牌名 "Arcanum" + 标语 + CTA 按钮
   - 底部: 向下滚动指示 (金色箭头 bounce 动画)
   - 禁止居中布局 → 左文右图 Split Screen

2. **Feature Showcase** (不对称 2-col 布局)
   - Feature 1: 沉浸式占卜 (左图右文, 45/55)
   - Feature 2: AI 解读 (右图左文, 55/45)
   - Feature 3: 卡牌收藏 (左图右文, 45/55)
   - 每个 feature 滚动进入视口时 staggered reveal

3. **How It Works** (3 步引导, 水平时间线)
   - Step 1: 提出问题
   - Step 2: 仪式抽牌
   - Step 3: 获取解读
   - 每步配独立 SVG icon + 短动画

4. **Pricing Teaser** (2 列卡片)
   - Free tier vs Premium tier
   - 对比表 + CTA "开始免费体验"

5. **Footer**
   - 法律声明 | 隐私政策 | 联系我们
   - 社交媒体 icons

**交互**:
- 滚动视差 (framer-motion useScroll + useTransform)
- 各 section 进入视口 staggered fade-up
- Hero CTA 按钮 magnetic hover + gold shimmer

---

### 5.2 Auth Pages (`/auth/*`)

**Login**:
- 居中卡片式布局, 磨砂玻璃背景
- 邮箱/密码输入
- "记住我" checkbox
- 第三方登录 (Google, Apple)
- 底部 "没有账号？注册" 链接

**Register**:
- 邮箱 + 密码 + 确认密码
- 用户协议 checkbox (必须勾选)
- 注册成功后跳转 onboarding (首次引导)

**设计**:
- 背景: 深空 + 缓慢旋转的魔法阵
- 卡片: glass morphism + gold border-top gradient
- 输入框: dark inset style, focus 时 gold ring
- 按钮: gold gradient, active scale(0.98)

---

### 5.3 Reading Room (`/reading`) — 核心页面

**这是产品的灵魂。整个占卜流程分为 4 个阶段，每个阶段有独立的视觉状态。**

#### Phase 0: Consultation (咨询)

**布局**: 魔女角色 + 对话气泡

- 魔女立绘 (站立/欢迎表情, 居中偏左)
- 对话气泡 (右侧): "你好，旅人。今天想探寻什么？"
- 下方: 问题输入框 (宽 textarea, 金色边框)
- 底部: 牌阵选择 (4 个卡片式选项, 带图示)
  - 单牌占卜 (1 张)
  - 三牌牌阵 (3 张)
  - 关系牌阵 (7 张)
  - 凯尔特十字 (10 张)
- 每个牌阵卡片显示: 名称 + 简述 + 适用场景
- "开始占卜" 按钮 (gold, large, disabled 直到输入问题)

#### Phase 1: Ritual (仪式抽牌)

**全屏沉浸式动画序列**:

1. **Shuffle** (2s)
   - 78 张卡背从屏幕四角飞入
   - 卡牌在中央形成扇形堆叠
   - 金色粒子环绕
   - 魔女台词: "牌已准备好..."

2. **Deal** (1.5s)
   - 根据选择的牌阵, 卡牌从牌堆滑出
   - 3D perspective, 卡背朝上
   - 每张牌有 stagger delay (200ms)
   - 到位后轻微 float 动画

3. **Reveal** (每张 1s, staggered)
   - 用户点击/自动翻牌
   - 3D Y-axis rotation (back → front)
   - 翻牌瞬间: 金色光芒 burst + 粒子
   - 牌面显示: 二次元卡面 + 名称 + 正/逆位标记
   - 逆位牌: 180° 旋转 + 紫色边框 (区别于正位的金色)
   - 翻牌音效 (可选, Web Audio API)

4. **Complete** (0.5s)
   - 所有牌翻完后, 魔法阵光线连接各牌
   - 魔女台词: "让我为你解读..."
   - 过渡到 Phase 2

#### Phase 2: Interpretation (AI 解读)

**布局**: 上方固定牌面 + 下方流式解读

- 顶部: 已翻开的卡牌横排展示 (可点击查看详情)
- 中部: 魔女半身像 + 解读气泡
- 解读文字: 流式输出 (SSE), 打字机效果
- 解读结构:
  - 整体主题 (大号字, 金色)
  - 逐牌解读 (可折叠 accordion)
  - 牌间对话
  - 建议行动
- 底部: "保存解读" + "新占卜" 按钮

#### Phase 3: Complete

- 解读完成提示
- "分享结果" (生成精美图片卡片)
- "记录日记" (可选文字备注)
- "返回首页" / "再来一次"

**技术要求**:
- 所有动画使用 Framer Motion, spring physics (stiffness: 100, damping: 20)
- 3D 翻牌: `perspective: 1200px`, `rotateY` with `transformStyle: "preserve-3d"`
- 粒子: Canvas 2D (避免引入 three.js 的开销)
- 抽牌状态机: Zustand store, phases: idle → shuffling → dealing → revealing → interpreting → complete

---

### 5.4 Card Gallery (`/gallery`)

**布局**: Masonry / 响应式网格

- 筛选栏: All | Major Arcana (22) | Cups | Swords | Wands | Pentacles
- 搜索框 (按名称搜索)
- 卡牌网格:
  - 默认显示卡背 (hover 翻转预览)
  - 已解锁的牌显示正面
  - 每张牌下方: 名称 + 编号
- 点击卡牌 → 全屏 Detail Modal:
  - 左侧: 大尺寸卡面
  - 右侧: 含义 (正位/逆位 tabs)
  - 关键词 tags
  - 元素/星座对应
  - 历史解读次数 (如果有)

**Masonry breakpoints**:
- Mobile: 3 columns
- Tablet: 4-5 columns
- Desktop: 6-7 columns

---

### 5.5 Daily Tarot (`/daily`)

**目的**: 每日留存 + 仪式感

- 每日免费一次单牌抽取
- 展示: 今日日期 + 月相 + 节气
- 抽牌动画 (简化版)
- 解读 + 今日运势提示
- 连续签到计数 (streak)
- "分享给朋友" 按钮 (生成精美日签图片)
- 倒计时: 距离下次免费抽取 XX:XX:XX

---

### 5.6 Reading History (`/history`)

- 时间线布局 (左侧时间, 右侧摘要卡片)
- 每条记录: 日期 + 问题摘要 + 牌阵类型 + 抽到的牌缩略图
- 筛选: 按日期范围 / 牌阵类型
- 搜索: 全文搜索历史解读
- 点击 → 查看完整解读详情 (复用 Phase 2 布局)
- 导出: PDF / 分享图片

---

### 5.7 User Profile (`/profile`)

**Header**: 头像 + 昵称 + 等级 + 订阅状态徽章

**Stats Cards** (不对称网格, 2+1 布局):
- 总占卜次数
- 连续签到天数
- 已收集卡牌数 / 78
- 最常用牌阵
- 最常出现的牌 (favorite card)

**Sections**:
- 成就徽章 (成就系统, 如 "首次凯尔特十字", "收集全部大阿卡纳")
- 最近解读 (最近 5 条)
- 账号信息 (邮箱, 注册时间)

---

### 5.8 Pricing (`/pricing`)

**布局**: 2 列对比卡片 (不对称, 推荐项突出)

| | Free | Premium |
|---|---|---|
| 每日塔罗 | 1 次/天 | 无限 |
| 牌阵 | 单牌 + 三牌 | 全部 4 种 |
| AI 解读 | 基础 | 深度 + 多风格 |
| 历史记录 | 最近 7 天 | 全部 |
| 卡牌画廊 | 卡背预览 | 完整解锁 |
| 分享导出 | 基础 | 精美模板 |
| 价格 | 免费 | ¥29.9/月 或 ¥199/年 |

- 年付折扣标签 (-44%)
- 支付方式: 微信支付 / 支付宝 / Stripe
- 7 天免费试用 CTA
- FAQ accordion (常见问题)
- 已订阅用户 → 显示当前计划 + 管理入口

---

### 5.9 Settings (`/settings`)

- 语言: 中文 / English
- 主题: 深色 (默认) / 更深色
- 通知: 每日塔罗提醒 (时间选择)
- 账号: 修改密码 / 绑定手机
- 数据: 清除缓存 / 导出个人数据
- 关于: 版本号 / 开源协议

---

### 5.10 Admin Panel (`/admin`) — P3

- 仪表盘: DAU / 收入 / 新增用户
- 用户管理: 列表 / 搜索 / 封禁 / 调级
- 内容审核: AI 输出审核 (flagged items)
- 数据导出: CSV / JSON

---

## 6. Core Components

### 6.1 Shared Components

| Component | File | Description |
|---|---|---|
| `AppShell` | `components/layout/AppShell.tsx` | Authenticated layout wrapper (top nav + side nav + content) |
| `TopNav` | `components/layout/TopNav.tsx` | Top navigation bar with user menu |
| `SideNav` | `components/layout/SideNav.tsx` | Side navigation (desktop) / bottom tab bar (mobile) |
| `StarfieldBG` | `components/effects/StarfieldBG.tsx` | Multi-layer parallax starfield background |
| `MagicCircle` | `components/effects/MagicCircle.tsx` | SVG rotating magic circle decoration |
| `GoldParticles` | `components/effects/GoldParticles.tsx` | Canvas-based gold particle system |
| `GlassCard` | `components/ui/GlassCard.tsx` | Glassmorphism card with gold border |
| `GoldButton` | `components/ui/GoldButton.tsx` | Primary CTA button (gold gradient + shimmer) |
| `InputField` | `components/ui/InputField.tsx` | Dark inset input with gold focus ring |
| `Modal` | `components/ui/Modal.tsx` | Overlay modal with backdrop blur |
| `Accordion` | `components/ui/Accordion.tsx` | Collapsible content sections |
| `TabGroup` | `components/ui/TabGroup.tsx` | Tab switcher (for upright/reversed, etc.) |
| `Skeleton` | `components/ui/Skeleton.tsx` | Loading skeleton (matching layout) |
| `EmptyState` | `components/ui/EmptyState.tsx` | Beautiful empty state placeholder |
| `Toast` | `components/ui/Toast.tsx` | Notification toast system |
| `WitchAvatar` | `components/character/WitchAvatar.tsx` | Witch character display (with expression variants) |
| `DialogueBubble` | `components/character/DialogueBubble.tsx` | Witch speech bubble with typewriter |
| `TarotCard` | `components/card/TarotCard.tsx` | Single tarot card (front/back, 3D flip) |
| `CardStack` | `components/card/CardStack.tsx` | Stacked card deck animation |
| `SpreadLayout` | `components/card/SpreadLayout.tsx` | Card spread position layout |

### 6.2 Reading State Machine

```typescript
type ReadingPhase =
  | 'idle'           // 等待开始
  | 'consultation'   // 问题输入 + 牌阵选择
  | 'shuffling'      // 洗牌动画
  | 'dealing'        // 发牌动画
  | 'revealing'      // 翻牌 (逐张)
  | 'interpreting'   // AI 解读流式输出
  | 'complete'       // 解读完成
  | 'error';         // 出错

interface ReadingSession {
  id: string;
  question: string;
  spreadType: SpreadType;
  drawnCards: DrawnCard[];
  phase: ReadingPhase;
  interpretation: string | null;
  createdAt: Date;
}
```

---

## 7. File Structure

```
tarot-premium/
├── docs/
│   └── MASTER_PLAN.md          (本文件；生图清单已迁移到 ../tarot-imagegen/docs/ASSETS.md)
├── public/
│   ├── fonts/                   (self-hosted web fonts)
│   ├── images/                  (static images)
│   │   ├── witch/               (魔女角色立绘)
│   │   ├── cards/               (卡牌图片)
│   │   ├── backgrounds/         (背景图)
│   │   └── ui/                  (UI 装饰图)
│   └── audio/                   (翻牌音效, 可选)
├── src/
│   ├── app/                     (Next.js App Router)
│   │   ├── layout.tsx           (Root layout)
│   │   ├── page.tsx             (Landing)
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx       (AppShell)
│   │   │   ├── reading/page.tsx
│   │   │   ├── gallery/page.tsx
│   │   │   ├── daily/page.tsx
│   │   │   ├── history/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   └── settings/page.tsx
│   │   └── admin/
│   │       └── page.tsx
│   ├── components/
│   │   ├── layout/              (AppShell, TopNav, SideNav)
│   │   ├── effects/             (StarfieldBG, MagicCircle, Particles)
│   │   ├── ui/                  (GlassCard, GoldButton, Input, Modal...)
│   │   ├── card/                (TarotCard, CardStack, SpreadLayout)
│   │   ├── character/           (WitchAvatar, DialogueBubble)
│   │   ├── reading/             (ReadingFlow, PhaseController)
│   │   └── sections/            (Landing page sections)
│   ├── hooks/
│   │   ├── useReadingSession.ts
│   │   ├── useCardAnimation.ts
│   │   ├── useSSEStream.ts
│   │   └── useAuth.ts
│   ├── stores/
│   │   ├── readingStore.ts      (Zustand: reading session state)
│   │   ├── authStore.ts         (Zustand: user auth state)
│   │   └── uiStore.ts           (Zustand: UI state)
│   ├── lib/
│   │   ├── api.ts               (API client)
│   │   ├── tarot-data.ts        (Card data, spreads)
│   │   ├── animations.ts        (Framer Motion variants)
│   │   └── constants.ts         (Config values)
│   ├── types/
│   │   ├── card.ts              (Card, Spread, Reading types)
│   │   └── api.ts               (API response types)
│   └── i18n/
│       ├── zh.ts
│       └── en.ts
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.local.example
```

---

## 8. Animation Specifications

### 8.1 Card Flip (翻牌)

```typescript
// 3D perspective container
const cardContainer = {
  perspective: 1200,
  transformStyle: "preserve-3d" as const,
};

// Flip animation
const flipVariants = {
  hidden: { rotateY: 0 },     // 卡背
  visible: {
    rotateY: 180,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],  // custom cubic-bezier
    },
  },
};

// Glow burst on reveal
const glowBurst = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: [0, 1, 0],
    scale: [0.5, 2, 3],
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
```

### 8.2 Shuffle (洗牌)

```typescript
const shuffleVariants = {
  // Cards fly in from random positions
  entry: (i: number) => ({
    x: Math.random() * 800 - 400,
    y: Math.random() * 600 - 300,
    rotate: Math.random() * 360,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      delay: i * 0.02,
    },
  }),
  // Stack in center
  stacked: {
    x: 0,
    y: 0,
    rotate: 0,
    opacity: 1,
  },
};
```

### 8.3 Spread Deal (发牌)

```typescript
// Position map for each spread type
const SPREAD_POSITIONS = {
  single_card: [{ x: 0, y: 0 }],
  three_card: [
    { x: -200, y: 0 },
    { x: 0, y: 0 },
    { x: 200, y: 0 },
  ],
  celtic_cross: [
    { x: 0, y: 0 },       // present
    { x: 0, y: 0, r: 90 }, // challenge (cross)
    { x: 0, y: 150 },     // distant past
    // ... etc
  ],
};
```

### 8.4 Starfield Parallax

```typescript
// 3-layer parallax on scroll
const layer1 = useTransform(scrollY, [0, 1000], [0, -100]);  // far stars
const layer2 = useTransform(scrollY, [0, 1000], [0, -200]);  // mid nebula
const layer3 = useTransform(scrollY, [0, 1000], [0, -50]);   // near dust
```

---

## 9. API Integration

复用现有 `tarot-agno/backend` 的所有端点：

```
POST /api/v1/chat          SSE streaming (解读)
GET  /api/v1/health        健康检查
```

新增端点 (后端需扩展):

```
POST /api/v1/auth/login
POST /api/v1/auth/register
POST /api/v1/auth/refresh
GET  /api/v1/user/profile
PUT  /api/v1/user/profile
GET  /api/v1/readings           历史记录列表
GET  /api/v1/readings/:id       单条解读详情
POST /api/v1/readings/:id/save  保存解读
DELETE /api/v1/readings/:id     删除解读
GET  /api/v1/daily              今日塔罗
GET  /api/v1/cards              卡牌列表 (含解锁状态)
POST /api/v1/subscription/create
GET  /api/v1/subscription/status
```

---

## 10. Development Phases

### Phase 1: Foundation (Week 1-2)
- [x] 项目规划 & 资产清单
- [ ] Next.js 脚手架 + Tailwind 主题
- [ ] Shared layout (AppShell)
- [ ] 基础 UI 组件库 (GlassCard, GoldButton, Input)
- [ ] 星场背景 + 魔法阵效果

### Phase 2: Core Reading (Week 3-4)
- [ ] 占卜室页面 (Consultation phase)
- [ ] 洗牌 + 发牌动画
- [ ] 3D 翻牌动画
- [ ] SSE 解读流
- [ ] 魔女角色集成

### Phase 3: Gallery & History (Week 5)
- [ ] 卡牌画廊
- [ ] 历史记录列表
- [ ] 解读详情查看

### Phase 4: Auth & User (Week 6)
- [ ] 登录/注册
- [ ] 用户中心
- [ ] 每日塔罗

### Phase 5: Commerce (Week 7)
- [ ] Landing page
- [ ] Pricing page
- [ ] Stripe 集成

### Phase 6: Polish (Week 8)
- [ ] 动画精调
- [ ] 性能优化
- [ ] Mobile 适配测试
- [ ] i18n 完善

---

## 11. Performance Budget

| Metric | Target |
|---|---|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Bundle size (initial) | < 200KB gzipped |
| Card flip animation | 60fps |
| Starfield canvas | < 5% CPU idle |

---

## 12. Browser Support

- Chrome/Edge 90+
- Safari 15+
- Firefox 100+
- Mobile: iOS 15+, Android 10+
