# Jimi Bello & Co. — Architecture, Interiors & Furniture

Interior architecture and handcrafted furniture portfolio web application powered by **SvelteKit 2**, **Cloudflare D1 (SQLite)**, and **Cloudflare R2 Bucket Object Storage**.

---

## 🏛 Features

- **Asymmetric Architectural Layouts**: Distinctive typography and responsive grid layout with custom aspect ratio tiles (tall 3:4, wide 16:9, square 4:3) matching the official JBC Brand Manual.
- **Studio Console (`/console`)**:
  - Secure, password-protected administrative console (obscured path).
  - Full CRUD portfolio project management.
  - Interactive layout shape selector with miniature layout preview.
  - Multi-paragraph story writer and gallery organizer with caption editing.
  - Direct Drag-and-Drop Image Uploader integrated with Cloudflare R2.
  - Live card & detail page visual previewer.
  - Cloudflare R2 Media Browser with one-click direct URL copy.
  - One-click "Reset to Defaults" seed mechanism.
- **Cloudflare Edge Backend**:
  - **Cloudflare D1**: Serverless SQLite database at the edge for sub-millisecond query responses.
  - **Cloudflare R2**: High performance zero-egress object storage for hero images and case study photography.
  - **Local Development Fallback**: Seamless offline/local storage fallback so `pnpm dev` runs immediately without mandatory cloud credentials.

---

## 🚀 Quick Start (Local Development)

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start the local development server**:
   ```bash
   pnpm run dev
   ```

3. **Access the Studio Console**:
   - Navigate to: `http://localhost:5173/console`

---

## ☁️ Cloudflare Setup & Deployment

### 1. Create the Cloudflare D1 SQLite Database
```bash
# Create D1 database on Cloudflare
npx wrangler d1 create jimi-bello-db
```
*Copy the resulting `database_id` and update `"database_id"` under `d1_databases` in `wrangler.jsonc`.*

### 2. Apply Database Migrations
```bash
# Apply schema to local test environment
npx wrangler d1 migrations apply jimi-bello-db --local

# Apply schema to remote Cloudflare production database
npx wrangler d1 migrations apply jimi-bello-db --remote
```

### 3. Create the Cloudflare R2 Image Storage Bucket
```bash
# Create R2 bucket on Cloudflare
npx wrangler r2 bucket create jimi-bello-images
```

### 4. Configure Production Console Secret & Password
```bash
# Set your secure production password
npx wrangler secret put ADMIN_PASSWORD
```

### 5. Generate Types & Deploy
```bash
# Generate worker types
pnpm run cf-typegen

# Deploy to Cloudflare
pnpm run deploy
```

---

## 🗄 Database Schema (Cloudflare D1)

```sql
CREATE TABLE IF NOT EXISTS projects (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    year TEXT NOT NULL,
    location TEXT NOT NULL,
    scope TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    body TEXT NOT NULL,       -- JSON array of paragraphs
    hero TEXT NOT NULL,       -- Image path / R2 key / URL
    gallery TEXT NOT NULL,    -- JSON array of { id, caption }
    shape TEXT NOT NULL DEFAULT 'square', -- 'tall' | 'wide' | 'square'
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS media (
    key TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

---

## 🔒 Security & Console Access

- Protected routes under `/console/*` and `/api/console/*` are guarded by `src/hooks.server.ts`.
- Sessions are authenticated using secure HTTP-only signed session cookies.
- Set `ADMIN_PASSWORD` via Cloudflare Worker Secrets (`wrangler secret put ADMIN_PASSWORD`) or in your `.env` file.
