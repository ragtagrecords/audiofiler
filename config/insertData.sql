-- TODO: add users, tasks, and more fields to songs

-- add some songs
INSERT INTO songs (name, path, tempo) VALUES ('crack', '131 crack.mp3', 131); -- 1
INSERT INTO songs (name, path, tempo) VALUES ('groovin', '132bpm groovin.mp3', 132); -- 2
INSERT INTO songs (name, path, tempo) VALUES ('tight', '138 tight.mp3', 138); -- 3
INSERT INTO songs (name, path, tempo) VALUES ('stuck in the ice', '130 stuck in the ice.mp3', 130); -- 4
INSERT INTO songs (name, path, tempo) VALUES ('really long track name example', '129 woozy.mp3', 129); -- 5
INSERT INTO songs (name, path, zipPath) VALUES ('looper1', '001_1.wav', '001.zip'); -- 6
INSERT INTO songs (name, path, zipPath) VALUES ('looper2', '002_1.wav', '002.zip'); -- 7
INSERT INTO songs (name, path, zipPath) VALUES ('looper3', '003_1.wav', '003.zip'); -- 8
INSERT INTO songs (name, path, isParent) VALUES ('parent1', 'parent1.mp3', 1); -- 9
INSERT INTO songs (name, path, parentID) VALUES ('child1', 'child1.mp3', 9); -- 10
INSERT INTO songs (name, path, parentID) VALUES ('child2', 'child2.mp3', 9); -- 11

-- add some playlists
INSERT INTO playlists (name) VALUES ('Beats'); -- 1
INSERT INTO playlists (name) VALUES ('Other beats'); -- 2
INSERT INTO playlists (name) VALUES ('Some other beats'); -- 3
INSERT INTO playlists (name) VALUES ('Songs w/ zips'); -- 4
INSERT INTO playlists (name) VALUES ('Songs w/ versions'); -- 5

-- add songs to playlist 1
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (1, 1, 0);

-- add songs to playlist 2
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (2, 2, 0);
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (1, 2, 1);
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (3, 2, 2);

-- add songs to playlist 3
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (4, 3, 0);
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (5, 3, 1);

-- add songs to playlist 4
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (6, 4, 0);
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (7, 4, 1);
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (8, 4, 2);

-- add songs to playlist 4
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (9, 5, 0);
