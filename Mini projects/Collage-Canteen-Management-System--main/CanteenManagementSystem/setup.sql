-- Create database
CREATE DATABASE IF NOT EXISTS canteen_db;
USE canteen_db;
-- Users table (admin/staff)
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'staff'))
);
-- Menu items table
CREATE TABLE menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
-- Orders table
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending'
);
-- Order items table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES menu_items(id) ON DELETE CASCADE
);
-- Insert sample users with SHA-256 hashed passwords ('admin123' and 'staff123')
INSERT INTO users (username, password, role)
VALUES ('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin'),
       ('staff', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'staff');
-- Insert sample menu items
INSERT INTO menu_items (name, price)
VALUES ('Samosa', 20.00),
    ('Coffee', 25.00),
    ('Sandwich', 35.00),
    ('Juice', 30.00);