// This class can be used to fetch data and store it in the redux state
// It's main purpose is to separate the data fetching logic from the component
import { useAppDispatch } from 'Hooks/hooks';
import { AppDispatch } from 'Hooks/store';
import { authenticate, getPlaylists } from 'Services';
import { APP_ACTIONS } from './appSlice';

export class AppLoader {
  private dispatch: AppDispatch;

  constructor() {
    this.dispatch = useAppDispatch();
  }

  // Attempt to load user information from accessToken
  // If successful, store in redux state
  public async loadUser() {
    this.dispatch(APP_ACTIONS.setIsUserLoading(true));
    const user = await authenticate();

    if (!user) {
      this.dispatch(APP_ACTIONS.setUserError('Failed to fetch user'));
      return false;
    }

    this.dispatch(APP_ACTIONS.setUser({ ...user }));
    return true;
  }

  // Attempt to fetch all playlists
  public async loadPlaylists() {
    this.dispatch(APP_ACTIONS.setIsPlaylistsLoading(true));
    const playlists = await getPlaylists();

    if (!playlists) {
      this.dispatch(APP_ACTIONS.setPlaylistsError('Failed to fetch playlists'));
      return false;
    }

    this.dispatch(APP_ACTIONS.setPlaylists([...playlists]));
    return true;
  }
}
