-- Tables for landing content
CREATE TABLE landing_slide (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  subtitle VARCHAR(500),
  image_url VARCHAR(1000),
  background_color VARCHAR(20),
  order_index INT,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE landing_section (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  content_html TEXT,
  image_url VARCHAR(1000),
  order_index INT,
  active BOOLEAN DEFAULT TRUE
);

-- Seed initial minimal content
INSERT INTO landing_slide (title, subtitle, image_url, background_color, order_index, active) VALUES
('Diseños Elegantes y Modernos', 'Crea invitaciones memorables con nosotros.', NULL, '#4a148c', 1, TRUE),
('Personalización al Instante', 'Edición en tiempo real con vista previa.', NULL, '#880e4f', 2, TRUE),
('Confirma Asistencia Fácilmente', 'RSVP y mensajes para tus invitados.', NULL, '#6a1b9a', 3, TRUE);

INSERT INTO landing_section (title, content_html, image_url, order_index, active) VALUES
('¿Por qué Invitationes?', '<p>Una plataforma enfocada en experiencias memorables para tus eventos.</p>', NULL, 1, TRUE);



