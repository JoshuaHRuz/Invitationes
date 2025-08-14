ALTER TABLE landing_section ADD COLUMN IF NOT EXISTS image_side VARCHAR(10);
UPDATE landing_section SET image_side = 'right' WHERE image_side IS NULL;

