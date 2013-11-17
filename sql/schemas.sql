CREATE TABLE IF NOT EXISTS `status` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `text` TEXT,
  `replyTo` TEXT,
  KEY `createdAt` (`createdAt`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `twitter` (
  `twitterId` BIGINT PRIMARY KEY,
  `statusId` BIGINT NOT NULL,
  KEY `statusId` (`statusId`)
) ENGINE=InnoDB;
