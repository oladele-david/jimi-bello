-- 0002_seed_projects.sql: Seed portfolio projects
-- Bello Sofa Series (Furniture), Pat's Loft (Residential), Nest (Commercial)

DELETE FROM projects;

INSERT INTO projects (slug, title, category, year, location, scope, excerpt, body, hero, gallery, shape, display_order)
VALUES
(
    'bello-sofa-series',
    'Bello Sofa Series',
    'Furniture',
    '2025',
    'JBC Workshop, Lagos',
    'Furniture design · Bespoke upholstery · Small-batch production',
    'A considered collection of bespoke sofas, shaped with refined proportions and crafted to bring comfort, character, and quiet presence to the spaces they inhabit.',
    '["The Bello Sofa Series began with a single design principle: seating should define a space without overwhelming it. Designed and crafted entirely within our Lagos workshop, each piece balances generous proportions with architectural restraint.","We construct every frame in-house using seasoned hardwood joinery, paired with layered foam densities and tailored upholstery selected to age with grace and character.","Available in bespoke configurations, from intimate two-seaters to expansive modular arrangements, sized precisely to each room."]',
    'projects/four-poster-series/hero',
    '[{"id":"projects/four-poster-series/01","caption":"Frame construction and joinery detail"},{"id":"projects/iroko-dining-collection/01","caption":"Material selection and upholstery finish"},{"id":"projects/four-poster-series/02","caption":"Bello sofa in situ"}]',
    'tall',
    0
),
(
    'pats-loft',
    'Pat’s Loft',
    'Residential',
    '2025',
    'Lekki, Lagos',
    'Full interior design · Space planning · Bespoke furniture',
    'A considered loft designed around modern living, balancing warmth, refined materials, and purposeful details to create a home that feels both elevated and deeply personal.',
    '["Pat’s Loft was conceived as an open-plan sanctuary that avoids the sterile detachment typical of industrial lofts. We softened clean structural lines with tactile finishes, custom timber millwork, and warm ambient lighting.","The open floor plate required precise zoning. Bespoke partition joinery and furniture groupings articulate distinct areas for living, dining, and working without severing visual connection or blocking natural light.","Every bespoke element, from the low-slung lounge seating to the recessed kitchen joinery, was manufactured in our workshop to fit the exact millimetre of the loft."]',
    'projects/ikoyi-residence/hero',
    '[{"id":"projects/ikoyi-residence/01","caption":"Open-plan living space with custom joinery"},{"id":"projects/ikoyi-residence/02","caption":"Kitchen and dining zone"},{"id":"projects/ikoyi-residence/03","caption":"Principal bedroom suite"},{"id":"projects/ikoyi-residence/04","caption":"Built-in storage and details"}]',
    'square',
    1
),
(
    'nest',
    'Nest',
    'Commercial',
    '2025',
    'Victoria Island, Lagos',
    'Workplace strategy · Interior architecture · Custom joinery',
    'A contemporary commercial space designed to balance function, identity, and experience, creating a work environment that feels purposeful, welcoming, and distinctly its own.',
    '["Nest reimagines what a contemporary commercial space can feel like when designed around human experience. Moving away from rigid corporate formality, the layout integrates collaborative work lounges, focused pods, and open gathering points.","Acoustic comfort and sightline integrity guided the spatial planning. In-house custom joinery walls double as subtle division markers, dampening sound while maintaining openness and flow.","Finished with durable yet warm materials, Nest demonstrates that commercial interiors can be efficient, enduring, and deeply characterful."]',
    'projects/victoria-island-studio/hero',
    '[{"id":"projects/victoria-island-studio/01","caption":"Main collaborative workspace"},{"id":"projects/victoria-island-studio/02","caption":"Quiet meeting room and breakout pod"},{"id":"projects/victoria-island-studio/03","caption":"Acoustic joinery wall detail"}]',
    'wide',
    2
);
