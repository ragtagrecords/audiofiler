const DbSvc = require('../services/Db.js');
const PlaylistSvc = require('../services/Playlists.js');

// Get a a single row from the playlist table by ID
exports.getPlaylist = (async function (req, res) {
  const playlistID = req.params.playlistID;

  const db = await DbSvc.connectToDB();    
  const playlist = await PlaylistSvc.getPlaylistByID(db, req.params.playlistID);
  db.end();

  if (!playlist) {
      res.status(404).send({message: "Failed to get playlist" });
      return null;
  }

  res.status(200).send(playlist);
  return true;
})

// Get all the rows from the playlists table
exports.getPlaylists = (async function (req, res) {
  const db = await DbSvc.connectToDB();
  const playlists = await PlaylistSvc.getPlaylists(db);
  db.end();
  if(playlists) {
      res.status(200).send(playlists);
      return true;
  } else {
      res.status(404).send({ message: "Couldn't get songs"});
      return null;
  }
})

// Get all the rows from the playlists table for a given song
exports.getPlaylistsBySongID = (async function (req, res) {
  const songID = req.params.songID;

  if (!songID) {
      res.status(404).send({message: `songID is required, structure request like so: /public/playlist/song/<songID>` });
      return null;
  }

  const db = await DbSvc.connectToDB();
  const playlists = await PlaylistSvc.getPlaylistsBySongID(db, songID);
  db.end();

  if(playlists) {
      res.status(200).send(playlists);
      return true;
  } else {
      res.status(404).send({ message: "Couldn't get playlists"});
      return null;
  }
})

// Add a row to the playlists table
exports.addPlaylist = (async function (req, res) {
  const db = await DbSvc.connectToDB();    
  const newPlaylistID = await PlaylistSvc.addPlaylist(db, req.body.name);
  db.end();

  if (!newPlaylistID) {
      res.status(404).send({'message': "Failed to create playlist" });
      return null;
  }

  res.status(200).send({id: newPlaylistID});
  return true;
})

exports.updatePlaylist = (async function (req, res) {
    const db = await DbSvc.connectToDB();
    const id = req.params.id;
    let playlist = null;

    // Requests from React App need to be parsed from JSON
    try {
        playlist = await JSON.parse(req.body.playlist);
    } catch(ex) { // Requests from Python do not
        playlist = req.body.playlist;
    }

    if (!playlist || !id) {
        res.status(404).send({message: 'No playlist object found in request body'});
        return false;
    }

    const updatedPlaylist = await PlaylistSvc.updatePlaylist(db, id, playlist);
    db.end();

    if(updatedPlaylist) {
        res.status(200).send(updatedPlaylist);
        return true;
    } else {
        res.status(404).send({ message: `ERROR: Couldn't update playlist (id=${id})`});
        return false;   
    }
})