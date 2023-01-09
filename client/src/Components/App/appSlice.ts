// This file defines the state and actions for the playlist in Redux
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'Hooks/store';
import { FetchableObject, Playlist, User } from 'Types';

interface PlaylistState {
  user: FetchableObject<{data: User | null}>;
  playlists: FetchableObject<{data: Playlist[] | null}>;
}

const initialState: PlaylistState = {
  user: {
    data: null,
    isLoading: false,
    error: null,
  },
  playlists: {
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
      state.user.data = null;
      state.user.error = action.payload;
      state.user.isLoading = false;
    },
    setPlaylists: (state, action: PayloadAction<Playlist[]>) => {
      state.playlists.data = action.payload;
      state.playlists.error = null;
      state.playlists.isLoading = false;
    },
    setIsPlaylistsLoading: (state, action: PayloadAction<boolean>) => {
      state.playlists.isLoading = action.payload;
    },
    setPlaylistsError: (state, action: PayloadAction<string>) => {
      state.playlists.data = null;
      state.playlists.error = action.payload;
      state.playlists.isLoading = false;
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
  playlists: (state: RootState) => state.app.playlists,
};

export default appSlice.reducer;
