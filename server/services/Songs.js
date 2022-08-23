const { sqlInsert, sqlSelect, sqlUpdate, sqlDelete } = require('../services/Db.js');

// Column definitions for songs table
const defColumns = [
    'songs.path',
    'songs.name',
    'songs.tempo',
    'songs.artist',
    'songs.isParent',
    'songs.parentID',
    'songs.zipPath',
    'songs.notes',
];

const allColumns = [
    ...defColumns,
    'songs.id', 
    'songs.createTimestamp'
];

// TODO: bubble up errors based on the specific message
// sqlFunctions should return an object with message and success status

// Add a row to the songs table
async function addSong(db, song) {
    const { path, name, tempo, artist, isParent, parentID, zipPath, notes } = song;

    if (!path || !name) {
        console.log('ERROR: Song must have path and name');
        return false;
    }

    return sqlInsert(
        db,
        'songs',
        defColumns,
        [
            path,
            name,
            tempo ? tempo : null,
            artist ? artist : null,
            isParent ? isParent : null,
            parentID ? parentID: null,
            zipPath ? zipPath : null,
            notes ? notes : null,
        ]
    );
}

async function getSongByID(db, id) {
    if (!db || !id) {
        console.log('ERROR: ID required');
        return false;
    }

    return sqlSelect(
        db,
        'songs',
        allColumns,
        'WHERE id = ?',
        [id],
    );
}

async function getSongsByPlaylistID(db, id) {
    if (!db || !id) {
        console.log('ERROR: Playlist ID required');
        return false;
    }

    return sqlSelect(
        db,
        'songs',
        [...allColumns, 'songPlaylists.position'],
        'INNER JOIN songPlaylists ON songs.id = songPlaylists.songID WHERE songPlaylists.playlistID = ? ORDER BY songPlaylists.position',
        [id],
    );
}

async function getSongsByParentID(db, id) {
    if (!db || !id) {
        console.log('ERROR: Parent ID required');
        return false;
    }

    return sqlSelect(
        db,
        'songs',
        allColumns,
        'WHERE songs.parentID = ?',
        [id],
    );
}

async function getSongs(db) {
    if (!db) {
        return false;
    }

    return sqlSelect(
        db,
        'songs',
        allColumns,
        null,
        null,
    );
}

async function deleteSongByID(db, id) {
    if (!db || !id) {
        console.log('ERROR: ID required');
        return false;
    }

    return sqlDelete(
        db,
        'songs',
        'WHERE id = ?',
        [id]
    );
}

async function updateSong(db, id, song) {

    if (!db || !song || !id) {
        console.log('ERROR: Song and ID required to update song');
        return false;
    }

    // ID and createTimestamp should not be updated
    if (song.id) { delete song.id }
    if (song.createTimestamp) { delete song.createTimestamp }

    return sqlUpdate(
        db,
        'songs',
        'WHERE id = ?',
        song,
        [id]
    );
}

module.exports = { 
    addSong, 
    getSongByID,
    getSongsByPlaylistID, 
    getSongsByParentID,
    getSongs, 
    updateSong,
    deleteSongByID
};
