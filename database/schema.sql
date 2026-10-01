CREATE DATABASE IF NOT EXISTS pc_parts_shop
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pc_parts_shop;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL DEFAULT '',
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  catalog_key VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(120) NOT NULL DEFAULT '',
  maker VARCHAR(100) NOT NULL DEFAULT '',
  category VARCHAR(80) NOT NULL,
  product_type VARCHAR(24) NOT NULL DEFAULT 'other',
  price INT UNSIGNED NOT NULL,
  image_url VARCHAR(1000) NULL,
  product_url VARCHAR(1000) NULL,
  manufacturer_url VARCHAR(1000) NULL,
  specs JSON NULL,
  is_demo_price BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT NOT NULL,
  stock INT UNSIGNED NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_products_category_price (category, price),
  INDEX idx_products_name (name)
);

CREATE TABLE cart_items (
  user_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id),
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE favorites (
  user_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id),
  CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_favorites_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_code VARCHAR(40) NOT NULL UNIQUE,
  user_id BIGINT UNSIGNED NOT NULL,
  total_price INT UNSIGNED NOT NULL,
  shipping_address VARCHAR(255) NOT NULL,
  payment_method VARCHAR(40) NOT NULL,
  status ENUM('pending', 'paid', 'shipped', 'delivered', 'canceled') NOT NULL DEFAULT 'pending',
  ordered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  unit_price INT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  INDEX idx_order_items_order (order_id)
);
