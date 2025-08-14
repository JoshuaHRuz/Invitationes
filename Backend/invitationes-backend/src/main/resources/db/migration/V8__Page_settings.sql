CREATE TABLE page_setting (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(50) UNIQUE NOT NULL,
  menu_title VARCHAR(255),
  order_index INT,
  enabled BOOLEAN DEFAULT TRUE
);

INSERT INTO page_setting (page, menu_title, order_index, enabled) VALUES
('about','Nosotros',1,TRUE),
('services','Servicios',2,TRUE),
('team','Equipo',3,TRUE),
('projects','Proyectos',4,TRUE),
('testimonials','Testimonios',5,TRUE),
('faq','FAQ',6,TRUE),
('pricing','Precios',7,TRUE);


