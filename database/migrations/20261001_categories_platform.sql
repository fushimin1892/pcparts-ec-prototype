-- Existing MySQL databases only: run once before deploying this version.
-- Fresh installations already receive the column through database/schema.sql.
USE pc_parts_shop;

ALTER TABLE products
  ADD COLUMN platform VARCHAR(16) NOT NULL DEFAULT '' AFTER category,
  ADD INDEX idx_products_platform_category (platform, category);

UPDATE products
SET platform = CASE
  WHEN category = 'CPU' AND (maker = 'Intel' OR name LIKE 'Intel %') THEN 'Intel'
  WHEN category = 'CPU' AND (maker = 'AMD' OR name LIKE 'AMD %') THEN 'AMD'
  WHEN category = 'マザーボード' AND (
    JSON_UNQUOTE(JSON_EXTRACT(specs, '$.チップセット')) LIKE 'Intel%'
    OR JSON_UNQUOTE(JSON_EXTRACT(specs, '$.ソケット')) LIKE 'LGA%'
  ) THEN 'Intel'
  WHEN category = 'マザーボード' AND (
    JSON_UNQUOTE(JSON_EXTRACT(specs, '$.チップセット')) LIKE 'AMD%'
    OR JSON_UNQUOTE(JSON_EXTRACT(specs, '$.ソケット')) LIKE 'AM%'
  ) THEN 'AMD'
  ELSE ''
END
WHERE category IN ('CPU', 'マザーボード');

UPDATE products
SET category = CASE category
  WHEN 'グラフィックボード' THEN 'GPU'
  WHEN 'ストレージ' THEN 'SSD'
  WHEN '冷却パーツ' THEN 'CPUクーラー'
  WHEN '電源' THEN 'PC電源'
  WHEN 'モニター' THEN 'その他'
  ELSE category
END;
