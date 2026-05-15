-- Demo seed for local development.
-- Apply with: pnpm --filter @plates/db db:seed:local
-- Visit http://acme.localhost:3000 after running.

-- Wipe demo tenant if it exists (cascades to children)
DELETE FROM tenants WHERE id = 'ten_demo';

-- ─── Tenant ──────────────────────────────────────────────────────────────────
INSERT INTO tenants (
  id, subdomain, name, brand_color, default_currency, default_locale,
  hero_image_url, tagline, hero_headline
) VALUES (
  'ten_demo', 'acme', 'Acme Bistro',
  'oklch(0.62 0.18 145)', 'EUR', 'da',
  -- Admin UI will let tenants upload to R2. Empty here = TenantHero falls
  -- back to a brand-color-tinted gradient. Try a real image with:
  --   UPDATE tenants SET hero_image_url = 'https://your-r2.example/hero.jpg' WHERE id = 'ten_demo';
  NULL,
  'Bedste burgere og tacos i København',
  'Det perfekte sted til frisk lavet mad — på Nørrebro, Vesterbro og Frederiksberg.'
);

-- ─── Locations (3, to demo the location switcher) ───────────────────────────
INSERT INTO locations (
  id, tenant_id, slug, name, address_line1, city, postal_code, country,
  lat, lng, phone, email, timezone
) VALUES
  ('loc_norrebro', 'ten_demo', 'norrebro', 'Acme Bistro - Nørrebro',
   'Nørrebrogade 42', 'København N', '2200', 'DK',
   55.6938, 12.5527, '+45 12 34 56 78', 'norrebro@acmebistro.dk', 'Europe/Copenhagen'),
  ('loc_vesterbro', 'ten_demo', 'vesterbro', 'Acme Bistro - Vesterbro',
   'Istedgade 84', 'København V', '1650', 'DK',
   55.6680, 12.5466, '+45 12 34 56 79', 'vesterbro@acmebistro.dk', 'Europe/Copenhagen'),
  ('loc_frederiksberg', 'ten_demo', 'frederiksberg', 'Acme Bistro - Frederiksberg',
   'Gl. Kongevej 132', 'Frederiksberg', '1850', 'DK',
   55.6788, 12.5320, '+45 12 34 56 80', 'frederiksberg@acmebistro.dk', 'Europe/Copenhagen');

-- ─── Opening hours per location (Mon–Thu 11–22, Fri–Sat 11–23, Sun 12–21) ───
-- All three locations share the same hours for simplicity.
INSERT INTO opening_hours (id, location_id, day_of_week, open_minutes, close_minutes) VALUES
  -- Nørrebro
  ('oh_n_mon', 'loc_norrebro', 1, 660, 1320),
  ('oh_n_tue', 'loc_norrebro', 2, 660, 1320),
  ('oh_n_wed', 'loc_norrebro', 3, 660, 1320),
  ('oh_n_thu', 'loc_norrebro', 4, 660, 1320),
  ('oh_n_fri', 'loc_norrebro', 5, 660, 1380),
  ('oh_n_sat', 'loc_norrebro', 6, 660, 1380),
  ('oh_n_sun', 'loc_norrebro', 0, 720, 1260),
  -- Vesterbro
  ('oh_v_mon', 'loc_vesterbro', 1, 660, 1320),
  ('oh_v_tue', 'loc_vesterbro', 2, 660, 1320),
  ('oh_v_wed', 'loc_vesterbro', 3, 660, 1320),
  ('oh_v_thu', 'loc_vesterbro', 4, 660, 1320),
  ('oh_v_fri', 'loc_vesterbro', 5, 660, 1380),
  ('oh_v_sat', 'loc_vesterbro', 6, 660, 1380),
  ('oh_v_sun', 'loc_vesterbro', 0, 720, 1260),
  -- Frederiksberg
  ('oh_f_mon', 'loc_frederiksberg', 1, 660, 1320),
  ('oh_f_tue', 'loc_frederiksberg', 2, 660, 1320),
  ('oh_f_wed', 'loc_frederiksberg', 3, 660, 1320),
  ('oh_f_thu', 'loc_frederiksberg', 4, 660, 1320),
  ('oh_f_fri', 'loc_frederiksberg', 5, 660, 1380),
  ('oh_f_sat', 'loc_frederiksberg', 6, 660, 1380),
  ('oh_f_sun', 'loc_frederiksberg', 0, 720, 1260);

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
  'place_norrebro_demo', 'ten_demo', 'loc_norrebro', 'norrebro', 'Nørrebro',
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

