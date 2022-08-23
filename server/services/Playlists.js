const mysql = require('mysql2');
const Logger = require('../utils/Logger.js');
const { sqlInsert, sqlSelect, sqlDelete, sqlUpdate } = require('../services/Db.js');

// Playlists
const defPlaylistsColumns = ['playlists.name'];
const allPlaylistsColumns = [...defPlaylistsColumns, 'playlists.id'];

async function getPlaylists(db) {
    if (!db) {
        return false;
    }

    return sqlSelect(
        db,
        'playlists',
        allPlaylistsColumns,
        null,
        null,
    );
}

async function getPlaylistByID(db, id) {
    if (!db || !id) {
        console.log('ERROR: Playlist ID required');
        return false;
    }

    return sqlSelect(
        db,
        'playlists',
        allPlaylistsColumns,
        'WHERE id = ?',
        [id],
    );
}

async function getPlaylistsBySongID(db, songID) {
    if (!db || !songID) {
        console.log('ERROR: Song ID required');
        return false;
    }

    return sqlSelect(
        db,
        'playlists',
        allPlaylistsColumns,
        'INNER JOIN songPlaylists ON playlists.id = songPlaylists.playlistID WHERE songPlaylists.songID = ?',
        [songID],
    );
}

async function addPlaylist(db, name) {

    if(!db || !name) {
        console.log('ERROR: Playlist name required');
        return false;
    }

    return sqlInsert(
        db,
        'playlists',
        defPlaylistsColumns,
        [name]
    );
}

async function updatePlaylist(db, id, playlist) {

    if (!db || !playlist || !id) {
        console.log('ERROR: Playlist and ID required to update playlist');
        return false;
    }

    // ID and createTimestamp should not be updated
    if (playlist.id) { delete playlist.id }
    if (playlist.createTimestamp) { delete playlist.createTimestamp }

    return sqlUpdate(
        db,
        'playlists',
        'WHERE id = ?',
        playlist,
        [id]
    );
}

module.exports = { 
    getPlaylists,
    getPlaylistByID,
    getPlaylistsBySongID, 
    addPlaylist,
    updatePlaylist
};