import { projects as defaultProjects, type Project } from '$lib/data/site';
import { dev } from '$app/environment';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export interface MediaItem {
	key: string;
	url: string;
	filename: string;
	content_type: string;
	size: number;
	created_at?: string;
}

// Local filesystem fallback storage for Vite dev mode
const LOCAL_DEV_DIR = join(process.cwd(), '.svelte-kit', 'local-db');
const LOCAL_PROJECTS_FILE = join(LOCAL_DEV_DIR, 'projects.json');
const LOCAL_MEDIA_FILE = join(LOCAL_DEV_DIR, 'media.json');

function getLocalProjects(): Project[] {
	try {
		if (existsSync(LOCAL_PROJECTS_FILE)) {
			const data = readFileSync(LOCAL_PROJECTS_FILE, 'utf-8');
			return JSON.parse(data);
		}
	} catch (err) {
		console.warn('Failed reading local dev projects store:', err);
	}
	// Initial seed for local dev
	return [...defaultProjects];
}

function saveLocalProjects(items: Project[]) {
	try {
		if (!existsSync(LOCAL_DEV_DIR)) {
			mkdirSync(LOCAL_DEV_DIR, { recursive: true });
		}
		writeFileSync(LOCAL_PROJECTS_FILE, JSON.stringify(items, null, 2), 'utf-8');
	} catch (err) {
		console.error('Failed saving local dev projects store:', err);
	}
}

function getLocalMedia(): MediaItem[] {
	try {
		if (existsSync(LOCAL_MEDIA_FILE)) {
			const data = readFileSync(LOCAL_MEDIA_FILE, 'utf-8');
			return JSON.parse(data);
		}
	} catch {
		// Ignore
	}
	return [];
}

function saveLocalMedia(items: MediaItem[]) {
	try {
		if (!existsSync(LOCAL_DEV_DIR)) {
			mkdirSync(LOCAL_DEV_DIR, { recursive: true });
		}
		writeFileSync(LOCAL_MEDIA_FILE, JSON.stringify(items, null, 2), 'utf-8');
	} catch (err) {
		console.error('Failed saving local media store:', err);
	}
}

/**
 * Initialize Cloudflare D1 database schema if needed and seed initial data.
 */
export async function ensureDbInitialized(db: D1Database) {
	try {
		// Create tables
		await db.exec(`
			CREATE TABLE IF NOT EXISTS projects (
				slug TEXT PRIMARY KEY,
				title TEXT NOT NULL,
				category TEXT NOT NULL,
				year TEXT NOT NULL,
				location TEXT NOT NULL,
				scope TEXT NOT NULL,
				excerpt TEXT NOT NULL,
				body TEXT NOT NULL,
				hero TEXT NOT NULL,
				gallery TEXT NOT NULL,
				shape TEXT NOT NULL DEFAULT 'square',
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
		`);

		// Check if empty, seed defaults
		const countResult = await db.prepare('SELECT COUNT(*) as count FROM projects').first<{ count: number }>();
		if (!countResult || countResult.count === 0) {
			await seedDefaultProjects({ env: { DB: db } });
		}
	} catch (err) {
		console.error('Error during ensureDbInitialized:', err);
	}
}

/**
 * Retrieve all projects ordered by display order then creation date.
 */
export async function getProjects(platform?: App.Platform): Promise<Project[]> {
	const db = platform?.env?.DB;

	if (!db) {
		return getLocalProjects();
	}

	try {
		await ensureDbInitialized(db);
		const { results } = await db
			.prepare('SELECT * FROM projects ORDER BY display_order ASC, created_at DESC')
			.all<Record<string, any>>();

		if (!results || results.length === 0) {
			return defaultProjects;
		}

		return results.map((row) => ({
			slug: String(row.slug),
			title: String(row.title),
			category: row.category as any,
			year: String(row.year),
			location: String(row.location),
			scope: String(row.scope),
			excerpt: String(row.excerpt),
			body: typeof row.body === 'string' ? JSON.parse(row.body) : row.body,
			hero: String(row.hero),
			gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery) : row.gallery,
			shape: (row.shape || 'square') as any
		}));
	} catch (err) {
		console.error('getProjects D1 error:', err);
		return getLocalProjects();
	}
}

/**
 * Retrieve a single project by its slug.
 */
export async function getProjectBySlug(slug: string, platform?: App.Platform): Promise<Project | null> {
	const db = platform?.env?.DB;

	if (!db) {
		const items = getLocalProjects();
		return items.find((p) => p.slug === slug) || null;
	}

	try {
		await ensureDbInitialized(db);
		const row = await db
			.prepare('SELECT * FROM projects WHERE slug = ?')
			.bind(slug)
			.first<Record<string, any>>();

		if (!row) {
			// Fallback check against default projects in case not yet persisted
			return defaultProjects.find((p) => p.slug === slug) || null;
		}

		return {
			slug: String(row.slug),
			title: String(row.title),
			category: row.category as any,
			year: String(row.year),
			location: String(row.location),
			scope: String(row.scope),
			excerpt: String(row.excerpt),
			body: typeof row.body === 'string' ? JSON.parse(row.body) : row.body,
			hero: String(row.hero),
			gallery: typeof row.gallery === 'string' ? JSON.parse(row.gallery) : row.gallery,
			shape: (row.shape || 'square') as any
		};
	} catch (err) {
		console.error(`getProjectBySlug D1 error for slug ${slug}:`, err);
		const items = getLocalProjects();
		return items.find((p) => p.slug === slug) || null;
	}
}

/**
 * Create or update a project.
 */
