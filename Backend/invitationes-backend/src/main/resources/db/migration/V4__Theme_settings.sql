CREATE TABLE theme_settings (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  primary_color VARCHAR(20),
  secondary_color VARCHAR(20),
  background_color VARCHAR(20),
  text_color VARCHAR(20),
  primary_font VARCHAR(100),
  headings_font VARCHAR(100),
  base_font_size VARCHAR(10),
  headings_text_color VARCHAR(20),
  button_primary_text_color VARCHAR(20)
);

INSERT INTO theme_settings (primary_color, secondary_color, background_color, text_color, primary_font, headings_font, base_font_size, headings_text_color, button_primary_text_color) VALUES
('#6a1b9a', '#880e4f', '#ffffff', '#111827', 'Poppins', 'Poppins', '16px', NULL, '#ffffff');


