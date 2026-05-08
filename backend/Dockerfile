FROM php:8.3-cli-alpine

WORKDIR /var/www/html

RUN apk add --no-cache \
    bash \
    git \
    icu-dev \
    libpq-dev \
    oniguruma-dev \
    unzip \
    zip \
  && docker-php-ext-install intl mbstring opcache pdo pdo_pgsql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

EXPOSE 8000
