-- 0003_add_products.sql: Create products table and seed initial catalogue
CREATE TABLE IF NOT EXISTS products (
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
    gallery TEXT NOT NULL DEFAULT '[]', -- JSON array of image keys
    featured INTEGER NOT NULL DEFAULT 0,
    details TEXT NOT NULL DEFAULT '[]', -- JSON array of { label: string, value: string }
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);

DELETE FROM products;

INSERT INTO products (slug, title, category, price, price_note, description, image, material, dimensions, lead_time, gallery, featured, details, display_order)
VALUES
(
    'bello-sofa-series',
    'Bello Sofa Series',
    'Living',
    '₦2,400,000',
    'Made to order · Custom sizing & upholstery available',
    'A considered collection of bespoke sofas, shaped with refined proportions and crafted to bring comfort, character, and quiet presence to the spaces they inhabit. Designed and crafted entirely in our Lagos workshop.',
    'projects/ikoyi-residence/hero',
    'Solid hardwood frame, bespoke linen-blend upholstery',
    'W: 2400mm · D: 980mm · H: 780mm',
    '4–6 weeks',
    '["projects/four-poster-series/01","projects/iroko-dining-collection/01","projects/four-poster-series/02"]',
    1,
    '[{"label":"Origin","value":"Handcrafted in JBC Workshop, Lagos"},{"label":"Frame","value":"Seasoned kiln-dried hardwood joinery"},{"label":"Cushioning","value":"High-resilience layered foam with fiber wrap"},{"label":"Customization","value":"Bespoke fabric choices, modular sizing upon request"}]',
    0
),
(
    'four-poster-bed',
    'Four-Poster Bed Frame',
    'Bedroom',
    '₦1,950,000',
    'Available in Queen & King · Built to room ceiling height',
    'Redrawn for standard room heights — strong vertical posts with joinery-first construction. The frame carries the visual height without requiring high ceilings or canopies.',
    'projects/four-poster-series/hero',
    'Solid Iroko / Seasoned West African Walnut',
    'L: 2150mm · W: 1950mm · H: 2100mm',
    '4–5 weeks',
    '["projects/four-poster-series/01","projects/four-poster-series/02","projects/four-poster-series/03"]',
    1,
    '[{"label":"Timber","value":"Solid Iroko or Walnut, sustainably sourced"},{"label":"Assembly","value":"Knocks down into 5 modular components for easy delivery"},{"label":"Finish","value":"Matte architectural timber oil"},{"label":"Sizing","value":"Tailored to mattress specifications"}]',
    1
),
(
    'iroko-dining-table',
    'Iroko Dining Table',
    'Dining',
    '₦2,800,000',
    'Single-slab timber run · Custom lengths from 8 to 14 seats',
    'Single-slab top on a knocked-down trestle base, built to the exact millimetre your room needs. Cut from single log runs so grain and tone remain continuous across the expanse.',
    'projects/iroko-dining-collection/hero',
    'Solid Iroko Timber, matte architectural oil',
    'L: 3000mm · W: 1100mm · H: 750mm',
    '5–7 weeks',
    '["projects/iroko-dining-collection/01","projects/iroko-dining-collection/02"]',
    1,
    '[{"label":"Wood Selection","value":"Single log run solid Iroko slab"},{"label":"Base","value":"Hand-shaped timber trestle with mortise & tenon joints"},{"label":"Maintenance","value":"Water and stain-resistant satin seal"},{"label":"Capacity","value":"Comfortably seats 10–12 persons"}]',
    2
),
(
    'woodwolves-credenza',
    'Woodwolves Credenza',
    'Storage',
    '₦1,650,000',
    'Integrated soft-closing hardware',
    'Handcrafted cabinetry with integrated flush pulls and soft-closing joinery. Generous interior storage configured for home audio, glassware, or curated essentials.',
    'projects/ikoyi-residence/04',
    'Smoked Oak, hand-turned brass hardware',
    'W: 2000mm · D: 500mm · H: 800mm',
    '4–6 weeks',
    '["projects/ikoyi-residence/01","projects/ikoyi-residence/03"]',
    0,
    '[{"label":"Hardware","value":"Concealed Blum soft-close hinges, brass pulls"},{"label":"Interior","value":"Adjustable timber shelves with cable access management"},{"label":"Finish","value":"Natural smoked oak with UV lacquer"}]',
    3
),
(
    'steam-bent-dining-chair',
    'Steam-Bent Dining Chair',
    'Dining',
    '₦380,000',
    'Sold individually or in tailored sets',
    'Curved back support with seat height calibrated directly to our dining collection. Engineered using traditional steam-bending techniques for ergonomic comfort and structural resilience.',
    'projects/iroko-dining-collection/02',
    'Steam-bent solid hardwood, natural linen seat pad',
    'W: 520mm · D: 540mm · H: 820mm (Seat H: 460mm)',
    '3–4 weeks',
    '["projects/iroko-dining-collection/01"]',
    0,
    '[{"label":"Craft Technique","value":"Steam-bent solid timber curve"},{"label":"Upholstery","value":"Removable natural Belgian linen pad"},{"label":"Stackability","value":"Designed for graceful pairing with JBC tables"}]',
    4
),
(
    'loft-coffee-table',
    'Loft Coffee Table',
    'Living',
    '₦850,000',
    'Each slab features unique natural edge grain',
    'Low-profile solid wood coffee table with organic edge treatment and recessed architectural base. Designed to ground open living rooms with warmth and tactile presence.',
    'projects/four-poster-series/02',
    'Natural Walnut, satin protective seal',
    'L: 1400mm · W: 750mm · H: 380mm',
    '3–4 weeks',
    '["projects/four-poster-series/03"]',
    0,
    '[{"label":"Profile","value":"Chamfered edge with recessed shadowline base"},{"label":"Wood","value":"Selected American Walnut with warm amber undertones"},{"label":"Finish","value":"Durable matte polyurethane sealer"}]',
    5
);