-- ─── Content pages (drives nav + footer links + /[page] route) ──────────────
INSERT INTO content_pages (id, tenant_id, slug, title, body_md, seo_title, seo_description, is_published, ai_generated) VALUES
  ('cp_our_story', 'ten_demo', 'our-story', 'Vores historie',
   '## Fra Mexico City til Nørrebro

Acme Bistro startede i 2018 som en lille taqueria på Jægersborggade. Vi havde tre borde, én grill, og et stædigt princip: lave maden så friskt vi kunne, hver dag.

Syv år senere har vi tre afdelinger i København, men det grundlæggende er det samme. Vi maler vores eget oksekød fra Hindsholm. Vi presser tortillas til vores tacos i hånden. Vi laver salsa hver morgen — ingen flaske-versioner.

## Hvorfor vi ikke er på Wolt

Fordi vi ikke har lyst til at give 30 % af hvert måltid til en app. Vi vil hellere sælge direkte til dig, holde priserne fair, og levere selv i nabolaget. Det er også derfor du finder vores menu på vores eget site og ikke gemt bag en gebyr-mur.

Tak fordi du bestiller hos os.',
   'Vores historie · Acme Bistro',
   'Acme Bistro startede i 2018 som taqueria på Jægersborggade. I dag tre afdelinger i København, samme fokus på friske råvarer og direkte bestilling.',
   1, 0),

  ('cp_gift_cards', 'ten_demo', 'gift-cards', 'Gavekort',
   '## Giv et godt måltid videre

Gavekort til Acme Bistro kan bruges på alle vores afdelinger og online. De udløber ikke, og du kan tilpasse beløbet til præcis hvad du har lyst til at give.

## Sådan virker det

1. Vælg et beløb mellem 200 kr og 5.000 kr.
2. Skriv en personlig hilsen.
3. Vi sender gavekortet på email til modtageren — eller til dig hvis du selv vil printe det.

**Bestil gavekort:** [kontakt@acmebistro.dk](mailto:kontakt@acmebistro.dk)',
   'Gavekort · Acme Bistro',
   'Køb et gavekort til Acme Bistro. Kan bruges på alle afdelinger og online. Udløber ikke.',
   1, 0),

  ('cp_catering', 'ten_demo', 'catering', 'Catering',
   '## Catering til kontoret eller festen

Vi laver mad ud af huset til alt fra 10 til 200 personer. Tacos-bar, burger-stationer, bowls — eller en blanding af det hele. Vegetariske og veganske muligheder altid.

## Hvad får du

- En menu skræddersyet til dit event
- Frisk lavet mad leveret to timer før gæsterne ankommer
- Engangs-emballage hvis du har brug for det, ellers vores genbrugs-skåle
- Mulighed for at vi opstiller en taco-bar på stedet med en kok

## Bestil

Skriv til [catering@acmebistro.dk](mailto:catering@acmebistro.dk) mindst 5 dage før dit event. Større events: en uge.',
   'Catering til kontor og fest · Acme Bistro',
   'Acme Bistro laver catering til kontor, fester og events i København. Tacos, burgere, bowls — vegetar og vegan altid.',
   1, 0),

  ('cp_contact', 'ten_demo', 'contact', 'Kontakt',
   '## Skriv til os

Generelle henvendelser: [kontakt@acmebistro.dk](mailto:kontakt@acmebistro.dk)

Catering: [catering@acmebistro.dk](mailto:catering@acmebistro.dk)

Presse: [presse@acmebistro.dk](mailto:presse@acmebistro.dk)

## Find os

Se [vores afdelinger](/#locations) på forsiden for adresser, telefonnumre og åbningstider.',
   'Kontakt Acme Bistro',
   'Kontakt Acme Bistro for henvendelser, catering, eller presse. Tre afdelinger i København.',
   1, 0);
