const express = require('express');
const router = express.Router();

// Import services
const AuthSvc = require('./services/Auth.js');

// Import route functions
const Songs = require('./routes/Songs.js');
const Playlists = require('./routes/Playlists.js');
const SongPlaylists = require('./routes/SongPlaylists.js');
const Users = require('./routes/Users.js');
const Auth = require('./routes/Auth.js');
const Tasks = require('./routes/Tasks.js');

// Root
router.get('/', (req, res) => {
  res.status(200).send('Welcome to the Audiofiler API');
});

// Songs
router.post('/songs', Songs.addSong);
router.get('/songs', Songs.getSongs);
router.get('/songs/:id', Songs.getSongByID);
router.get('/songs/playlist/:playlistID', Songs.getSongsByPlaylistID);
router.get('/songs/parent/:parentID', Songs.getSongsByParentID);
router.put('/songs/:id', Songs.updateSong);
router.delete('/songs/:id', Songs.deleteSongByID);

// Playlists
router.post('/playlists', Playlists.addPlaylist);
router.get('/playlists', Playlists.getPlaylists);
router.get('/playlists/:playlistID', Playlists.getPlaylist);
router.get('/playlists/song/:songID', Playlists.getPlaylistsBySongID);
router.put('/playlists/:id', Playlists.updatePlaylist);

// SongPlaylists
router.post('/playlists/:playlistID/song/:songID', SongPlaylists.addSongToPlaylist);
router.put('/playlists/:playlistID/song/:songID', SongPlaylists.updateSongPlaylist);
router.delete('/playlists/:playlistID/song/:songID', SongPlaylists.deleteSongFromPlaylist);

// Users
router.get('/users', Users.getUsers);
router.get('/users/:username', Users.getUserByUsername);
router.post('/users', Users.createUser);

// Auth
router.post('/authorize', Auth.authorize);
router.get('/authenticate', AuthSvc.verifyJWT, Auth.authenticate);

// Tasks
router.post('/tasks', Tasks.addTask);
router.get('/tasks', Tasks.getAllTasks);
router.get('/tasks/:id', Tasks.getTaskByID);
router.get('/tasks/song/:songID', Tasks.getTasksBySongID);
router.put('/tasks/:id', Tasks.updateTask);
router.delete('/tasks/:id', Tasks.deleteTask);

// necessary with express.Router()
module.exports = router;
