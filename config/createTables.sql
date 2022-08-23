CREATE TABLE `songs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `tempo` int(11) DEFAULT NULL,
  `artist` varchar(255) DEFAULT NULL,
  `createTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isParent` tinyint(4) DEFAULT '0',
  `parentID` int(11) DEFAULT NULL,
  `zipPath` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `path` (`path`),
  UNIQUE KEY `zipPath` (`zipPath`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

CREATE TABLE `playlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

CREATE TABLE `songPlaylists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `songID` int(11) NOT NULL,
  `playlistID` int(11) NOT NULL,
  `position` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `song_in_playlist_unique` (`songID`,`playlistID`),
  KEY `fkDeleteBasedOnPlaylistID` (`playlistID`),
  CONSTRAINT `fkDeleteBasedOnPlaylistID` FOREIGN KEY (`playlistID`) REFERENCES `playlists` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fkDeleteBasedOnSongID` FOREIGN KEY (`songID`) REFERENCES `songs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `hashedPassword` varchar(255) NOT NULL,
  `createTimestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `salt` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stage` int(11) NOT NULL DEFAULT '0',
  `songID` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(1000) NOT NULL,
  `parentID` int(11) DEFAULT NULL,
  `createTimestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `position` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;
