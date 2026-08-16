/**
 * One-time image fetcher.
 *
 * Pulls the stock photography the site was prototyped against and writes local,
 * pre-resized WebP into `static/images/`. Filenames are keyed to *what the image
 * is* (project slug, gallery index) rather than to the Unsplash ID, so replacing
 * a placeholder with real JBC photography is a file swap — no code change.
 *
 * Once every image below has been replaced with in-house photography this file
 * and the `sharp` devDependency can both be deleted; nothing at runtime imports
 * either of them.
 *
 *   node scripts/fetch-images.mjs           # skip anything already downloaded
 *   node scripts/fetch-images.mjs --force   # re-fetch and re-encode everything
 */

import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'static', 'images');

/** Must stay in sync with DEFAULT_WIDTHS in src/lib/images.ts. */
const WIDTHS = [480, 768, 1024, 1440, 1920];

/** Encoder quality. 78 is visually clean for photography at these sizes. */
const QUALITY = 78;

const FORCE = process.argv.includes('--force');

/**
 * name → Unsplash photo ID.
 *
 * `name` is the path under static/images/ minus the width suffix and extension,
 * and is exactly the string stored in src/lib/data/site.ts.
 */
const IMAGES = {
	// Site-level heroes
	'pages/home-hero': 'photo-1618221195710-dd6b41faaea6',
	'pages/about-hero': 'photo-1524758631624-e2822e304c36',
	'pages/about-workshop': 'photo-1594026112284-02bb6f3352fe',
	'pages/portfolio-hero': 'photo-1600607687939-ce8a6c25118c',
	'pages/contact-hero': 'photo-1600585152220-90363fe7e115',

	// Services
	'services/residential': 'photo-1586023492125-27b2c045efd7',
	'services/commercial': 'photo-1497366754035-f200968a6e72',
	'services/space-planning': 'photo-1503602642458-232111445657',
	'services/furniture-design': 'photo-1611486212355-d276af4581c0',
	'services/renovation-consultation': 'photo-1731168273756-e02cae42265b',

	// Ikoyi Residence
	'projects/ikoyi-residence/hero': 'photo-1586023492125-27b2c045efd7',
	'projects/ikoyi-residence/01': 'photo-1600210492486-724fe5c67fb0',
	'projects/ikoyi-residence/02': 'photo-1616486338812-3dadae4b4ace',
	'projects/ikoyi-residence/03': 'photo-1560448204-e02f11c3d0e2',
	'projects/ikoyi-residence/04': 'photo-1595428774223-ef52624120d2',

	// Victoria Island Studio
	'projects/victoria-island-studio/hero': 'photo-1497366754035-f200968a6e72',
	'projects/victoria-island-studio/01': 'photo-1497366811353-6870744d04b2',
	'projects/victoria-island-studio/02': 'photo-1524758631624-e2822e304c36',
	'projects/victoria-island-studio/03': 'photo-1541123437800-1bb1317badc2',

	// Four-Poster Series
	'projects/four-poster-series/hero': 'photo-1615529182904-14819c35db37',
	'projects/four-poster-series/01': 'photo-1522771739844-6a9f6d5f14af',
	'projects/four-poster-series/02': 'photo-1505693416388-ac5ce068fe85',
	'projects/four-poster-series/03': 'photo-1594026112284-02bb6f3352fe',

	// Lekki Duplex
	'projects/lekki-duplex/hero': 'photo-1583847268964-b28dc8f51f92',
	'projects/lekki-duplex/01': 'photo-1493809842364-78817add7ffb',
	'projects/lekki-duplex/02': 'photo-1567016432779-094069958ea5',
	'projects/lekki-duplex/03': 'photo-1618221195710-dd6b41faaea6',

	// Ikeja Showroom
	'projects/ikeja-showroom/hero': 'photo-1555041469-a586c61ea9bc',
	'projects/ikeja-showroom/01': 'photo-1531973576160-7125cd663d86',
	'projects/ikeja-showroom/02': 'photo-1550581190-9c1c48d21d6c',

	// Iroko Dining Collection
	'projects/iroko-dining-collection/hero': 'photo-1604709177225-055f99402ea3',
	'projects/iroko-dining-collection/01': 'photo-1533090161767-e6ffed986c88',
	'projects/iroko-dining-collection/02': 'photo-1592078615290-033ee584e267'
};

/** Fetch the largest sensible original once, then resize locally from it. */
async function download(id) {
	const url = `https://images.unsplash.com/${id}?fit=max&q=90&w=2400`;

	for (let attempt = 1; attempt <= 3; attempt++) {
		try {
			const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			return Buffer.from(await res.arrayBuffer());
		} catch (err) {
			if (attempt === 3) throw err;
			await new Promise((r) => setTimeout(r, attempt * 1500));
		}
	}
}

async function exists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function processImage(name, id) {
	const targets = WIDTHS.map((w) => ({ w, path: join(OUT_DIR, `${name}-${w}.webp`) }));

	if (!FORCE) {
		const present = await Promise.all(targets.map((t) => exists(t.path)));
		if (present.every(Boolean)) return { name, skipped: true };
	}

	await mkdir(dirname(targets[0].path), { recursive: true });

	const original = await download(id);
	const meta = await sharp(original).metadata();

	for (const { w, path } of targets) {
		// Never upscale past the source; a smaller file is better than a soft one.
		const width = Math.min(w, meta.width);
		const buf = await sharp(original)
			.resize({ width, withoutEnlargement: true })
			.webp({ quality: QUALITY })
			.toBuffer();
		await writeFile(path, buf);
	}

	return { name, skipped: false, source: `${meta.width}x${meta.height}` };
}

const entries = Object.entries(IMAGES);
console.log(`${entries.length} images × ${WIDTHS.length} widths → static/images/\n`);

let done = 0;
let failed = 0;

// Small concurrency pool — polite to the origin, still fast.
const queue = [...entries];
await Promise.all(
	Array.from({ length: 4 }, async () => {
		while (queue.length) {
			const [name, id] = queue.shift();
			try {
				const r = await processImage(name, id);
				done++;
				console.log(
					`  [${String(done + failed).padStart(2)}/${entries.length}] ${r.skipped ? 'skip' : ' ok '} ${name}${r.source ? `  (src ${r.source})` : ''}`
				);
			} catch (err) {
				failed++;
				console.error(
					`  [${String(done + failed).padStart(2)}/${entries.length}] FAIL ${name} — ${err.message}`
				);
			}
		}
	})
);

console.log(`\n${done} ok, ${failed} failed.`);
if (failed) process.exitCode = 1;
