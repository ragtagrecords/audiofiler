-- CreateTable
CREATE TABLE `playlists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `createTimestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `songPlaylists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `songID` INTEGER NOT NULL,
    `playlistID` INTEGER NOT NULL,
    `position` INTEGER NULL,

    INDEX `fkDeleteBasedOnPlaylistID`(`playlistID`),
    UNIQUE INDEX `song_in_playlist_unique`(`songID`, `playlistID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `songs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `tempo` INTEGER NULL,
    `artist` VARCHAR(255) NULL,
    `createTimestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isParent` TINYINT NOT NULL DEFAULT 0,
    `parentID` INTEGER NULL,
    `zipPath` VARCHAR(255) NULL,
    `notes` VARCHAR(255) NULL,

    UNIQUE INDEX `path`(`path`),
    UNIQUE INDEX `zipPath`(`zipPath`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stage` INTEGER NOT NULL DEFAULT 0,
    `songID` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `description` VARCHAR(1000) NOT NULL,
    `parentID` INTEGER NULL,
    `createTimestamp` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `position` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `hashedPassword` VARCHAR(255) NOT NULL,
    `createTimestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `salt` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `songPlaylists` ADD CONSTRAINT `fkDeleteBasedOnPlaylistID` FOREIGN KEY (`playlistID`) REFERENCES `playlists`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `songPlaylists` ADD CONSTRAINT `fkDeleteBasedOnSongID` FOREIGN KEY (`songID`) REFERENCES `songs`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
