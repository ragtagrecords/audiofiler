// This file defines the state and actions for the playlist in Redux
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'Hooks/store';
import { User } from 'Types';

interface PlaylistState {
  user: User | null;
  isUserLoading: boolean;
  userError: string | null;
}

const initialState: PlaylistState = {
  user: null,
  isUserLoading: false,
  userError: null,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.userError = null;
      state.isUserLoading = false;
    },
    setIsUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isUserLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.userError = action.payload;
      state.user = null;
      state.isUserLoading = false;
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
