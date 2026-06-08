# Arcanum Lux

> An immersive AI-powered tarot reading app — find your answers between the stars and the spreads.

Arcanum Lux is an open-source AI tarot reading frontend built with the BYOK (Bring Your Own Key) model. Users configure their own OpenAI-compatible API key through an in-browser settings page, while all tarot card data and reading history are persisted in local browser storage — no backend required.

---

## Features

- **Immersive Reading Ritual** — A full ceremonial experience from posing your question to revealing each card, complete with 3D flip animations, gold particle effects, and magic circle decorations
- **AI Deep Interpretation** — Blending traditional tarot wisdom with modern psychological insight, the AI reader delivers coherent, mystical, dialogue-based interpretations
- **78 Illustrated Cards** — A complete anime-style tarot deck (22 Major Arcana + 56 Minor Arcana) with a collectible card gallery
- **Multiple Spreads** — Single Card, Three-Card Spread, Celtic Cross, and Relationship Cross
- **Daily Tarot** — Draw one card per day with a streak counter
- **Bilingual** — Full Chinese and English interface and readings
- **BYOK Model** — Users bring their own OpenAI-compatible API key; pure static frontend with zero server cost
- **Local-first Data** — All reading history and user settings stay in the browser; privacy-friendly
- **Visual Spectacle** — Parallax starfield, aurora glow, glassmorphism UI, and a gold-gradient design system

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, Static Export) | 15.x |
| Language | TypeScript (Strict Mode) | 5.x |
| UI Library | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| Animation | Framer Motion | 11.x |
| State | Zustand (with persistence) | 5.x |
| Icons | Phosphor Icons | 2.x |
| Image Optimization | sharp | 0.34.x |

## Quick Start

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9 (or any compatible package manager)

### Install and Run

```bash
# Clone the repository
git clone <repository-url>
cd arcanum-lux

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:3000`, navigate to `/settings`, and configure:

1. **API Key** — Your OpenAI-compatible API key
2. **Base URL** — The API endpoint (default: `https://api.openai.com/v1`)
3. **Model** — The model name (default: `gpt-4.1-mini`)

Once configured, head to `/reading` to begin your first tarot session.

## Routes

| Route | Description |
|---|---|
| `/` | Landing page (branding, features, pricing overview) |
| `/reading` | Reading Room — BYOK tarot dialogue with three-card spread and ritual flow |
| `/gallery` | Card Gallery — Browse all 78 tarot cards |
| `/daily` | Daily Tarot — Draw one card per day |
| `/history` | Reading History — Review past interpretations |
| `/profile` | Profile — Stats and achievements |
| `/pricing` | Pricing — BYOK/free tier and future hosted plan notes |
| `/settings` | Settings — API key configuration, language, local data controls |

## Deployment

### Local Build and Preview

```bash
# Build the static site
npm run build

# Preview the built output
npm run preview
```

The static site is exported to the `out/` directory, which can be deployed to any static hosting provider.

### Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from the project root
vercel

# Deploy to production
vercel --prod
```

#### Option B: GitHub Integration (Recommended)

1. Push your code to a GitHub repository
2. Log in to [Vercel](https://vercel.com) and click **New Project**
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
   - **Install Command**: `npm install`
5. Click **Deploy** and wait for the build to complete

#### Vercel Environment Variables (Optional)

This project is a pure static frontend export and **does not require** any server-side environment variables. Users configure their API key in the browser, stored in `localStorage`.

### Other Platforms

The `out/` directory works equally well with Netlify, Cloudflare Pages, GitHub Pages, or any static file server.

> **CORS Note**: BYOK mode requires the user's model provider to allow CORS requests from the deployed site's origin. If the provider blocks browser requests, use a CORS-enabled OpenAI-compatible gateway or add a serverless proxy.

## Asset Optimization

Original artwork is kept under `assets/original-images/`. Runtime images served from `public/images/` are generated WebP files.

```bash
# Regenerate optimized WebP images from source artwork
npm run assets:optimize
```

The script converts source PNGs from `assets/original-images/` into optimized WebP assets in `public/images/`. Original artwork is preserved and never overwritten.

## License

This project uses a **dual-license** model: source code and creative assets are governed by separate license terms.

### Source Code

The source code is licensed under the [GNU General Public License v3.0 (GPL-3.0)](https://www.gnu.org/licenses/gpl-3.0.html), **with the following additional restriction**:

> **No Commercial Use**: Beyond the rights granted by the GPL-3.0, the following uses are **expressly prohibited**:
>
> - Distributing or selling modified versions of this code as part of a commercial product or service
> - Deploying modified code as a paid service, subscription product, or any revenue-generating offering
> - Integrating this code into closed-source proprietary software
>
> For commercial licensing inquiries, please contact the project author to obtain a separate commercial license agreement.

### Creative Assets and Prompts

All non-code creative materials included in this project — such as image assets, prompt materials, and related content — are licensed under the [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/), **with the following additional restrictions**:

> Beyond the terms of CC BY-NC-ND 4.0, the following uses are **expressly prohibited**:
>
> - Redistributing the materials in any form, whether modified or unmodified
> - Using the materials in any other project, product, or service (including non-commercial projects)
> - Incorporating the materials into any compiled or bundled work for third-party distribution
>
> For any use not explicitly permitted above (including commercial licensing), please contact the copyright holder to obtain written authorization.

### Contact and Licensing

To request commercial licensing or asset usage permissions, please reach out via:

- Email: tarot@xter.org

---

## Links

- [Linux.do](https://linux.do)

<p align="center">
  <sub>Arcanum Lux — Tarot is for entertainment and self-reflection only.</sub>
</p>
