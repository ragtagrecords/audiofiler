// This file defines the state and actions for the playlist in Redux
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Playlist, Song } from 'Types';
import type { RootState } from 'Hooks/store';

type Modes = 'normal' | 'editing' | 'adding' | 'dragging';

type Mode = {
  current: Modes;
  previous: Modes;
}

interface PlaylistState {
  playlist: Playlist | null;
  selectedSongID: number | null;
  query: string;
  uploadedFiles: File[] | null;
  isLoading: boolean;
  mode: Mode;
}

const initialState: PlaylistState = {
  playlist: null,
  selectedSongID: null,
  query: '',
  uploadedFiles: null,
  isLoading: true,
  mode: { current: 'normal', previous: 'normal' },
};

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.playlist = action.payload;
      state.isLoading = false;
    },
    setPlaylistSongs: (state, action: PayloadAction<Song[]>) => {
      if (!state.playlist) { return; }
      state.playlist.songs = action.payload;
    },
    // Updates position property based on new index in state
    setSongPlaylistPositions: (state) => {
      if (state.playlist && state.playlist.songs) {
        state.playlist.songs = state.playlist.songs.map((song, index) => {
          song.position = index;
          return song;
        });
      }
    },
    setSelectedSongID: (state, action: PayloadAction<number>) => {
      state.selectedSongID = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setUploadedFiles: (state, action: PayloadAction<File[]>) => {
      state.uploadedFiles = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },
    setCurrentMode: (state, action: PayloadAction<Modes>) => {
      state.mode.previous = state.mode.current;
      state.mode.current = action.payload;
    },
  },
});

// Actions are used for modifying the state
// Exports all the reducer functions inside playlistSlice
export const PLAYLIST_ACTIONS = {
  ...playlistSlice.actions,
};

// Selectors are used for checking the current state
export const PLAYLIST_SELECTORS = {
  playlist: (state: RootState) => state.playlist.playlist,
  selectedSongID: (state: RootState) => state.playlist.selectedSongID,
  query: (state: RootState) => state.playlist.query,
  uploadedFiles: (state: RootState) => state.playlist.uploadedFiles,
  isLoading: (state: RootState) => state.playlist.isLoading,
  mode: (state: RootState) => state.playlist.mode,
};

export default playlistSlice.reducer;
