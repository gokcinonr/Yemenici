-- Yemenici — MySQL initial schema
-- Generated for Hostinger MySQL 8.0+
-- Run once on a fresh database: mysql -u USER -p DATABASE < 0000_initial.sql

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`            INT            NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(255)   NOT NULL,
  `password_hash` TEXT           NOT NULL,
  `created_at`    DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_users_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_content` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `section`    VARCHAR(255) NOT NULL,
  `key`        VARCHAR(255) NOT NULL,
  `value`      TEXT         NOT NULL,
  `label`      TEXT         NOT NULL,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_images` (
  `id`         INT          NOT NULL AUTO_INCREMENT,
  `key`        VARCHAR(255) NOT NULL,
  `url`        TEXT         NOT NULL,
  `label`      TEXT         NOT NULL,
  `updated_at` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_images_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contact_submissions` (
  `id`           INT          NOT NULL AUTO_INCREMENT,
  `first_name`   VARCHAR(255) NOT NULL,
  `last_name`    VARCHAR(255) NOT NULL,
  `email`        VARCHAR(255) NOT NULL,
  `phone`        VARCHAR(50)           DEFAULT NULL,
  `position`     VARCHAR(255)          DEFAULT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `message`      TEXT         NOT NULL,
  `lang`         VARCHAR(10)  NOT NULL DEFAULT 'en',
  `consent_given` TINYINT(1)  NOT NULL DEFAULT 1,
  `created_at`   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
