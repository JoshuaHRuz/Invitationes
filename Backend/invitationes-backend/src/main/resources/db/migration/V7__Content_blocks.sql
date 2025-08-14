CREATE TABLE content_block (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(50) NOT NULL,
  block_type VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  subtitle VARCHAR(255),
  content_html TEXT,
  image_url VARCHAR(1000),
  image_side VARCHAR(10),
  data_json TEXT,
  order_index INT,
  active BOOLEAN DEFAULT TRUE
);



