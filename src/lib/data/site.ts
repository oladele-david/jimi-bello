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
	material?: string;
	dimensions?: string;
	featured?: boolean;
}

export const products: Product[] = [
	{
		slug: 'bello-sofa-series',
		title: 'Bello Sofa Series',
		category: 'Living',
		description: 'Generously proportioned seating with clean architectural lines and deep, tailored cushioning.',
		image: 'projects/ikoyi-residence/hero',
		material: 'Solid timber frame, bespoke upholstery',
		featured: true
	},
	{
		slug: 'four-poster-bed',
		title: 'Four-Poster Bed Frame',
		category: 'Bedroom',
		description: 'Redrawn for standard room heights — strong vertical posts with joinery-first construction.',
		image: 'projects/four-poster-series/hero',
		material: 'Solid Iroko / Walnut',
		featured: true
	},
	{
		slug: 'iroko-dining-table',
		title: 'Iroko Dining Table',
		category: 'Dining',
		description: 'Single-slab top on a knocked-down trestle base, built to the exact millimetre your room needs.',
		image: 'projects/iroko-dining-collection/hero',
		material: 'Solid Iroko Timber',
		featured: true
	},
	{
		slug: 'woodwolves-credenza',
		title: 'Woodwolves Credenza',
		category: 'Storage',
		description: 'Handcrafted cabinetry with integrated flush pulls and soft-closing joinery.',
		image: 'projects/ikoyi-residence/04',
		material: 'Smoked Oak & Brass',
		featured: false
	},
	{
		slug: 'steam-bent-dining-chair',
		title: 'Steam-Bent Dining Chair',
		category: 'Dining',
		description: 'Curved back support with seat height calibrated directly to our dining collection.',
		image: 'projects/iroko-dining-collection/02',
		material: 'Solid Timber, Linen Pad',
		featured: false
	},
	{
		slug: 'loft-coffee-table',
		title: 'Loft Coffee Table',
		category: 'Living',
		description: 'Low-profile solid wood coffee table with organic edge treatment and recessed base.',
		image: 'projects/four-poster-series/02',
		material: 'Natural Walnut',
		featured: false
	}
];

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
		slug: 'ikoyi-residence',
		title: 'Ikoyi Residence',
		category: 'Residential',
		year: '2025',
		location: 'Ikoyi, Lagos',
		scope: 'Full interior design · Bespoke furniture · Lighting',
		excerpt:
			'A four-bedroom family home stripped back to its structure, then rebuilt around a single twelve-seat dining table.',
		body: [
			'The brief was blunt: the family ate in the kitchen because the dining room was unusable. It was long, dark, and furnished with a table too small for the people who actually showed up on Sundays.',
			'We removed the partition to the rear courtyard, which gave the room a second light source, and built a twelve-seat table in solid iroko sized to the room rather than to a catalogue. Everything else — the sideboard, the bench seating, the lighting positions — was designed after the table, not before it.',
			'The rest of the house follows the same logic. Storage is built in where the family already dropped things, and the palette stays deliberately narrow so the timber does the talking.'
		],
		hero: 'projects/ikoyi-residence/hero',
		gallery: [
			{ id: 'projects/ikoyi-residence/01', caption: 'Living room, looking toward the courtyard' },
			{
				id: 'projects/ikoyi-residence/02',
				caption: 'Dining room with the twelve-seat iroko table'
			},
			{ id: 'projects/ikoyi-residence/03', caption: 'Principal bedroom' },
			{ id: 'projects/ikoyi-residence/04', caption: 'Built-in storage, upper landing' }
		],
		shape: 'tall'
	},
	{
		slug: 'victoria-island-studio',
		title: 'Victoria Island Studio',
		category: 'Commercial',
		year: '2025',
		location: 'Victoria Island, Lagos',
		scope: 'Space planning · Workplace fit-out · Joinery',
		excerpt:
			'Forty desks, one floor plate, and a client who refused to put anyone in a corner without daylight.',
		body: [
			'A creative agency taking a full floor asked for something unusual: no private offices on the window line. That constraint set the plan. Meeting rooms and stores were pushed into the core, and the perimeter was kept open for desks.',
			'We built the storage walls in-house so they could double as acoustic separation, and specified a material palette that survives forty people and a lot of coffee.',
			'The result seats more people than the previous layout while giving every desk a sightline to a window.'
		],
		hero: 'projects/victoria-island-studio/hero',
		gallery: [
			{ id: 'projects/victoria-island-studio/01', caption: 'Open studio floor' },
			{ id: 'projects/victoria-island-studio/02', caption: 'Meeting room in the core' },
			{
				id: 'projects/victoria-island-studio/03',
				caption: 'Storage wall doubling as acoustic separation'
			}
		],
		shape: 'wide'
	},
	{
		slug: 'four-poster-series',
		title: 'Four-Poster Series',
		category: 'Furniture',
		year: '2024',
		location: 'JBC Workshop, Lagos',
		scope: 'Furniture design · Prototyping · Small-batch production',
		excerpt:
			'A four-poster bed redrawn for rooms with normal ceilings — the posts carry the frame, not a canopy.',
		body: [
			'Traditional four-posters assume a ceiling height most homes do not have. We kept the posts, dropped the canopy, and let the frame do the structural work so the piece reads tall without touching the ceiling.',
			'Three prototypes went through the workshop before the joint at the head rail was right. The production version breaks down into five components for delivery through a standard doorway.',
			'Available in iroko, walnut and oak, sized to the room.'
		],
		hero: 'projects/four-poster-series/hero',
		gallery: [
			{ id: 'projects/four-poster-series/01', caption: 'Head rail joint detail' },
			{ id: 'projects/four-poster-series/02', caption: 'Iroko, in situ' },
			{ id: 'projects/four-poster-series/03', caption: 'Workshop, third prototype' }
		],
		shape: 'square'
	},
	{
		slug: 'lekki-duplex',
		title: 'Lekki Duplex',
		category: 'Residential',
		year: '2024',
		location: 'Lekki Phase 1, Lagos',
		scope: 'Renovation consultation · Interior design',
		excerpt:
			'A stalled renovation restarted with a written scope and a budget the client could hold us to.',
		body: [
			'The client came to us eighteen months into a renovation that had stopped twice. We were hired for a consultation, not a design — a walkthrough, a written scope, and honest numbers.',
			'The scope showed the remaining work was smaller than the client feared and the sequencing was the real problem. They asked us to stay on and finish the interiors.',
			'Completed four months later, within the band we quoted on day one.'
		],
		hero: 'projects/lekki-duplex/hero',
		gallery: [
			{ id: 'projects/lekki-duplex/01', caption: 'Reworked stair hall' },
			{ id: 'projects/lekki-duplex/02', caption: 'Kitchen, after' },
			{ id: 'projects/lekki-duplex/03', caption: 'Guest room' }
		],
		shape: 'square'
	},
	{
		slug: 'ikeja-showroom',
		title: 'Ikeja Showroom',
		category: 'Commercial',
		year: '2024',
		location: 'Ikeja GRA, Lagos',
		scope: 'Retail interior · Display joinery',
		excerpt:
			'A showroom where the display system is the architecture — no plinths, no vinyl, no clutter.',
		body: [
			'Retail interiors accumulate. Plinths get added, graphics get taped up, and within a year the space reads like a warehouse sale.',
			'We built a single continuous display armature into the walls so new stock has somewhere to go without anything being bolted on. Lighting is on the same armature and moves with it.',
			'Two years in, the showroom still photographs the way it did on opening week.'
		],
		hero: 'projects/ikeja-showroom/hero',
		gallery: [
			{ id: 'projects/ikeja-showroom/01', caption: 'Continuous display armature' },
			{ id: 'projects/ikeja-showroom/02', caption: 'Entrance sightline' }
		],
		shape: 'wide'
	},
	{
		slug: 'iroko-dining-collection',
		title: 'Iroko Dining Collection',
		category: 'Furniture',
		year: '2023',
		location: 'JBC Workshop, Lagos',
		scope: 'Furniture design · Made to measure',
		excerpt:
			'Tables and chairs cut from a single log run, so the grain carries across the whole set.',
		body: [
			'When a client orders a table and eight chairs separately, the timber rarely matches. We buy by the log for collection pieces so grain and colour run through the set.',
			'The table is a single-slab top on a trestle base that knocks down flat. The chairs are steam-bent, with a seat height set to the table rather than to a standard.',
			'Each set is numbered and recorded against the log it came from.'
		],
		hero: 'projects/iroko-dining-collection/hero',
		gallery: [
			{ id: 'projects/iroko-dining-collection/01', caption: 'Trestle base detail' },
			{ id: 'projects/iroko-dining-collection/02', caption: 'Steam-bent chair backs' }
		],
		shape: 'square'
	}
];

export const categories = ['All', 'Residential', 'Commercial', 'Furniture'] as const;
export type Category = (typeof categories)[number];

export function projectBySlug(slug: string) {
	return projects.find((p) => p.slug === slug);
}
