CREATE TABLE IF NOT EXISTS `status` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `text` TEXT,
  `replyTo` TEXT,
  `reblog` TEXT,
  `twitterId` VARCHAR(80) UNIQUE,
  `facebookId` VARCHAR(80) UNIQUE,
  KEY `createdAt` (`createdAt`)
) ENGINE=InnoDB;
