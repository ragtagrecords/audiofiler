import axios from 'axios';
import { databaseServerURL } from 'env';
import { Playlist } from 'Types';

// TODO: Add error handling to all these funcs
export const getPlaylists = async () => {
  try {
    const res = await axios.get(`${databaseServerURL()}/playlists`);
    return res.data as Playlist[];
  } catch (ex) {
    console.log(ex);
    return null;
  }
};

export const getPlaylistByID = async (id: string | number): Promise<Playlist | null> => {
  try {
    const res = await axios.get(`${databaseServerURL()}/playlists/${id}`);
    if (!res.data) {
      return null;
    }
    return res.data;
  } catch (ex) {
    return null;
  }
};

export const addSongToPlaylist = async (songID: number, playlistID: number) => {
  try {
    await axios.post(`${databaseServerURL()}/playlists/${playlistID}/song/${songID}`);
    return true;
  } catch (ex) {
    return false;
  }
};

export const updatePlaylist = async (playlist: Playlist) => {
  const formData = new FormData();

  formData.append('playlist', JSON.stringify({ id: playlist.id, name: playlist.name }));
  try {
    const res = await axios.put(`${databaseServerURL()}/playlists/${playlist.id}`, formData);
    return res;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

export const removeSongFromPlaylist = async (songID: number, playlistID: number) => {
  try {
    await axios.delete(`${databaseServerURL()}/playlists/${playlistID}/song/${songID}`);
    return true;
  } catch (ex) {
    return false;
  }
};

export const changePlaylistName = async (playlist: Playlist) => {
  if (!playlist || !playlist.name) { console.log("ERROR: Couldn't update playlist name"); return false; }
  const emptyString = playlist.name === '';
  const startsWithSpace = playlist.name.length > 0 && playlist.name[0] === ' ';
  const endsWithSpace = playlist.name.length > 0 && playlist.name.slice(-1) === ' ';

  if (emptyString) {
    alert('Playlist name can not be empty.');
  } else if (startsWithSpace || endsWithSpace) {
    alert('Playlist name can not start or end with spaces.');
  } else if (playlist) {
    alert('Name updated successfully.');
    return !!updatePlaylist(playlist);
  }
  return false;
};
