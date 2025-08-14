-- Add role column to user table
ALTER TABLE user ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'CLIENT';

-- Update existing admin user if present
UPDATE user SET role = 'ADMIN' WHERE email = 'admin@invitationes.com';


