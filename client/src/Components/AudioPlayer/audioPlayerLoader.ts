// This class can be used to fetch data and store it in the redux state
// It's main purpose is to separate the data fetching logic from the component
import { useAppDispatch } from 'Hooks/hooks';
import { AppDispatch } from 'Hooks/store';
import { getSongs } from 'Services';
import { AUDIO_PLAYER_ACTIONS } from './audioPlayerSlice';

export class AudioPlayerLoader {
  private dispatch: AppDispatch;

  constructor() {
    this.dispatch = useAppDispatch();
  }

  // Attempt to load user information from accessToken
  // If successful, store in redux state
  public async loadAllSongs() {
    this.dispatch(AUDIO_PLAYER_ACTIONS.setIsAllSongsLoading(true));

    const songs = await getSongs();

    if (!songs) {
      this.dispatch(AUDIO_PLAYER_ACTIONS.setAllSongsError('Failed to fetch all songs'));
      return false;
    }

    this.dispatch(AUDIO_PLAYER_ACTIONS.setAllSongs([...songs]));
    return true;
  }
}
