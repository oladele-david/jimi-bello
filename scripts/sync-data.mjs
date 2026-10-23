/**
 * sync-data.mjs:
 * 1. Uploads .import/r2/ files to Cloudflare R2 bucket jimi-bello-images
 * 2. Generates migrations/0004_update_images.sql and executes on D1
 * 3. Updates local DB files (.svelte-kit/local-db/)
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const ROOT = process.cwd();
const R2_DIR = join(ROOT, '.import', 'r2');

async function getFiles(dir) {
	const subdirs = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		subdirs.map(async (dirent) => {
			const res = join(dir, dirent.name);
			return dirent.isDirectory() ? getFiles(res) : res;
		})
	);
	return files.flat();
}

async function uploadToR2() {
	console.log('--- Uploading files to Cloudflare R2 ---');
	const allFiles = await getFiles(R2_DIR);

	for (const filePath of allFiles) {
		const key = relative(R2_DIR, filePath);
		console.log(`Uploading ${key}...`);
		try {
			const { stdout, stderr } = await execFileAsync(
				'npx',
				['wrangler', 'r2', 'object', 'put', `jimi-bello-images/${key}`, `--file=${filePath}`, '--remote', '--content-type=image/webp'],
				{ cwd: ROOT }
			);
			console.log(`Uploaded ${key}`);
		} catch (err) {
			console.error(`Error uploading ${key}:`, err.message);
			throw err;
		}
	}
	console.log('All files uploaded to R2 successfully.');
}

async function main() {
	await uploadToR2();
}

main().catch((err) => {
	console.error('Sync failed:', err);
	process.exit(1);
});
