-- Initial schema creation for Invitationes Backend
-- This script creates all necessary tables for the models and adds test users

-- Create User table
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- Create Invitation table
CREATE TABLE invitation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    host_id BIGINT NOT NULL,
    event_name VARCHAR(255),
    full_event_title VARCHAR(500),
    date DATETIME,
    couple_name1 VARCHAR(255),
    couple_name2 VARCHAR(255),
    vow1 TEXT,
    vow2 TEXT,
    story_main_image_url VARCHAR(500),
    show_welcome_screen BOOLEAN DEFAULT FALSE,
    show_music_player BOOLEAN DEFAULT FALSE,
    show_story BOOLEAN DEFAULT FALSE,
    show_countdown BOOLEAN DEFAULT FALSE,
    show_godparents BOOLEAN DEFAULT FALSE,
    show_event_details BOOLEAN DEFAULT FALSE,
    show_photo_gallery BOOLEAN DEFAULT FALSE,
    show_gift_registry BOOLEAN DEFAULT FALSE,
    show_itinerary BOOLEAN DEFAULT FALSE,
    show_rsvp_form BOOLEAN DEFAULT FALSE,
    show_footer BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (host_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Create Event table
CREATE TABLE event (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    name VARCHAR(255),
    location VARCHAR(255),
    address VARCHAR(500),
    time VARCHAR(255),
    map_url VARCHAR(500),
    image_url VARCHAR(500),
    image_order VARCHAR(10),
    FOREIGN KEY (invitation_id) REFERENCES invitation(id) ON DELETE CASCADE
);

-- Create GuestGroup table
CREATE TABLE guest_group (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    group_name VARCHAR(255),
    whatsapp_number VARCHAR(20),
    allowed_passes INT DEFAULT 1,
    status VARCHAR(50) DEFAULT 'PENDING',
    FOREIGN KEY (invitation_id) REFERENCES invitation(id) ON DELETE CASCADE
);

-- Create Attendee table
CREATE TABLE attendee (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    guest_group_id BIGINT NOT NULL,
    name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING',
    FOREIGN KEY (guest_group_id) REFERENCES guest_group(id) ON DELETE CASCADE
);

-- Create ItineraryItem table
CREATE TABLE itinerary_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    time VARCHAR(255),
    title VARCHAR(255),
    icon VARCHAR(255),
    FOREIGN KEY (invitation_id) REFERENCES invitation(id) ON DELETE CASCADE
);

-- Create Photo table
CREATE TABLE photo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    src VARCHAR(500),
    alt VARCHAR(255),
    FOREIGN KEY (invitation_id) REFERENCES invitation(id) ON DELETE CASCADE
);

-- Create Godparent table
CREATE TABLE godparent (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    type VARCHAR(255),
    icon VARCHAR(255),
    FOREIGN KEY (invitation_id) REFERENCES invitation(id) ON DELETE CASCADE
);

-- Create Godparent_names table (for @ElementCollection)
CREATE TABLE godparent_names (
    godparent_id BIGINT NOT NULL,
    names VARCHAR(255),
    FOREIGN KEY (godparent_id) REFERENCES godparent(id) ON DELETE CASCADE
);

-- Insert test users
INSERT INTO user (email, password_hash, name) VALUES
('admin@invitationes.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLzfKW4nAl4e', 'Administrator'),
('john.doe@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLzfKW4nAl4e', 'John Doe'),
('jane.smith@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLzfKW4nAl4e', 'Jane Smith'),
('maria.garcia@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLzfKW4nAl4e', 'Maria Garcia'),
('carlos.rodriguez@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBaLzfKW4nAl4e', 'Carlos Rodriguez');

-- Insert sample invitation data
INSERT INTO invitation (host_id, event_name, full_event_title, date, couple_name1, couple_name2, vow1, vow2, story_main_image_url, show_welcome_screen, show_music_player, show_story, show_countdown, show_godparents, show_event_details, show_photo_gallery, show_gift_registry, show_itinerary, show_rsvp_form, show_footer) VALUES
(2, 'Boda', 'La Boda de John y Jane', '2024-06-15 18:00:00', 'John', 'Jane', 'Prometo amarte por siempre', 'Prometo estar a tu lado siempre', 'https://example.com/story-image.jpg', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);

-- Insert sample events
INSERT INTO event (invitation_id, name, location, address, time, map_url, image_url, image_order) VALUES
(1, 'Ceremonia Religiosa', 'Iglesia San José', 'Calle Principal 123, Ciudad', '18:00', 'https://maps.google.com/example', 'https://example.com/church.jpg', 'left'),
(1, 'Recepción', 'Salón de Eventos Paradise', 'Avenida Central 456, Ciudad', '20:00', 'https://maps.google.com/example2', 'https://example.com/reception.jpg', 'right');

-- Insert sample guest groups
INSERT INTO guest_group (invitation_id, group_name, whatsapp_number, allowed_passes, status) VALUES
(1, 'Familia Doe', '+1234567890', 4, 'CONFIRMED'),
(1, 'Amigos Universidad', '+0987654321', 6, 'PENDING');

-- Insert sample attendees
INSERT INTO attendee (guest_group_id, name, status) VALUES
(1, 'Robert Doe', 'ATTENDING'),
(1, 'Susan Doe', 'ATTENDING'),
(1, 'Michael Doe', 'NOT_ATTENDING'),
(2, 'Alex Johnson', 'PENDING'),
(2, 'Sarah Wilson', 'ATTENDING');

-- Insert sample itinerary items
INSERT INTO itinerary_item (invitation_id, time, title, icon) VALUES
(1, '17:30', 'Llegada de invitados', 'clock'),
(1, '18:00', 'Ceremonia religiosa', 'church'),
(1, '19:00', 'Sesión de fotos', 'camera'),
(1, '20:00', 'Recepción y cena', 'utensils'),
(1, '22:00', 'Baile y celebración', 'music');

-- Insert sample photos
INSERT INTO photo (invitation_id, src, alt) VALUES
(1, 'https://example.com/photo1.jpg', 'Foto de compromiso 1'),
(1, 'https://example.com/photo2.jpg', 'Foto de compromiso 2'),
(1, 'https://example.com/photo3.jpg', 'Foto de compromiso 3');

-- Insert sample godparents
INSERT INTO godparent (invitation_id, type, icon) VALUES
(1, 'Padrinos de Boda', 'heart'),
(1, 'Padrinos de Anillos', 'ring');

-- Insert godparent names
INSERT INTO godparent_names (godparent_id, names) VALUES
(1, 'Pedro Martinez'),
(1, 'Ana Martinez'),
(2, 'Luis Garcia'),
(2, 'Carmen Garcia');