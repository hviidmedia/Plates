-- Demo seed for local development.
-- Apply with: pnpm --filter @plates/db db:seed:local
-- Visit http://acme.localhost:3000 after running.

-- Wipe demo tenant if it exists (cascades to children)
DELETE FROM tenants WHERE id = 'ten_demo';

-- ─── Tenant ──────────────────────────────────────────────────────────────────
INSERT INTO tenants (id, subdomain, name, brand_color, default_currency, default_locale)
VALUES ('ten_demo', 'acme', 'Acme Bistro', 'oklch(0.62 0.18 145)', 'EUR', 'da');

-- ─── Location ────────────────────────────────────────────────────────────────
INSERT INTO locations (
  id, tenant_id, slug, name, address_line1, city, postal_code, country,
  lat, lng, phone, email, timezone
) VALUES (
  'loc_demo', 'ten_demo', 'norrebro', 'Acme Bistro - Nørrebro',
  'Nørrebrogade 42', 'København N', '2200', 'DK',
  55.6938, 12.5527, '+4512345678', 'norrebro@acmebistro.dk', 'Europe/Copenhagen'
);

-- ─── Opening hours (Mon–Thu 11–22, Fri–Sat 11–23, Sun 12–21) ────────────────
INSERT INTO opening_hours (id, location_id, day_of_week, open_minutes, close_minutes) VALUES
  ('oh_mon', 'loc_demo', 1, 660, 1320),
  ('oh_tue', 'loc_demo', 2, 660, 1320),
  ('oh_wed', 'loc_demo', 3, 660, 1320),
  ('oh_thu', 'loc_demo', 4, 660, 1320),
  ('oh_fri', 'loc_demo', 5, 660, 1380),
  ('oh_sat', 'loc_demo', 6, 660, 1380),
  ('oh_sun', 'loc_demo', 0, 720, 1260);

-- ─── Tags ────────────────────────────────────────────────────────────────────
INSERT INTO tags (id, tenant_id, slug, name) VALUES
  ('tag_popular', 'ten_demo', 'popular', 'Populært'),
  ('tag_vegan',   'ten_demo', 'vegan',   'Vegansk'),
  ('tag_spicy',   'ten_demo', 'spicy',   'Stærkt');

-- ─── Categories ──────────────────────────────────────────────────────────────
INSERT INTO categories (id, tenant_id, slug, name, description, position) VALUES
  ('cat_popular', 'ten_demo', 'popular', 'Populære',     'Vores mest bestilte retter.', 0),
  ('cat_burgers', 'ten_demo', 'burgers', 'Burgers',      'Hjemmemalet okse fra Hindsholm.', 1),
  ('cat_tacos',   'ten_demo', 'tacos',   'Tacos',        'Friske tortillas, hjemmelavede saucer.', 2),
  ('cat_bowls',   'ten_demo', 'bowls',   'Bowls',        'Sundere alternativ til frokost.', 3),
  ('cat_drinks',  'ten_demo', 'drinks',  'Drikkevarer',  'Hjemmebrygget og lokalt.', 4);

-- ─── Menu items ──────────────────────────────────────────────────────────────

-- Popular
INSERT INTO menu_items (id, tenant_id, category_id, slug, name, description, price_cents, currency, position) VALUES
  ('itm_norrebro_burger', 'ten_demo', 'cat_popular', 'norrebro-burger', 'Nørrebro Burger',
    'Hjemmemalet okse, brioche-bolle, cheddar, syltede agurker, spicy mayo.', 12900, 'EUR', 0),
  ('itm_birria_tacos',    'ten_demo', 'cat_popular', 'birria-tacos',    'Birria Tacos (3 stk.)',
    'Langtidsbraiseret oksekød, sprøde tortillas, consommé til at dyppe i.', 14500, 'EUR', 1),
  ('itm_halloumi_bowl',   'ten_demo', 'cat_popular', 'halloumi-bowl',   'Halloumi Bowl',
    'Quinoa, ristede grønsager, halloumi, tahini-dressing.', 11500, 'EUR', 2);

-- Burgers
INSERT INTO menu_items (id, tenant_id, category_id, slug, name, description, price_cents, currency, position) VALUES
  ('itm_classic_burger',  'ten_demo', 'cat_burgers', 'classic-burger',  'Classic Burger',
    'Okse, salat, tomat, syltede løg, burger sauce.', 10900, 'EUR', 0),
  ('itm_double_cheese',   'ten_demo', 'cat_burgers', 'double-cheese',   'Double Cheese',
    'Dobbelt patty, dobbelt cheddar, smaltede løg.', 14900, 'EUR', 1),
  ('itm_veggie_burger',   'ten_demo', 'cat_burgers', 'veggie-burger',   'Veggie Burger',
    'Sortebønne-patty, avocado, sprøde løg, chipotle-mayo.', 11500, 'EUR', 2);

