-- Ensure new theme columns exist in existing databases
ALTER TABLE theme_settings ADD COLUMN IF NOT EXISTS primary_font VARCHAR(100);
ALTER TABLE theme_settings ADD COLUMN IF NOT EXISTS headings_font VARCHAR(100);
ALTER TABLE theme_settings ADD COLUMN IF NOT EXISTS base_font_size VARCHAR(10);
ALTER TABLE theme_settings ADD COLUMN IF NOT EXISTS headings_text_color VARCHAR(20);
ALTER TABLE theme_settings ADD COLUMN IF NOT EXISTS button_primary_text_color VARCHAR(20);

-- Backfill defaults if null
UPDATE theme_settings SET primary_font = COALESCE(primary_font, 'Poppins');
UPDATE theme_settings SET headings_font = COALESCE(headings_font, primary_font);
UPDATE theme_settings SET base_font_size = COALESCE(base_font_size, '16px');
UPDATE theme_settings SET button_primary_text_color = COALESCE(button_primary_text_color, '#ffffff');

