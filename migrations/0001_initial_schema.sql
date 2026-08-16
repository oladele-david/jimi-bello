-- Jimi Bello & Co. Portfolio Schema for Cloudflare D1 SQLite
CREATE TABLE IF NOT EXISTS projects (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    year TEXT NOT NULL,
    location TEXT NOT NULL,
    scope TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    body TEXT NOT NULL, -- JSON string array of paragraphs
    hero TEXT NOT NULL, -- Image path / R2 key / URL
    gallery TEXT NOT NULL, -- JSON array of { id: string, caption: string }
    shape TEXT NOT NULL DEFAULT 'square', -- 'tall' | 'wide' | 'square'
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);

CREATE TABLE IF NOT EXISTS media (
    key TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at);
