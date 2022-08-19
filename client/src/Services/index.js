import { guessTempo } from './AudioSvc';

import {
  authenticate,
  authorize,
  signup,
  logout,
} from './AuthSvc';

import {
  downloadFile,
  uploadFile,
  getExtension,
  removeExtraExtensions,
} from './FileSvc';

import {
  getPlaylists,
  getPlaylistByID,
  addSongToPlaylist,
  updatePlaylist,
} from './PlaylistSvc';

import { updateSongPlaylist } from './SongPlaylistSvc';

import {
  getSongs,
  updateSongName,
  updateSong,
  deleteSongFromDB,
  addSong,

} from './SongSvc';

import {
  getTasks,
  updateTask,
  updateTasks,
} from './TaskSvc';

export {
  guessTempo,
  authenticate,
  authorize,
  logout,
  signup,
  downloadFile,
  uploadFile,
  getExtension,
  removeExtraExtensions,
  getPlaylists,
  getPlaylistByID,
  addSongToPlaylist,
  updatePlaylist,
  updateSongPlaylist,
  getSongs,
  updateSongName,
  updateSong,
  deleteSongFromDB,
  addSong,
  getTasks,
  updateTask,
  updateTasks,
};
