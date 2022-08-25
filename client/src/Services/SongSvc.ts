import axios from 'axios';
import { databaseServerURL } from 'env';
import { uploadFile } from 'Services';
import { Song } from 'Types';

// Returns null if there are no results or an error
export const getSongs = async (
  playlistID: string | null = null,
  parentID: string | null = null,
): Promise<Song[]> => {
  // By default, gets all the songs
  let endpoint = '/songs';

  // Get songs from a specific playlist
  if (playlistID) {
    endpoint = `/songs/playlist/${playlistID}`;
  }

  // Get different versions of a song
  if (parentID) {
    endpoint = `/songs/parent/${parentID}`;
  }

  try {
    const res = await axios.get(
      `${databaseServerURL()}${endpoint}`,
    );
    return res.data.length ? res.data : [];
  } catch (e) {
    return [];
  }
};

export const updateSongName = async (songID: number, newName: string) => {
  try {
    const res = await axios.put(`${databaseServerURL()}/songs/${songID}/${newName}`);
    return res;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

export const updateSong = async (song: Song) => {
  if (!song.id) {
    console.log('Song ID is required');
    return false;
  }

  const url = `${databaseServerURL()}/songs/${song.id}`;
  delete song.id;

  if (Object.keys.length === 0) {
    console.log('No fields to update');
    return false;
  }

  const payload = new FormData();
  payload.append('song', JSON.stringify(song));

  try {
    await axios.put(url, payload);
    return true;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

const addSongToDB = async (song: Song) => {
  if (!song.name || !song.path) {
    console.log('ERROR: DbSvc::addSongToDB()');
    return false;
  }

  const payload = new FormData();
  payload.append('song', JSON.stringify(song));

  // post song info to API
  try {
    await axios.post(
      `${databaseServerURL()}/songs`,
      payload,
    );
    return true;
  } catch (err) {
    return false;
  }
};

export const deleteSongFromDB = async (id: Song['id']) => {
  if (!id) {
    console.log('ERROR: Need ID to delete song');
    return false;
  }

  try {
    const songDeleted = await axios.delete(`${databaseServerURL()}/songs/${id}`);
    if (!songDeleted) {
      console.log('ERROR: Failed to delete song from DB');
      return false;
    }

    return true;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

// Add a song to the DB and file server
export const addSong = async (song: Song) => {
  if (!song || !song.file) {
    return false;
  }

  // Store paths and remove files before turning into JSON
  const { file, zipFile } = song;
  song.path = file.name;
  delete song.file;

  if (song.zipFile) {
    song.zipPath = song.zipFile.name;
    delete song.zipFile;
  }

  // Add song to database
  const songInfoAddedToDB = await addSongToDB(song);
  if (!songInfoAddedToDB) {
    console.log('Failed to add song info to DB');
    return false;
  }

  // Upload mp3/wav file to file server
  const songFileUploaded = await uploadFile(file, '/songs');
  if (!songFileUploaded) {
    // TODO: to make this transactional, remove from DB when upload fails
    console.log('Failed to upload song');
    return false;
  }

  // Upload zip file to file server
  if (zipFile) {
    let zipFileUploaded = null;
    zipFileUploaded = uploadFile(zipFile, '/zips');

    // TODO: to make this transactional, remove from DB when upload fails
    if (!zipFileUploaded) {
      console.log('Failed to upload zip');
      return false;
    }
  }

  return true;
};
