import { readFile } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { join } from 'node:path';

const execFileAsync = promisify(execFile);
const ROOT = process.cwd();

async function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runCommand(sql, maxRetries = 3) {
	const trimmed = sql.trim();
	if (!trimmed) return;
	console.log(`Executing:\n${trimmed.slice(0, 80)}...`);

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			await execFileAsync(
				'npx',
				['wrangler', 'd1', 'execute', 'jimi-bello-db', '--remote', `--command=${trimmed}`],
				{
					cwd: ROOT,
					env: {
						...process.env,
						PATH: `/home/dot/.nvm/versions/node/v22.16.0/bin:${process.env.PATH || ''}`
					}
				}
			);
			console.log('✓ Success');
			return;
		} catch (err) {
			console.warn(`Attempt ${attempt} failed: ${err.message}`);
			if (attempt < maxRetries) {
				console.log('Retrying in 3 seconds...');
				await delay(3000);
			} else {
				throw err;
			}
		}
	}
}

async function main() {
	const statements = [
		// 1. Table creation
		`CREATE TABLE IF NOT EXISTS products (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    price_note TEXT,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    material TEXT,
    dimensions TEXT,
    lead_time TEXT,
    gallery TEXT NOT NULL DEFAULT '[]',
    featured INTEGER NOT NULL DEFAULT 0,
    details TEXT NOT NULL DEFAULT '[]',
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
)`,
		`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`,
		`CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured)`,
		`CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order)`,

		// 2. Projects delete & insert
		`DELETE FROM projects WHERE slug = 'bello-sofa-series'`,

		`INSERT OR REPLACE INTO projects (slug, title, category, year, location, scope, excerpt, body, hero, gallery, shape, display_order)
VALUES
(
    'bello-accent-chair-series',
    'Bello Accent Chair Series',
    'Furniture',
    '2025',
    'JBC Workshop, Lagos',
    'Furniture design · Bespoke upholstery · Small-batch production',
    'A considered collection of bespoke accent chairs, shaped with refined proportions, monogram detailing, and crafted to bring comfort, character, and quiet presence to the spaces they inhabit.',
    '["The Bello Accent Chair Series began with a single design principle: seating should define a space without overwhelming it. Designed and crafted entirely within our Lagos workshop, each piece balances generous proportions with architectural restraint.","We construct every frame in-house using seasoned hardwood joinery, paired with layered foam densities and tailored upholstery selected to age with grace and character.","Available in bespoke configurations, custom timber finishes, and signature monogram textile options, sized precisely to each room."]',
    '/api/images/projects/bello-accent-chair-series/hero.webp',
    '[{"id":"/api/images/projects/bello-accent-chair-series/01-chairs.webp","caption":"Monogram accent chairs and solid timber side table"},{"id":"/api/images/projects/bello-accent-chair-series/02-workshop-showcase.webp","caption":"Workshop frame construction and finished upholstery showcase"},{"id":"/api/images/projects/bello-accent-chair-series/03-dining-interior.webp","caption":"Bespoke seating in contemporary dining and living setting"}]',
    'tall',
    0
)`,

		`INSERT OR REPLACE INTO projects (slug, title, category, year, location, scope, excerpt, body, hero, gallery, shape, display_order)
VALUES
(
    'pats-loft',
    'Pat’s Loft',
    'Residential',
    '2025',
    'Lekki, Lagos',
    'Full interior design · Space planning · Bespoke furniture',
    'A considered loft designed around modern living, balancing warmth, refined materials, and purposeful details to create a home that feels both elevated and deeply personal.',
    '["Pat’s Loft was conceived as an open-plan sanctuary that avoids the sterile detachment typical of industrial lofts. We softened clean structural lines with tactile finishes, custom timber millwork, and warm ambient lighting.","The open floor plate required precise zoning. Bespoke partition joinery and furniture groupings articulate distinct areas for living, dining, and working without severing visual connection or blocking natural light.","Every bespoke element, from the low-slung lounge seating to the recessed kitchen joinery, was manufactured in our workshop to fit the exact millimetre of the loft."]',
    '/api/images/projects/pats-loft/hero.webp',
    '[{"id":"/api/images/projects/pats-loft/01-living.webp","caption":"Lounge and entertainment living space with bespoke timber panelling"},{"id":"/api/images/projects/pats-loft/02-bar-dining.webp","caption":"Custom timber breakfast bar and partition joinery"},{"id":"/api/images/projects/pats-loft/03-kitchen.webp","caption":"Full kitchen cabinetry with integrated appliances and under-cabinet lighting"},{"id":"/api/images/projects/pats-loft/04-kitchen-bar.webp","caption":"Breakfast bar counter seating and corridor view"}]',
    'square',
    1
)`,

		`INSERT OR REPLACE INTO projects (slug, title, category, year, location, scope, excerpt, body, hero, gallery, shape, display_order)
VALUES
(
    'nest',
    'Nest',
    'Commercial',
    '2025',
    'Victoria Island, Lagos',
    'Workplace strategy · Interior architecture · Custom joinery',
    'A contemporary commercial space designed to balance function, identity, and experience, creating a work environment that feels purposeful, welcoming, and distinctly its own.',
    '["Nest reimagines what a contemporary commercial space can feel like when designed around human experience. Moving away from rigid corporate formality, the layout integrates collaborative work lounges, focused pods, and open gathering points.","Acoustic comfort and sightline integrity guided the spatial planning. In-house custom joinery walls double as subtle division markers, dampening sound while maintaining openness and flow.","Finished with durable yet warm materials, Nest demonstrates that commercial interiors can be efficient, enduring, and deeply characterful."]',
    '/api/images/projects/nest/hero.webp',
    '[{"id":"/api/images/projects/nest/01-reception.webp","caption":"Reception lounge with branded signage and glass partition"},{"id":"/api/images/projects/nest/02-corridor.webp","caption":"Illuminated walkway corridor and lounge breakout"},{"id":"/api/images/projects/nest/03-stairwell.webp","caption":"Feature staircase with vertical garden and bamboo detail"}]',
    'wide',
    2
)`,

		// 3. Products
		`DELETE FROM products`,

		`INSERT INTO products (slug, title, category, price, price_note, description, image, material, dimensions, lead_time, gallery, featured, details, display_order)
VALUES
(
    'bello-accent-chair-series',
    'Bello Accent Chair Series',
    'Living',
    '₦2,400,000',
    'Made to order · Custom sizing & upholstery available',
    'A considered collection of bespoke accent chairs, shaped with refined proportions and crafted to bring comfort, character, and quiet presence to the spaces they inhabit. Designed and crafted entirely in our Lagos workshop.',
    '/api/images/projects/bello-accent-chair-series/hero.webp',
    'Solid hardwood frame, bespoke monogram & linen upholstery',
    'W: 820mm · D: 780mm · H: 760mm',
    '4–6 weeks',
    '["/api/images/projects/bello-accent-chair-series/01-chairs.webp","/api/images/projects/bello-accent-chair-series/02-workshop-showcase.webp"]',
    1,
    '[{"label":"Origin","value":"Handcrafted in JBC Workshop, Lagos"},{"label":"Frame","value":"Seasoned kiln-dried hardwood joinery"},{"label":"Cushioning","value":"High-resilience layered foam with fiber wrap"},{"label":"Customization","value":"Bespoke fabric choices, modular sizing upon request"}]',
    0
)`,

		`INSERT INTO products (slug, title, category, price, price_note, description, image, material, dimensions, lead_time, gallery, featured, details, display_order)
VALUES
(
    'four-poster-bed',
    'Four-Poster Bed Frame',
    'Bedroom',
    '₦1,950,000',
    'Available in Queen & King · Built to room ceiling height',
    'Redrawn for standard room heights — strong vertical posts with joinery-first construction. The frame carries the visual height without requiring high ceilings or canopies.',
    '/api/images/projects/products/four-poster-bed.webp',
    'Solid Iroko / Seasoned West African Walnut',
    'L: 2150mm · W: 1950mm · H: 2100mm',
    '4–5 weeks',
    '["/api/images/projects/products/four-poster-bed.webp"]',
    1,
    '[{"label":"Timber","value":"Solid Iroko or Walnut, sustainably sourced"},{"label":"Assembly","value":"Knocks down into 5 modular components for easy delivery"},{"label":"Finish","value":"Matte architectural timber oil"},{"label":"Sizing","value":"Tailored to mattress specifications"}]',
    1
)`,

		`INSERT INTO products (slug, title, category, price, price_note, description, image, material, dimensions, lead_time, gallery, featured, details, display_order)
VALUES
(
    'iroko-dining-table',
    'Iroko Dining Table',
    'Dining',
    '₦2,800,000',
    'Single-slab timber run · Custom lengths from 8 to 14 seats',
    'Single-slab top on a knocked-down trestle base, built to the exact millimetre your room needs. Cut from single log runs so grain and tone remain continuous across the expanse.',
    '/api/images/projects/products/iroko-dining-table.webp',
    'Solid Iroko Timber, matte architectural oil',
    'L: 3000mm · W: 1100mm · H: 750mm',
    '5–7 weeks',
    '["/api/images/projects/products/iroko-dining-table.webp"]',
    1,
    '[{"label":"Wood Selection","value":"Single log run solid Iroko slab"},{"label":"Base","value":"Hand-shaped timber trestle with mortise & tenon joints"},{"label":"Maintenance","value":"Water and stain-resistant satin seal"},{"label":"Capacity","value":"Comfortably seats 10–12 persons"}]',
    2
)`,

		`INSERT INTO products (slug, title, category, price, price_note, description, image, material, dimensions, lead_time, gallery, featured, details, display_order)
VALUES
(
    'woodwolves-credenza',
    'Woodwolves Credenza',
    'Storage',
    '₦1,650,000',
    'Integrated soft-closing hardware',
    'Handcrafted cabinetry with integrated flush pulls and soft-closing joinery. Generous interior storage configured for home audio, glassware, or curated essentials.',
    '/api/images/projects/products/woodwolves-credenza.webp',
    'Smoked Oak, hand-turned brass hardware',
    'W: 2000mm · D: 500mm · H: 800mm',
    '4–6 weeks',
    '["/api/images/projects/products/woodwolves-credenza.webp"]',
    0,
    '[{"label":"Hardware","value":"Concealed Blum soft-close hinges, brass pulls"},{"label":"Interior","value":"Adjustable timber shelves with cable access management"},{"label":"Finish","value":"Natural smoked oak with UV lacquer"}]',
    3
)`,

		`INSERT INTO products (slug, title, category, price, price_note, description, image, material, dimensions, lead_time, gallery, featured, details, display_order)
VALUES
(
    'steam-bent-dining-chair',
    'Steam-Bent Dining Chair',
    'Dining',
    '₦380,000',
    'Sold individually or in tailored sets',
    'Curved back support with seat height calibrated directly to our dining collection. Engineered using traditional steam-bending techniques for ergonomic comfort and structural resilience.',
    '/api/images/projects/products/steam-bent-dining-chair.webp',
    'Steam-bent solid hardwood, natural linen seat pad',
    'W: 520mm · D: 540mm · H: 820mm (Seat H: 460mm)',
    '3–4 weeks',
    '["/api/images/projects/products/steam-bent-dining-chair.webp"]',
    0,
    '[{"label":"Craft Technique","value":"Steam-bent solid timber curve"},{"label":"Upholstery","value":"Removable natural Belgian linen pad"},{"label":"Stackability","value":"Designed for graceful pairing with JBC tables"}]',
    4
)`,

		`INSERT INTO products (slug, title, category, price, price_note, description, image, material, dimensions, lead_time, gallery, featured, details, display_order)
VALUES
(
    'loft-coffee-table',
    'Loft Coffee Table',
    'Living',
    '₦850,000',
    'Each slab features unique natural edge grain',
    'Low-profile solid wood coffee table with organic edge treatment and recessed architectural base. Designed to ground open living rooms with warmth and tactile presence.',
    '/api/images/projects/products/loft-coffee-table.webp',
    'Natural Walnut, satin protective seal',
    'L: 1400mm · W: 750mm · H: 380mm',
    '3–4 weeks',
    '["/api/images/projects/products/loft-coffee-table.webp"]',
    0,
    '[{"label":"Profile","value":"Chamfered edge with recessed shadowline base"},{"label":"Wood","value":"Selected American Walnut with warm amber undertones"},{"label":"Finish","value":"Durable matte polyurethane sealer"}]',
    5
)`,

		// 4. Media
		`INSERT OR REPLACE INTO media (key, url, filename, content_type, size)
VALUES
('projects/bello-accent-chair-series/hero.webp', '/api/images/projects/bello-accent-chair-series/hero.webp', 'hero.webp', 'image/webp', 150000),
('projects/bello-accent-chair-series/01-chairs.webp', '/api/images/projects/bello-accent-chair-series/01-chairs.webp', '01-chairs.webp', 'image/webp', 150000),
('projects/bello-accent-chair-series/02-workshop-showcase.webp', '/api/images/projects/bello-accent-chair-series/02-workshop-showcase.webp', '02-workshop-showcase.webp', 'image/webp', 150000),
('projects/bello-accent-chair-series/03-dining-interior.webp', '/api/images/projects/bello-accent-chair-series/03-dining-interior.webp', '03-dining-interior.webp', 'image/webp', 150000),
('projects/pats-loft/hero.webp', '/api/images/projects/pats-loft/hero.webp', 'hero.webp', 'image/webp', 150000),
('projects/pats-loft/01-living.webp', '/api/images/projects/pats-loft/01-living.webp', '01-living.webp', 'image/webp', 150000),
('projects/pats-loft/02-bar-dining.webp', '/api/images/projects/pats-loft/02-bar-dining.webp', '02-bar-dining.webp', 'image/webp', 150000),
('projects/pats-loft/03-kitchen.webp', '/api/images/projects/pats-loft/03-kitchen.webp', '03-kitchen.webp', 'image/webp', 150000),
('projects/pats-loft/04-kitchen-bar.webp', '/api/images/projects/pats-loft/04-kitchen-bar.webp', '04-kitchen-bar.webp', 'image/webp', 150000),
('projects/nest/hero.webp', '/api/images/projects/nest/hero.webp', 'hero.webp', 'image/webp', 150000),
('projects/nest/01-reception.webp', '/api/images/projects/nest/01-reception.webp', '01-reception.webp', 'image/webp', 150000),
('projects/nest/02-corridor.webp', '/api/images/projects/nest/02-corridor.webp', '02-corridor.webp', 'image/webp', 150000),
('projects/nest/03-stairwell.webp', '/api/images/projects/nest/03-stairwell.webp', '03-stairwell.webp', 'image/webp', 150000),
('projects/products/four-poster-bed.webp', '/api/images/projects/products/four-poster-bed.webp', 'four-poster-bed.webp', 'image/webp', 150000),
('projects/products/iroko-dining-table.webp', '/api/images/projects/products/iroko-dining-table.webp', 'iroko-dining-table.webp', 'image/webp', 150000),
('projects/products/woodwolves-credenza.webp', '/api/images/projects/products/woodwolves-credenza.webp', 'woodwolves-credenza.webp', 'image/webp', 150000),
('projects/products/steam-bent-dining-chair.webp', '/api/images/projects/products/steam-bent-dining-chair.webp', 'steam-bent-dining-chair.webp', 'image/webp', 150000),
('projects/products/loft-coffee-table.webp', '/api/images/projects/products/loft-coffee-table.webp', 'loft-coffee-table.webp', 'image/webp', 150000)`
	];

	for (const stmt of statements) {
		await runCommand(stmt);
		await delay(1000); // 1s breather between commands
	}
	console.log('--- All D1 migration commands completed successfully! ---');
}

main().catch((err) => {
	console.error('Migration failed:', err);
	process.exit(1);
});
