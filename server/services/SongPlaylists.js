const { sqlInsert, sqlSelect, sqlUpdate, sqlDelete, sqlMax } = require('../services/Db.js');
const { getSongs, getSongsByPlaylistID } = require('../services/Songs.js');

const defSongPlaylistsColumns = [
    'songPlaylists.songID',
    'songPlaylists.playlistID',
    'songPlaylists.position'
];

const allColumns = [...defSongPlaylistsColumns, 'songPlaylists.id'];

async function addSongToPlaylist(db, songID, playlistID)
{
    if(!db || !songID || !playlistID) {
        console.log('ERROR: songID and playlistID required');
        return false;
    }

    const position = await sqlMax(
        db, 'songPlaylists',
        'position',
        'WHERE playlistID = ?',
        [playlistID],
        playlistID
    );

    return sqlInsert(
        db,
        'songPlaylists',
        defSongPlaylistsColumns,
        [
            songID,
            playlistID,
            position + 1 ?? 0
        ]
    );
}

async function getSongPlaylists(db, playlistID = null, songID = null) {
    if (!db) {
        console.log('ERROR: DB required');
        return false;
    }
    let whereClause = null;
    let whereVals = null;

    if (playlistID && songID) {
        whereClause = 'WHERE playlistID = ? AND songID = ?';
        whereVals = [playlistID, songID];
    } else if (playlistID) {
        whereClause = 'WHERE playlistID = ?';
        whereVals = [playlistID];
    } else if (songID) {
        whereClause = 'WHERE songID = ?';
        whereVals = [songID];
    }

    return sqlSelect(
        db,
        'songPlaylists',
        allColumns,
        whereClause,
        whereVals,
    );
}

async function updateSongPlaylist(db, playlistID, songID, songPlaylist, reorder = false)
{
    if (!db || !songPlaylist || !playlistID || !songID) {
        console.log("ERROR: songPlaylist and ID's required to update songPlaylist");
        return false;
    }
    
    // Remove these fields before hitting DB, they cannot be updated
    if (songPlaylist.id) { delete songPlaylist.id }
    if (songPlaylist.playlistID) { delete songPlaylist.playlistID }
    if (songPlaylist.songID) { delete songPlaylist.songID }
    
    const updatedSongPlaylist = await sqlUpdate(
        db,
        'songPlaylists',
        'WHERE playlistID = ? AND songID = ?',
        songPlaylist,
        [playlistID, songID]
    );

    if (!updatedSongPlaylist) {
        console.log("ERROR: Failed to update songPlaylist");
        return false;
    }

    return updatedSongPlaylist;
}

async function deleteSongFromPlaylist(db, songID, playlistID)
{
    if (!db || !songID || !playlistID) {
        console.log(`ERROR: ID's required for song and playlist`);
        return false;
    }

    return sqlDelete(
        db,
        'songPlaylists',
        'WHERE songID = ? AND playlistID = ?',
        [songID, playlistID]
    );
}
    
module.exports = {
    addSongToPlaylist,
    getSongPlaylists,
    updateSongPlaylist,
    deleteSongFromPlaylist,
}
