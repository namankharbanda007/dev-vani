-- SQL script to delete specific premade personalities
-- This will only delete personalities where creator_id IS NULL (premade ones)
-- maintaining user-created copies if they exist.

DELETE FROM "public"."personalities" 
WHERE "creator_id" IS NULL 
AND "title" IN (
    'Anya',
    'Lord Shri Ram',
    'Godess Laxmi',
    'Mata Parvati: The Divine Mother',
    'Marco''s Magical Time Machine',
    'Zara''s Zoo Mystery',
    'Captain Coral''s Ocean Expedition',
    'Pip''s Pixie Garden',
    'Luna''s Stellar Adventure',
    'Miles and the Multiverse Mix-up',
    'Trixie''s Time Travel Safari',
    'Professor Particle''s Incredible Laboratory',
    'Rex and the Lost World',
    'Elsa''s Frozen Mystery',
    'Sam the Soft-hearted',
    'Maximillian the Curious Explorer',
    'Sir Oliver P. Bearington',
    'Lili, la Llama Bibliotecaria (es)',
    'Sofi, la Guía Estelar (es)',
    'Tango, el Gaucho Matemático (es)',
    'Fito, el Futbolero Argentino (es)',
    'Pepa, la Pingüina del Inglés (es)',
    'Santa Claus',
    'Qura',
    'Porous Pete',
    'Luna the Epilepsy Guardian',
    'Iron Man',
    'Gandalf',
    'Sherlock',
    'Art guru',
    'Fitness coach',
    'Eco champ',
    'Master chef',
    'Batman',
    'Geo guide',
    'Blood test pal',
    'Math wiz'
);
