CREATE TABLE IF NOT EXISTS `status` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `text` TEXT,
  `replyTo` TEXT,
  `reblog` TEXT,
  `twitterId` BIGINT UNIQUE,
  `facebookId` BIGINT UNIQUE,
  KEY `createdAt` (`createdAt`)
) ENGINE=InnoDB;
