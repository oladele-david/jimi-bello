export interface NavItem {
	label: string;
	href: string;
}

export const nav: NavItem[] = [
	{ label: 'Home', href: '/' },
	{ label: 'About', href: '/about' },
	{ label: 'Services', href: '/services' },
	{ label: 'Products', href: '/products' },
	{ label: 'Portfolio', href: '/portfolio' },
	{ label: 'Contact', href: '/contact' }
];

export const brandTagline = 'Living Through Design.';

export const contact = {
	email: 'info@jimibello.com',
	phone: '08084539531',
	phone2: '0913 001 4376',
	phones: ['08084539531', '0913 001 4376'],
	address: ['9B Tinubu Road', 'Ilupeju, Lagos', 'Nigeria'],
	hours: 'Mon – Fri, 9:00 – 18:00 WAT',
	social: [
		{ label: '@jimibelloco', href: 'https://instagram.com/jimibelloco' },
		{ label: 'Pinterest', href: 'https://pinterest.com' },
		{ label: 'LinkedIn', href: 'https://linkedin.com' }
	]
};

export interface Product {
	slug: string;
	title: string;
	category: string;
	description: string;
	image: string;
	price: string;
	priceNote?: string;
	material?: string;
	dimensions?: string;
	leadTime?: string;
	gallery?: string[];
	featured?: boolean;
	details?: { label: string; value: string }[];
}

