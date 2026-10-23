/**
 * Import and process images from Website/ into:
 * 1. static/images/<name>-<width>.webp for responsive static page imagery
 * 2. static/uploads/projects/... for local dev storage
 * 3. .import/r2/projects/... ready for Cloudflare R2 upload
 */

import { mkdir, writeFile, copyFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const STATIC_IMAGES_DIR = join(ROOT, 'static', 'images');
const STATIC_UPLOADS_DIR = join(ROOT, 'static', 'uploads');
const R2_EXPORT_DIR = join(ROOT, '.import', 'r2');

const WIDTHS = [480, 768, 1024, 1440, 1920];
const QUALITY = 82;

// Static page responsive images
const STATIC_PAGE_IMAGES = [
	{
		source: 'Website/Home Page Section/Living Room.jpeg',
		target: 'pages/home-hero'
	},
	{
		source: 'Website/Home Page Section/Warm Modern Walnut Dining Interior.png',
		target: 'pages/home-who-we-are'
	},
	{
		source: 'Website/About Section/Warm Scandinavian Office Reading Nook.png',
		target: 'pages/about-hero'
	},
	{
		source: 'Website/About Section/Bedroom Space.jpeg',
		target: 'pages/about-philosophy'
	},
	{
		source: 'Website/About Section/Product Showcase.jpeg',
		target: 'pages/about-workshop'
	},
	{
		source: 'Website/About Section/Warm Scandinavian Office Reading Nook.png',
		target: 'pages/services-hero'
	},
	{
		source: "Website/Service Section/Pat's Loft 1.jpg",
		target: 'services/residential'
	},
	{
		source: 'Website/Service Section/Nest Project 1.jpeg',
		target: 'services/commercial'
	},
	{
		source: 'Website/Service Section/Warm Scandinavian Apartment Floor Plan.png',
		target: 'services/space-planning'
	},
	{
		source: 'Website/Service Section/Warm Minimalist Table and Bouclé Chair.png',
		target: 'services/furniture-design'
	},
	{
		source: "Website/Service Section/Pat's Loft 3.jpg",
		target: 'services/renovation-consultation'
	},
	{
		source: 'Website/Portfolio Section/Warm Modern Luxury Kitchen.png',
		target: 'pages/portfolio-hero'
	}
];

// Portfolio and Product images for R2 and uploads
const STORAGE_IMAGES = [
	// Bello Accent Chair Series
	{
		source: 'Website/Home Page Section/Monogram Chairs and Marble Side Table.png',
		key: 'projects/bello-accent-chair-series/hero.webp'
	},
	{
		source: 'Website/Home Page Section/Monogram Chairs and Marble Side Table.png',
		key: 'projects/bello-accent-chair-series/01-chairs.webp'
	},
	{
		source: 'Website/About Section/Product Showcase.jpeg',
		key: 'projects/bello-accent-chair-series/02-workshop-showcase.webp'
	},
	{
		source: 'Website/Home Page Section/Warm Modern Walnut Dining Interior.png',
		key: 'projects/bello-accent-chair-series/03-dining-interior.webp'
	},

	// Pat's Loft
	{
		source: "Website/Home Page Section/Pat's Loft 1.jpg",
		key: 'projects/pats-loft/hero.webp'
	},
	{
		source: "Website/Home Page Section/Pat's Loft 1.jpg",
		key: 'projects/pats-loft/01-living.webp'
	},
	{
		source: "Website/Home Page Section/Pat's Loft 2.jpg",
		key: 'projects/pats-loft/02-bar-dining.webp'
	},
	{
		source: "Website/Home Page Section/Pat's Loft 3.jpg",
		key: 'projects/pats-loft/03-kitchen.webp'
	},
	{
		source: "Website/Home Page Section/Pat's Loft 4.jpg",
		key: 'projects/pats-loft/04-kitchen-bar.webp'
	},

	// Nest
	{
		source: 'Website/Home Page Section/Nest Project 1.jpeg',
		key: 'projects/nest/hero.webp'
	},
	{
		source: 'Website/Home Page Section/Nest Project 1.jpeg',
		key: 'projects/nest/01-reception.webp'
	},
	{
		source: 'Website/Home Page Section/Nest Project 2.png',
		key: 'projects/nest/02-corridor.webp'
	},
	{
		source: 'Website/Home Page Section/Nest Project 3.jpg',
		key: 'projects/nest/03-stairwell.webp'
	},

	// Products
	{
		source: 'Website/About Section/Bedroom Space.jpeg',
		key: 'projects/products/four-poster-bed.webp'
	},
	{
		source: 'Website/Home Page Section/Warm Modern Walnut Dining Interior.png',
		key: 'projects/products/iroko-dining-table.webp'
	},
	{
		source: 'Website/Home Page Section/Living Room.jpeg',
		key: 'projects/products/woodwolves-credenza.webp'
	},
	{
		source: 'Website/Home Page Section/Monogram Chairs and Marble Side Table.png',
		key: 'projects/products/steam-bent-dining-chair.webp'
	},
	{
		source: 'Website/Service Section/Warm Minimalist Table and Bouclé Chair.png',
		key: 'projects/products/loft-coffee-table.webp'
	}
];

async function generateStaticPageImages() {
	console.log('Generating responsive static page images...');
	for (const item of STATIC_PAGE_IMAGES) {
		const srcPath = join(ROOT, item.source);
		console.log(`Processing ${item.source} -> ${item.target}`);
		const image = sharp(srcPath);
		const metadata = await image.metadata();

		for (const width of WIDTHS) {
			const outPath = join(STATIC_IMAGES_DIR, `${item.target}-${width}.webp`);
			await mkdir(dirname(outPath), { recursive: true });

			// Resize maintaining aspect ratio, never upscaling beyond 1.25x
			await sharp(srcPath)
				.resize({
					width: Math.min(width, Math.round(metadata.width * 1.25)),
					withoutEnlargement: false,
					fit: 'inside'
				})
				.webp({ quality: QUALITY })
				.toFile(outPath);
		}
	}
}

async function generateStorageImages() {
	console.log('Generating R2 / upload storage images...');
	const mediaRecords = [];

	for (const item of STORAGE_IMAGES) {
		const srcPath = join(ROOT, item.source);
		console.log(`Processing storage image ${item.source} -> ${item.key}`);

		const uploadsOutPath = join(STATIC_UPLOADS_DIR, item.key);
		const r2OutPath = join(R2_EXPORT_DIR, item.key);

		await mkdir(dirname(uploadsOutPath), { recursive: true });
		await mkdir(dirname(r2OutPath), { recursive: true });

		// Standardize to max 1920 width, high visual quality WebP
		const buffer = await sharp(srcPath)
			.resize({
				width: 1920,
				withoutEnlargement: true,
				fit: 'inside'
			})
			.webp({ quality: 86 })
			.toBuffer();

		await writeFile(uploadsOutPath, buffer);
		await writeFile(r2OutPath, buffer);

		const filename = item.key.split('/').pop() || 'image.webp';
		mediaRecords.push({
			key: item.key,
			url: `/api/images/${item.key}`,
			filename,
			content_type: 'image/webp',
			size: buffer.length
		});
	}

	return mediaRecords;
}

async function main() {
	await generateStaticPageImages();
	const mediaRecords = await generateStorageImages();

	console.log(`Successfully generated ${STATIC_PAGE_IMAGES.length * WIDTHS.length} responsive images.`);
	console.log(`Successfully generated ${STORAGE_IMAGES.length} storage images.`);
	console.log('Media count:', mediaRecords.length);
}

main().catch((err) => {
	console.error('Import failed:', err);
	process.exit(1);
});
