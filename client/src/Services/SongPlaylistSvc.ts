import axios from 'axios';
import { SongPlaylist } from 'Types';
import { apiBaseURL } from 'env';

export const updateSongPlaylist = async (songPlaylist: SongPlaylist) => {
  const formData = new FormData();

  formData.append('songPlaylist', JSON.stringify(songPlaylist));
  try {
    const res = await axios.put(`${apiBaseURL()}/playlists/${songPlaylist.playlistID}/song/${songPlaylist.songID}`, formData);
    return res;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};