export const products: Product[] = [
	{
		slug: 'bello-accent-chair-series',
		title: 'Bello Accent Chair Series',
		category: 'Living',
		price: '₦2,400,000',
		priceNote: 'Made to order · Custom sizing & upholstery available',
		description:
			'A considered collection of bespoke accent chairs, shaped with refined proportions and crafted to bring comfort, character, and quiet presence to the spaces they inhabit. Designed and crafted entirely in our Lagos workshop.',
		image: '/api/images/projects/bello-accent-chair-series/hero.webp',
		material: 'Solid hardwood frame, bespoke monogram & linen upholstery',
		dimensions: 'W: 820mm · D: 780mm · H: 760mm',
		leadTime: '4–6 weeks',
		gallery: [
			'/api/images/projects/bello-accent-chair-series/01-chairs.webp',
			'/api/images/projects/bello-accent-chair-series/02-workshop-showcase.webp'
		],
		featured: true,
		details: [
			{ label: 'Origin', value: 'Handcrafted in JBC Workshop, Lagos' },
			{ label: 'Frame', value: 'Seasoned kiln-dried hardwood joinery' },
			{ label: 'Cushioning', value: 'High-resilience layered foam with fiber wrap' },
			{ label: 'Customization', value: 'Bespoke fabric choices, modular sizing upon request' }
		]
	},
	{
		slug: 'four-poster-bed',
		title: 'Four-Poster Bed Frame',
		category: 'Bedroom',
		price: '₦1,950,000',
		priceNote: 'Available in Queen & King · Built to room ceiling height',
		description:
			'Redrawn for standard room heights — strong vertical posts with joinery-first construction. The frame carries the visual height without requiring high ceilings or canopies.',
		image: '/api/images/projects/products/four-poster-bed.webp',
		material: 'Solid Iroko / Seasoned West African Walnut',
		dimensions: 'L: 2150mm · W: 1950mm · H: 2100mm',
		leadTime: '4–5 weeks',
		gallery: ['/api/images/projects/products/four-poster-bed.webp'],
		featured: true,
		details: [
			{ label: 'Timber', value: 'Solid Iroko or Walnut, sustainably sourced' },
			{ label: 'Assembly', value: 'Knocks down into 5 modular components for easy delivery' },
			{ label: 'Finish', value: 'Matte architectural timber oil' },
			{ label: 'Sizing', value: 'Tailored to mattress specifications' }
		]
	},
	{
		slug: 'iroko-dining-table',
		title: 'Iroko Dining Table',
		category: 'Dining',
		price: '₦2,800,000',
		priceNote: 'Single-slab timber run · Custom lengths from 8 to 14 seats',
		description:
			'Single-slab top on a knocked-down trestle base, built to the exact millimetre your room needs. Cut from single log runs so grain and tone remain continuous across the expanse.',
		image: '/api/images/projects/products/iroko-dining-table.webp',
		material: 'Solid Iroko Timber, matte architectural oil',
		dimensions: 'L: 3000mm · W: 1100mm · H: 750mm',
		leadTime: '5–7 weeks',
		gallery: ['/api/images/projects/products/iroko-dining-table.webp'],
		featured: true,
		details: [
			{ label: 'Wood Selection', value: 'Single log run solid Iroko slab' },
			{ label: 'Base', value: 'Hand-shaped timber trestle with mortise & tenon joints' },
			{ label: 'Maintenance', value: 'Water and stain-resistant satin seal' },
			{ label: 'Capacity', value: 'Comfortably seats 10–12 persons' }
		]
	},
	{
		slug: 'woodwolves-credenza',
		title: 'Woodwolves Credenza',
		category: 'Storage',
		price: '₦1,650,000',
		priceNote: 'Integrated soft-closing hardware',
		description:
			'Handcrafted cabinetry with integrated flush pulls and soft-closing joinery. Generous interior storage configured for home audio, glassware, or curated essentials.',
		image: '/api/images/projects/products/woodwolves-credenza.webp',
		material: 'Smoked Oak, hand-turned brass hardware',
		dimensions: 'W: 2000mm · D: 500mm · H: 800mm',
		leadTime: '4–6 weeks',
		gallery: ['/api/images/projects/products/woodwolves-credenza.webp'],
		featured: false,
		details: [
			{ label: 'Hardware', value: 'Concealed Blum soft-close hinges, brass pulls' },
			{ label: 'Interior', value: 'Adjustable timber shelves with cable access management' },
			{ label: 'Finish', value: 'Natural smoked oak with UV lacquer' }
		]
	},
	{
		slug: 'steam-bent-dining-chair',
		title: 'Steam-Bent Dining Chair',
		category: 'Dining',
		price: '₦380,000',
		priceNote: 'Sold individually or in tailored sets',
		description:
			'Curved back support with seat height calibrated directly to our dining collection. Engineered using traditional steam-bending techniques for ergonomic comfort and structural resilience.',
		image: '/api/images/projects/products/steam-bent-dining-chair.webp',
		material: 'Steam-bent solid hardwood, natural linen seat pad',
		dimensions: 'W: 520mm · D: 540mm · H: 820mm (Seat H: 460mm)',
		leadTime: '3–4 weeks',
		gallery: ['/api/images/projects/products/steam-bent-dining-chair.webp'],
		featured: false,
		details: [
			{ label: 'Craft Technique', value: 'Steam-bent solid timber curve' },
			{ label: 'Upholstery', value: 'Removable natural Belgian linen pad' },
			{ label: 'Stackability', value: 'Designed for graceful pairing with JBC tables' }
		]
	},
	{
		slug: 'loft-coffee-table',
		title: 'Loft Coffee Table',
		category: 'Living',
		price: '₦850,000',
		priceNote: 'Each slab features unique natural edge grain',
		description:
			'Low-profile solid wood coffee table with organic edge treatment and recessed architectural base. Designed to ground open living rooms with warmth and tactile presence.',
		image: '/api/images/projects/products/loft-coffee-table.webp',
		material: 'Natural Walnut, satin protective seal',
		dimensions: 'L: 1400mm · W: 750mm · H: 380mm',
		leadTime: '3–4 weeks',
		gallery: ['/api/images/projects/products/loft-coffee-table.webp'],
		featured: false,
		details: [
			{ label: 'Profile', value: 'Chamfered edge with recessed shadowline base' },
			{ label: 'Wood', value: 'Selected American Walnut with warm amber undertones' },
			{ label: 'Finish', value: 'Durable matte polyurethane sealer' }
		]
	}
];

export function productBySlug(slug: string): Product | undefined {
	return products.find((p) => p.slug === slug);
}

