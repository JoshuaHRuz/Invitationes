-- Add only missing columns (compatibilidad: evitar IF NOT EXISTS)
-- Las columnas primary_font, headings_font y base_font_size ya existen desde V4 en esta BD.
ALTER TABLE theme_settings ADD COLUMN headings_text_color VARCHAR(20);
ALTER TABLE theme_settings ADD COLUMN button_primary_text_color VARCHAR(20);

-- Backfill defaults if null
UPDATE theme_settings SET primary_font = COALESCE(primary_font, 'Poppins');
UPDATE theme_settings SET headings_font = COALESCE(headings_font, primary_font);
UPDATE theme_settings SET base_font_size = COALESCE(base_font_size, '16px');
UPDATE theme_settings SET button_primary_text_color = COALESCE(button_primary_text_color, '#ffffff');

