// This class can be used to fetch data and store it in the redux state
// It's main purpose is to separate the data fetching logic from the component
import { AUDIO_PLAYER_ACTIONS, AUDIO_PLAYER_SELECTORS } from 'Components/AudioPlayer/audioPlayerSlice';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { AppDispatch } from 'Hooks/store';
import { getPlaylistByID, getSongs } from 'Services';
import { Playlist, Song } from 'Types';
import { PLAYLIST_ACTIONS } from './PlaylistSlice';

export class PlaylistLoader {
  private dispatch: AppDispatch;

  private playlistID: string;

  private audioPlayerSongQueue: Song[] | null;

  constructor(playlistID: string) {
    this.dispatch = useAppDispatch();
    this.playlistID = playlistID;
    this.audioPlayerSongQueue = useAppSelector(AUDIO_PLAYER_SELECTORS.songQueue);
  }

  private playlistPending = () => this.dispatch(PLAYLIST_ACTIONS.setIsPlaylistLoading(true));

  // Helper functions for playlist status
  private playlistSuccess = (playlist: Playlist) => {
    this.dispatch(PLAYLIST_ACTIONS.setPlaylist(playlist));
    this.dispatch(PLAYLIST_ACTIONS.setIsPlaylistLoading(false));
  };

  private playlistFailure = (message: string) => {
    this.dispatch(PLAYLIST_ACTIONS.setPlaylistError(message));
    this.dispatch(PLAYLIST_ACTIONS.setIsPlaylistLoading(false));
  };

  // Helper functions for songs loading status
  private songsPending = () => this.dispatch(PLAYLIST_ACTIONS.setIsSongsLoading(true));

  private songsSuccess = (songs: Song[]) => {
    this.dispatch(PLAYLIST_ACTIONS.setSongs(songs));
    this.dispatch(PLAYLIST_ACTIONS.setIsSongsLoading(false));
    console.log('dispatched songs');
  };

  private songsFailure = (message: string) => {
    this.dispatch(PLAYLIST_ACTIONS.setPlaylistError(message));
    this.dispatch(PLAYLIST_ACTIONS.setIsSongsLoading(false));
  };

  // Setters
  public setPlaylistID(id: string) {
    this.playlistID = id;
  }

  // Fetch playlist and store in redux state
  public async loadPlaylist() {
    this.playlistPending();

    const playlist = await getPlaylistByID(this.playlistID);

    if (!playlist || !playlist.name) {
      this.playlistFailure('Failed to fetch playlist');
      return false;
    }

    this.playlistSuccess({ ...playlist });
    return true;
  }

  // Fetch songs and store in redux state
  // Sets current song if there is no song currently playing
  public async loadSongs() {
    console.log('fetching songs');
    this.songsPending();
    const songs = await getSongs(parseInt(this.playlistID, 10));

    if (!songs) {
      console.log('no songs');
      this.songsFailure('Failed to fetch songs');
      return false;
    }
    console.log('playlist songs', songs);

    this.songsSuccess([...songs]);

    if (!this.audioPlayerSongQueue && songs[0] && songs[0].id) {
      this.dispatch(AUDIO_PLAYER_ACTIONS.setCurrentSongID({
        songID: songs[0].id,
        playlistSongs: songs,
      }));
    }

    return true;
  }
}
