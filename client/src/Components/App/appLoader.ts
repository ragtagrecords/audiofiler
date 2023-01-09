// This class can be used to fetch data and store it in the redux state
// It's main purpose is to separate the data fetching logic from the component
import { useAppDispatch } from 'Hooks/hooks';
import { AppDispatch } from 'Hooks/store';
import { authenticate } from 'Services';
import { User } from 'Types';
import { APP_ACTIONS } from './appSlice';

export class AppLoader {
  private dispatch: AppDispatch;

  constructor() {
    this.dispatch = useAppDispatch();
  }

  private userPending = () => this.dispatch(APP_ACTIONS.setIsUserLoading(true));

  // Helper functions for user status
  private userSuccess = (user: User) => {
    this.dispatch(APP_ACTIONS.setUser(user));
    this.dispatch(APP_ACTIONS.setIsUserLoading(false));
  };

  private userFailure = (message: string) => {
    this.dispatch(APP_ACTIONS.setUserError(message));
    this.dispatch(APP_ACTIONS.setIsUserLoading(false));
  };

  // Attempt to load user information from accessToken
  // If successful, store in redux state
  public async loadUser() {
    this.userPending();

    // TODO: actual auth logic
    const user = await authenticate();

    if (!user) {
      this.userFailure('Failed to fetch user');
      return false;
    }

    this.userSuccess({ ...user });
    return true;
  }
}