-- Tacos
INSERT INTO menu_items (id, tenant_id, category_id, slug, name, description, price_cents, currency, position) VALUES
  ('itm_carnitas_tacos',  'ten_demo', 'cat_tacos',   'carnitas-tacos',  'Carnitas Tacos (3 stk.)',
    'Sprødt grisekød, syltede rødløg, koriander, lime.', 12500, 'EUR', 0),
  ('itm_fish_tacos',      'ten_demo', 'cat_tacos',   'fish-tacos',      'Fish Tacos (3 stk.)',
    'Sprøde fisk, mango-salsa, chipotle crema.', 13500, 'EUR', 1),
  ('itm_mushroom_tacos',  'ten_demo', 'cat_tacos',   'mushroom-tacos',  'Mushroom Tacos (3 stk.)',
    'Smørstegte champignons, pico de gallo, vegan crema.', 11500, 'EUR', 2);

-- Bowls
INSERT INTO menu_items (id, tenant_id, category_id, slug, name, description, price_cents, currency, position) VALUES
  ('itm_burrito_bowl',    'ten_demo', 'cat_bowls',   'burrito-bowl',    'Burrito Bowl',
    'Ris, sorte bønner, kylling, salsa, guacamole.', 11900, 'EUR', 0),
  ('itm_poke_bowl',       'ten_demo', 'cat_bowls',   'poke-bowl',       'Poke Bowl',
    'Sushi-ris, frisk laks, edamame, avocado, sesam-dressing.', 13500, 'EUR', 1),
  ('itm_buddha_bowl',     'ten_demo', 'cat_bowls',   'buddha-bowl',     'Buddha Bowl',
    'Quinoa, kikærter, søde kartofler, grønkål, tahini.', 11500, 'EUR', 2);

-- Drinks
INSERT INTO menu_items (id, tenant_id, category_id, slug, name, description, price_cents, currency, position) VALUES
  ('itm_lemonade',        'ten_demo', 'cat_drinks',  'homemade-lemonade', 'Hjemmelavet lemonade',
    'Citron, ingefær, mynte. 0.5L.', 4500, 'EUR', 0),
  ('itm_natural_wine',    'ten_demo', 'cat_drinks',  'natural-wine',      'Glas naturvin',
    'Skiftende vine fra små europæiske producenter.', 7500, 'EUR', 1),
  ('itm_craft_beer',      'ten_demo', 'cat_drinks',  'craft-beer',        'Craft øl',
    'Lokalt bryg fra Mikkeller. 33cl.', 5500, 'EUR', 2);

-- ─── Demo local SEO landing page ─────────────────────────────────────────────
-- This is hand-written placeholder copy. The AI generator (packages/ai) will
-- replace the title/seo/body fields when the admin triggers regeneration.

INSERT INTO local_seo_pages (
  id, tenant_id, location_id, slug, area_name, title,
  body_md, seo_title, seo_description, is_published, ai_generated
) VALUES (
  'place_norrebro_demo', 'ten_demo', 'loc_demo', 'norrebro', 'Nørrebro',
  'Brunch og bestilling på Nørrebro',
  '## Nørrebros bedste til pickup eller levering

På Nørrebrogade 42, midt i et af Københavns mest livlige områder, finder du Acme Bistro. Vi laver mad fra bunden — alt fra Nørrebro Burgeren med hjemmemalet okse til vores Birria Tacos med langtidsbraiseret kød.

## Hvad gør os til et godt valg på Nørrebro

Nørrebros frokost- og aftensscene er stærk, men vi skiller os ud på tre fronter: prisen er rimelig, råvarerne er friske hver dag, og du kan bestille direkte hos os uden at betale 30 % i kommission til Wolt eller Uber Eats.

Vi ligger 2 minutters gang fra Assistens Kirkegård og 5 minutter fra Nørrebro Station. Perfekt til at tage med hjem efter en gåtur, eller bestille til levering hvis du arbejder hjemmefra i området.

## Til levering i nabolaget

Vi leverer i hele Nørrebro samt nærliggende områder: Jagtvej, Nørrebrogade, Fælledparken-kanten og videre mod Frederiksberg. Bestil før kl. 21 og vi sender ud samme aften.',
  'Bestil mad på Nørrebro — Acme Bistro',
  'Acme Bistro på Nørrebrogade 42. Frisklavet mad til pickup og levering på Nørrebro. Bestil direkte uden kommission.',
  1,
  0
);

-- ─── Tag mappings ────────────────────────────────────────────────────────────
INSERT INTO menu_item_tags (menu_item_id, tag_id) VALUES
  ('itm_norrebro_burger', 'tag_popular'),
  ('itm_birria_tacos',    'tag_popular'),
  ('itm_halloumi_bowl',   'tag_popular'),
  ('itm_veggie_burger',   'tag_vegan'),
  ('itm_mushroom_tacos',  'tag_vegan'),
  ('itm_buddha_bowl',     'tag_vegan');
