// This class can be used to fetch data and store it in the redux state
// It's main purpose is to separate the data fetching logic from the component
import { AUDIO_PLAYER_ACTIONS, AUDIO_PLAYER_SELECTORS } from 'Components/AudioPlayer/audioPlayerSlice';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { AppDispatch } from 'Hooks/store';
import { getPlaylistByID, getSongs } from 'Services';
import { Song } from 'Types';
import { PLAYLIST_ACTIONS } from './playlistSlice';

export class PlaylistLoader {
  private dispatch: AppDispatch;

  private playlistID: string;

  private audioPlayerSongQueue: Song[] | null;

  constructor(playlistID: string) {
    this.dispatch = useAppDispatch();
    this.playlistID = playlistID;
    this.audioPlayerSongQueue = useAppSelector(AUDIO_PLAYER_SELECTORS.songQueue);
  }

  // Setters
  public setPlaylistID(id: string) {
    this.playlistID = id;
  }

  // Fetch playlist and store in redux state
  public async loadPlaylist() {
    this.dispatch(PLAYLIST_ACTIONS.setIsPlaylistLoading(true));

    const playlist = await getPlaylistByID(this.playlistID);

    if (!playlist || !playlist.name) {
      this.dispatch(PLAYLIST_ACTIONS.setPlaylistError('Failed to fetch playlist'));
      return false;
    }

    this.dispatch(PLAYLIST_ACTIONS.setPlaylist(playlist));
    return true;
  }

  // Fetch songs and store in redux state
  // Sets current song if there is no song currently playing
  public async loadSongs() {
    this.dispatch(PLAYLIST_ACTIONS.setIsSongsLoading(true));
    const songs = await getSongs(parseInt(this.playlistID, 10));

    if (!songs) {
      this.dispatch(PLAYLIST_ACTIONS.setPlaylistError('Failed to fetch songs'));
      return false;
    }

    this.dispatch(PLAYLIST_ACTIONS.setSongs(songs));

    if (!this.audioPlayerSongQueue && songs[0] && songs[0].id) {
      this.dispatch(AUDIO_PLAYER_ACTIONS.setCurrentSongID({
        songID: songs[0].id,
        playlistSongs: songs,
      }));
    }

    return true;
  }
}