export interface Service {
	slug: string;
	title: string;
	summary: string;
	detail: string;
	points: string[];
	image: string;
	/** Feature services get a taller, full-bleed treatment on /services. */
	feature?: boolean;
}

export const services: Service[] = [
	{
		slug: 'residential',
		title: 'Residential Interiors',
		summary:
			'Interiors that feel distinctly yours. We create refined residential spaces shaped around your lifestyle, preferences, and the way you truly live.',
		detail:
			'We start with your routines, your light, and your spatial priorities. Then we design every room around them — layout, finishes, lighting, and custom pieces crafted for your home. One team from first sketch to handover.',
		points: ['Full-home concepts', 'Room-by-room refits', 'Lighting & finish schedules'],
		image: 'services/residential'
	},
	{
		slug: 'commercial',
		title: 'Commercial Interiors',
		summary:
			'Spaces that make an impression. We design offices, showrooms, and hospitality environments that express your brand, enhance experience, and perform with purpose.',
		detail:
			'Commercial spaces demand flow, brand identity, and enduring materiality. We plan for real operational traffic, specify materials that last, and ensure an inspiring experience for your team and clients.',
		points: ['Workplace & studio fit-outs', 'Showroom and retail', 'Brand-led material palettes'],
		image: 'services/commercial'
	},
	{
		slug: 'space-planning',
		title: 'Space Planning',
		summary:
			'Where thoughtful design begins. We shape layouts, proportions, and movement to ensure every element works together seamlessly before the details take form.',
		detail:
			'Before choosing a single finish, we resolve circulation, sightlines, daylight, and storage. Most rooms that feel uncomfortable suffer from flawed planning — we solve the fundamentals first.',
		points: [
			'Circulation & zoning studies',
			'Furniture layouts to scale',
			'Daylight and sightline reviews'
		],
		image: 'services/space-planning'
	},
	{
		slug: 'furniture-design',
		title: 'Furniture Design',
		summary:
			'Bespoke pieces. Considered craftsmanship. We design and create furniture made specifically for your space, from statement pieces to timeless everyday essentials.',
		detail:
			'Our in-house workshop crafts made-to-measure furniture in solid timber. Every piece is drafted, prototyped, and built to the exact millimeter your room requires, backed by our ten-year structural warranty.',
		points: [
			'Made-to-measure case goods and seating',
			'Solid timber, joinery-first construction',
			'Prototype review before full build',
			'Ten-year structural warranty'
		],
		image: 'services/furniture-design',
		feature: true
	},
	{
		slug: 'renovation-consultation',
		title: 'Renovation Consultation',
		summary:
			'A considered approach to transformation. We provide expert guidance to help you navigate your renovation, make confident decisions, and achieve a cohesive, well-resolved result.',
		detail:
			'Structured advisory walkthroughs and evaluations where we pressure-test drawings, clarify contractor scopes, and protect your investment before construction commences.',
		points: ['On-site walkthrough', 'Written scope & budget bands', 'Contractor-ready guidance'],
		image: 'services/renovation-consultation'
	}
];

export interface Project {
	slug: string;
	title: string;
	category: 'Residential' | 'Commercial' | 'Furniture';
	year: string;
	location: string;
	scope: string;
	excerpt: string;
	body: string[];
	hero: string;
	gallery: { id: string; caption: string }[];
	/** Drives the asymmetric grid: 'tall' spans two rows, 'wide' spans two columns. */
	shape: 'tall' | 'wide' | 'square';
}

