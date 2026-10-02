-- Apply once to an existing installation, after selecting its MySQL database.
-- External offers stay separate from products and cannot be purchased here.
CREATE TABLE IF NOT EXISTS reference_offers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  offer_key CHAR(68) NOT NULL UNIQUE,
  source_key VARCHAR(64) NOT NULL,
  external_id VARCHAR(255) COLLATE utf8mb4_bin NOT NULL,
  source_name VARCHAR(150) NOT NULL,
  seller_name VARCHAR(150) NOT NULL DEFAULT '',
  permission_reference VARCHAR(500) NOT NULL,
  name VARCHAR(255) NOT NULL,
  maker VARCHAR(100) NOT NULL DEFAULT '',
  category VARCHAR(80) NOT NULL,
  platform VARCHAR(16) NOT NULL DEFAULT '',
  price_yen INT UNSIGNED NOT NULL,
  image_url VARCHAR(1000) NOT NULL,
  product_url VARCHAR(1000) NOT NULL,
  description TEXT NOT NULL,
  retrieved_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_reference_source_external (source_key, external_id),
  INDEX idx_reference_category_recent (category, retrieved_at),
  INDEX idx_reference_expires (expires_at),
  INDEX idx_reference_name (name)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
