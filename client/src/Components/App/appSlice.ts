// This file defines the state and actions for the playlist in Redux
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'Hooks/store';
import { FetchableObject, User } from 'Types';

interface PlaylistState {
  user: FetchableObject<{data: User | null}>;
}

const initialState: PlaylistState = {
  user: {
    data: null,
    isLoading: false,
    error: null,
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user.data = action.payload;
      state.user.error = null;
      state.user.isLoading = false;
    },
    setIsUserLoading: (state, action: PayloadAction<boolean>) => {
      state.user.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.user.error = action.payload;
      state.user.data = null;
      state.user.isLoading = false;
    },
  },
});

// Actions are used for modifying the state
// Exports all the reducer functions inside appSlice
// TODO: make shorthand actionCreator functions, calling dispatch is really verbose currently
export const APP_ACTIONS = {
  ...appSlice.actions,
};

// Selectors are used for checking the current state
export const APP_SELECTORS = {
  user: (state: RootState) => state.app.user,
};

export default appSlice.reducer;