export async function saveProject(
	project: Project,
	platform?: App.Platform,
	isNew: boolean = false
): Promise<{ success: boolean; error?: string }> {
	if (!project.slug || !project.title) {
		return { success: false, error: 'Slug and Title are required' };
	}

	const db = platform?.env?.DB;

	if (!db) {
		const items = getLocalProjects();
		const existingIndex = items.findIndex((p) => p.slug === project.slug);

		if (isNew && existingIndex !== -1) {
			return { success: false, error: `A project with slug "${project.slug}" already exists.` };
		}

		if (existingIndex >= 0) {
			items[existingIndex] = project;
		} else {
			items.push(project);
		}
		saveLocalProjects(items);
		return { success: true };
	}

	try {
		await ensureDbInitialized(db);

		if (isNew) {
			const existing = await db
				.prepare('SELECT slug FROM projects WHERE slug = ?')
				.bind(project.slug)
				.first();
			if (existing) {
				return { success: false, error: `A project with slug "${project.slug}" already exists.` };
			}
		}

		const bodyJson = JSON.stringify(project.body || []);
		const galleryJson = JSON.stringify(project.gallery || []);

		await db
			.prepare(
				`INSERT INTO projects (slug, title, category, year, location, scope, excerpt, body, hero, gallery, shape, updated_at)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
				 ON CONFLICT(slug) DO UPDATE SET
				   title = excluded.title,
				   category = excluded.category,
				   year = excluded.year,
				   location = excluded.location,
				   scope = excluded.scope,
				   excerpt = excluded.excerpt,
				   body = excluded.body,
				   hero = excluded.hero,
				   gallery = excluded.gallery,
				   shape = excluded.shape,
				   updated_at = datetime('now')`
			)
			.bind(
				project.slug,
				project.title,
				project.category,
				project.year,
				project.location,
				project.scope,
				project.excerpt,
				bodyJson,
				project.hero,
				galleryJson,
				project.shape || 'square'
			)
			.run();

		return { success: true };
	} catch (err: any) {
		console.error('saveProject D1 error:', err);
		return { success: false, error: err.message || 'Failed to save project to database' };
	}
}

/**
 * Delete a project by slug.
 */
export async function deleteProject(slug: string, platform?: App.Platform): Promise<{ success: boolean; error?: string }> {
	const db = platform?.env?.DB;

	if (!db) {
		let items = getLocalProjects();
		items = items.filter((p) => p.slug !== slug);
		saveLocalProjects(items);
		return { success: true };
	}

	try {
		await ensureDbInitialized(db);
		await db.prepare('DELETE FROM projects WHERE slug = ?').bind(slug).run();
		return { success: true };
	} catch (err: any) {
		console.error('deleteProject D1 error:', err);
		return { success: false, error: err.message || 'Failed to delete project' };
	}
}

/**
 * Re-seed the default site projects from site.ts into D1 or local store.
 */
export async function seedDefaultProjects(platform?: App.Platform, force: boolean = false): Promise<void> {
	const db = platform?.env?.DB;

	if (!db) {
		saveLocalProjects([...defaultProjects]);
		return;
	}

	try {
		if (force) {
			await db.prepare('DELETE FROM projects').run();
		}

		for (let i = 0; i < defaultProjects.length; i++) {
			const p = defaultProjects[i];
			const bodyJson = JSON.stringify(p.body);
			const galleryJson = JSON.stringify(p.gallery);

			await db
				.prepare(
					`INSERT OR REPLACE INTO projects (slug, title, category, year, location, scope, excerpt, body, hero, gallery, shape, display_order)
					 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
				)
				.bind(
					p.slug,
					p.title,
					p.category,
					p.year,
					p.location,
					p.scope,
					p.excerpt,
					bodyJson,
					p.hero,
					galleryJson,
					p.shape,
					i
				)
				.run();
		}
	} catch (err) {
		console.error('seedDefaultProjects D1 error:', err);
	}
}

/**
 * Media management in D1 and local store.
 */
export async function getMediaList(platform?: App.Platform): Promise<MediaItem[]> {
	const db = platform?.env?.DB;

	if (!db) {
		return getLocalMedia();
	}

	try {
		await ensureDbInitialized(db);
		const { results } = await db
			.prepare('SELECT * FROM media ORDER BY created_at DESC')
			.all<Record<string, any>>();

		if (!results) return [];

		return results.map((row) => ({
			key: String(row.key),
			url: String(row.url),
			filename: String(row.filename),
			content_type: String(row.content_type),
			size: Number(row.size),
			created_at: String(row.created_at)
		}));
	} catch (err) {
		console.error('getMediaList D1 error:', err);
		return getLocalMedia();
	}
}

export async function saveMediaRecord(item: MediaItem, platform?: App.Platform): Promise<void> {
	const db = platform?.env?.DB;

	if (!db) {
		const list = getLocalMedia();
		list.unshift(item);
		saveLocalMedia(list);
		return;
	}

	try {
		await ensureDbInitialized(db);
		await db
			.prepare(
				`INSERT OR REPLACE INTO media (key, url, filename, content_type, size, created_at)
				 VALUES (?, ?, ?, ?, ?, datetime('now'))`
			)
			.bind(item.key, item.url, item.filename, item.content_type, item.size)
			.run();
	} catch (err) {
		console.error('saveMediaRecord D1 error:', err);
	}
}

export async function deleteMediaRecord(key: string, platform?: App.Platform): Promise<void> {
	const db = platform?.env?.DB;

	if (!db) {
		let list = getLocalMedia();
		list = list.filter((m) => m.key !== key);
		saveLocalMedia(list);
		return;
	}

	try {
		await ensureDbInitialized(db);
		await db.prepare('DELETE FROM media WHERE key = ?').bind(key).run();
	} catch (err) {
		console.error('deleteMediaRecord D1 error:', err);
	}
}
