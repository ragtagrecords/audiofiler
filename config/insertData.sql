-- add some songs
INSERT INTO songs (path, name, tempo) VALUES ('https://files.ragtagrecords.com/songs/131 crack.mp3', 'crack', 131);
INSERT INTO songs (path, name, tempo) VALUES ('https://files.ragtagrecords.com/songs/132bpm groovin.mp3', 'groovin', 132);
INSERT INTO songs (path, name, tempo) VALUES ('https://files.ragtagrecords.com/songs/138 tight.mp3', 'tight', 138);
INSERT INTO songs (path, name, tempo) VALUES ('https://files.ragtagrecords.com/songs/130 stuck in the ice.mp3', 'stuck in the ice', 130);
INSERT INTO songs (path, name, tempo) VALUES ('https://files.ragtagrecords.com/songs/129 woozy.mp3', 'really long track name example', 129);

-- add some playlists
INSERT INTO playlists (name) VALUES ('Beats');
INSERT INTO playlists (name) VALUES ('Other beats');
INSERT INTO playlists (name) VALUES ('Some other beats');

-- add songs to playlist 1
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (1, 1, 0);

-- add songs to playlist 2
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (2, 2, 0);
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (1, 2, 1);
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (3, 2, 2);

-- add songs to playlist 3
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (4, 3, 0);
INSERT INTO songPlaylists (songID, playlistID, position) VALUES (5, 3, 1);

-- TODO: add users, tasks, and more fields to songs