export const projects: Project[] = [
	{
		slug: 'bello-accent-chair-series',
		title: 'Bello Accent Chair Series',
		category: 'Furniture',
		year: '2025',
		location: 'JBC Workshop, Lagos',
		scope: 'Furniture design · Bespoke upholstery · Small-batch production',
		excerpt:
			'A considered collection of bespoke accent chairs, shaped with refined proportions, monogram detailing, and crafted to bring comfort, character, and quiet presence to the spaces they inhabit.',
		body: [
			'The Bello Accent Chair Series began with a single design principle: seating should define a space without overwhelming it. Designed and crafted entirely within our Lagos workshop, each piece balances generous proportions with architectural restraint.',
			'We construct every frame in-house using seasoned hardwood joinery, paired with layered foam densities and tailored upholstery selected to age with grace and character.',
			'Available in bespoke configurations, custom timber finishes, and signature monogram textile options, sized precisely to each room.'
		],
		hero: '/api/images/projects/bello-accent-chair-series/hero.webp',
		gallery: [
			{ id: '/api/images/projects/bello-accent-chair-series/01-chairs.webp', caption: 'Monogram accent chairs and solid timber side table' },
			{ id: '/api/images/projects/bello-accent-chair-series/02-workshop-showcase.webp', caption: 'Workshop frame construction and finished upholstery showcase' },
			{ id: '/api/images/projects/bello-accent-chair-series/03-dining-interior.webp', caption: 'Bespoke seating in contemporary dining and living setting' }
		],
		shape: 'tall'
	},
	{
		slug: 'pats-loft',
		title: 'Pat’s Loft',
		category: 'Residential',
		year: '2025',
		location: 'Lekki, Lagos',
		scope: 'Full interior design · Space planning · Bespoke furniture',
		excerpt:
			'A considered loft designed around modern living, balancing warmth, refined materials, and purposeful details to create a home that feels both elevated and deeply personal.',
		body: [
			'Pat’s Loft was conceived as an open-plan sanctuary that avoids the sterile detachment typical of industrial lofts. We softened clean structural lines with tactile finishes, custom timber millwork, and warm ambient lighting.',
			'The open floor plate required precise zoning. Bespoke partition joinery and furniture groupings articulate distinct areas for living, dining, and working without severing visual connection or blocking natural light.',
			'Every bespoke element, from the low-slung lounge seating to the recessed kitchen joinery, was manufactured in our workshop to fit the exact millimetre of the loft.'
		],
		hero: '/api/images/projects/pats-loft/hero.webp',
		gallery: [
			{ id: '/api/images/projects/pats-loft/01-living.webp', caption: 'Lounge and entertainment living space with bespoke timber panelling' },
			{ id: '/api/images/projects/pats-loft/02-bar-dining.webp', caption: 'Custom timber breakfast bar and partition joinery' },
			{ id: '/api/images/projects/pats-loft/03-kitchen.webp', caption: 'Full kitchen cabinetry with integrated appliances and under-cabinet lighting' },
			{ id: '/api/images/projects/pats-loft/04-kitchen-bar.webp', caption: 'Breakfast bar counter seating and corridor view' }
		],
		shape: 'square'
	},
	{
		slug: 'nest',
		title: 'Nest',
		category: 'Commercial',
		year: '2025',
		location: 'Victoria Island, Lagos',
		scope: 'Workplace strategy · Interior architecture · Custom joinery',
		excerpt:
			'A contemporary commercial space designed to balance function, identity, and experience, creating a work environment that feels purposeful, welcoming, and distinctly its own.',
		body: [
			'Nest reimagines what a contemporary commercial space can feel like when designed around human experience. Moving away from rigid corporate formality, the layout integrates collaborative work lounges, focused pods, and open gathering points.',
			'Acoustic comfort and sightline integrity guided the spatial planning. In-house custom joinery walls double as subtle division markers, dampening sound while maintaining openness and flow.',
			'Finished with durable yet warm materials, Nest demonstrates that commercial interiors can be efficient, enduring, and deeply characterful.'
		],
		hero: '/api/images/projects/nest/hero.webp',
		gallery: [
			{ id: '/api/images/projects/nest/01-reception.webp', caption: 'Reception lounge with branded signage and glass partition' },
			{ id: '/api/images/projects/nest/02-corridor.webp', caption: 'Illuminated walkway corridor and lounge breakout' },
			{ id: '/api/images/projects/nest/03-stairwell.webp', caption: 'Feature staircase with vertical garden and bamboo detail' }
		],
		shape: 'wide'
	}
];

export const categories = ['All', 'Residential', 'Commercial', 'Furniture'] as const;
export type Category = (typeof categories)[number];

export function projectBySlug(slug: string) {
	return projects.find((p) => p.slug === slug);
}
