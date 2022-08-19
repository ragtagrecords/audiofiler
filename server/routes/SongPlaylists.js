const DbSvc = require('../services/Db.js');
const { addSongToPlaylist, updateSongPlaylist, deleteSongFromPlaylist } = require('../services/SongPlaylists.js');

// Add a row to the songPlaylists table
exports.addSongToPlaylist = (async function (req, res) {
    const playlistID = req.params.playlistID;
    const songID = req.params.songID;
  
    if (!playlistID || !songID) {
        res.status(404).send({ message: `Couldn't add song to playlist`});
        return null;
    }
  
    const db = await DbSvc.connectToDB();
    newSongPlaylistID = await addSongToPlaylist(db, songID, playlistID);
    db.end();
  
    if(newSongPlaylistID) {
        res.status(200).send({ id: newSongPlaylistID });
        return true;
    } else {
        res.status(404).send({ message: `Couldn't add song(${songID}) to playlist(id=${playlistID})`});
        return null;
    }
})
  
  // Delete a row from the songPlaylists table
exports.deleteSongFromPlaylist = (async function (req ,res) {
    const playlistID = req.params.playlistID;
    const songID = req.params.songID;
  
    if (!playlistID || !songID) {
        res.status(404).send({ message: `ID's required, structure request like so: /public/playlist/<playlistID>/song/<songID>`});
        return;
    }
  
    const db = await DbSvc.connectToDB();
    const songDeleted = await deleteSongFromPlaylist(db, songID, playlistID);
    db.end();
  
    if(songDeleted) {
        res.status(200).send({ message: `Song(${songID}) was deleted from playlist(${playlistID})` });
        return;
    } else {
        res.status(404).send({ message: `Failed to delete song(${songID}) from playlist(${playlistID})`});
        return;
    }
})
  
exports.updateSongPlaylist = (async function (req, res) {
    const db = await DbSvc.connectToDB();
    const playlistID = req.params.playlistID;
    const songID = req.params.songID;
    let songPlaylist = null;

    // Requests from React App need to be parsed from JSON
    try {
        songPlaylist = await JSON.parse(req.body.songPlaylist);
    } catch(ex) { // Requests from Python do not
        songPlaylist = req.body.songPlaylist;
    }

    if (!songPlaylist || !songID || !playlistID) {
        res.status(404).send({message: 'No songPlaylist object found in request body'});
        return false;
    }

    const updatedSongPlaylist = await updateSongPlaylist(
        db,
        playlistID,
        songID,
        songPlaylist,
        true
    );
    db.end();

    if(updatedSongPlaylist) {
        res.status(200).send(updatedSongPlaylist);
        return true;
    } else {
        const message = `ERROR: Couldn't update song (id=${songID}) in playlist(id=${playlistID})`;
        res.status(404).send({message});
        return false;   
    }
})
