-- Existing installations only. Fresh installations include these tables in schema.sql.
-- Select the database created by your hosting provider before running this file.
CREATE TABLE IF NOT EXISTS demo_orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_code VARCHAR(40) NOT NULL UNIQUE,
  session_key CHAR(64) NOT NULL,
  payment_method VARCHAR(20) NOT NULL,
  payment_store VARCHAR(40) NOT NULL DEFAULT '',
  payment_code VARCHAR(6) NOT NULL DEFAULT '',
  payment_deadline DATE NULL,
  subtotal INT UNSIGNED NOT NULL,
  shipping_price INT UNSIGNED NOT NULL,
  total_price INT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL,
  INDEX idx_demo_orders_session_created (session_key, created_at)
);

CREATE TABLE IF NOT EXISTS demo_order_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  catalog_key VARCHAR(100) NOT NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  unit_price INT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  CONSTRAINT fk_demo_order_items_order FOREIGN KEY (order_id) REFERENCES demo_orders(id) ON DELETE CASCADE,
  INDEX idx_demo_order_items_order (order_id)
);
