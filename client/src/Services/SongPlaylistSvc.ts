import axios from 'axios';
import { SongPlaylist } from 'Types';
import { databaseServerURL } from 'env';

export const updateSongPlaylist = async (songPlaylist: SongPlaylist) => {
  const formData = new FormData();

  formData.append('songPlaylist', JSON.stringify(songPlaylist));
  try {
    const res = await axios.put(`${databaseServerURL()}/playlists/${songPlaylist.playlistID}/song/${songPlaylist.songID}`, formData);
    return res;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};
