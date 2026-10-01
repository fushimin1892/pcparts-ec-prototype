FROM php:8.3-apache

RUN apt-get update && apt-get install -y --no-install-recommends libonig-dev \
    && docker-php-ext-install pdo_mysql curl mbstring \
    && rm -rf /var/lib/apt/lists/* \
    && a2enmod headers

WORKDIR /var/www/html
COPY index.html styles.css app.js /var/www/html/
COPY backend/public/config.js /var/www/html/config.js
COPY backend/public/api /var/www/html/api
COPY backend/src /var/www/src
COPY backend/scripts/seed_catalog.php /var/www/scripts/seed_catalog.php
COPY database/seed_products.json /var/www/database/seed_products.json

CMD ["/bin/sh", "-c", "php /var/www/scripts/seed_catalog.php && apache2-foreground"]
