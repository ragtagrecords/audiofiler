// This class can be used to fetch data and store it in the redux state
// It's main purpose is to separate the data fetching logic from the component
import { AUDIO_PLAYER_ACTIONS, AUDIO_PLAYER_SELECTORS } from 'Components/AudioPlayer/audioPlayerSlice';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { AppDispatch } from 'Hooks/store';
import { getPlaylistByID, getSongs, updateSongPlaylist } from 'Services';
import { FetchableObject, Playlist, Song } from 'Types';
import { PLAYLIST_ACTIONS, PLAYLIST_SELECTORS } from './playlistSlice';

export class PlaylistLoader {
  private dispatch: AppDispatch;

  private playlistID: string | null;

  private playlist: FetchableObject<{ data: Playlist | null }>;

  private songs: FetchableObject<{ data: Song[] | null }>;

  private audioPlayerSongQueue: Song[] | null;

  constructor() {
    this.dispatch = useAppDispatch();
    this.playlistID = null;
    this.audioPlayerSongQueue = useAppSelector(AUDIO_PLAYER_SELECTORS.songQueue);
    this.playlist = useAppSelector(PLAYLIST_SELECTORS.playlist);
    this.songs = useAppSelector(PLAYLIST_SELECTORS.songs);
  }

  // Setters
  public setPlaylistID(id: string) {
    this.playlistID = id;
  }

  // Fetch playlist and store in redux state
  public async loadPlaylist() {
    if (!this.playlistID) {
      console.log('ERROR: Playlist ID not set');
      return false;
    }

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
    if (!this.playlistID) {
      console.log('ERROR: Playlist ID not set');
      return false;
    }
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

  // Function to update list order on drop
  public handleDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!this.playlist || !this.songs.data || !droppedItem.destination) {
      return false;
    }

    const updatedPlaylistSongs = [...this.songs.data];
    // Remove dragged item
    const [reorderedItem] = updatedPlaylistSongs.splice(droppedItem.source.index, 1);

    // Add dropped item
    updatedPlaylistSongs.splice(
      droppedItem.destination.index,
      0,
      reorderedItem,
    );

    // Update State
    if (reorderedItem.id) {
      this.dispatch(PLAYLIST_ACTIONS.setSongs(updatedPlaylistSongs));
      this.dispatch(PLAYLIST_ACTIONS.setSongPlaylistPositions());
    }
    return true;
  };

  // Save song positions to database
  public saveChangesToSongPositions = () => {
    if (!this.playlist || !this.songs.data) { return; }
    for (let i = 0; i < this.songs.data.length; i += 1) {
      if (this.songs.data[i].id) {
        const song = this.songs.data[i];
        if (song.id && this.playlist.data) {
          const success = updateSongPlaylist({
            songID: song.id,
            playlistID: this.playlist.data.id,
            position: song.position,
          });
          if (!success) {
            alert('Error encountered while updated song positions');
          } else {
            this.dispatch(PLAYLIST_ACTIONS.setCurrentMode('normal'));
          }
        }
      }
    }
  };
}
