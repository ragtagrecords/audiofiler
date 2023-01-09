// This file defines the state and actions for the playlist in Redux
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchableObject, Playlist, Song } from 'Types';
import type { RootState } from 'Hooks/store';

type Modes = 'normal' | 'editing' | 'adding' | 'dragging';

type Mode = {
  current: Modes;
  previous: Modes;
}

interface PlaylistState {
  playlist: FetchableObject<{data: Playlist | null}>;
  songs: FetchableObject<{data: Song[] | null}>;
  selectedSongID: number | null;
  query: string;
  uploadedFiles: File[] | null;
  mode: Mode;
}

const initialState: PlaylistState = {
  playlist: {
    data: null,
    isLoading: false,
    error: null,
  },
  songs: {
    data: null,
    isLoading: false,
    error: null,
  },
  selectedSongID: null,
  query: '',
  uploadedFiles: null,
  mode: { current: 'normal', previous: 'normal' },
};

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.playlist.data = action.payload;
      state.playlist.error = null;
      state.playlist.isLoading = false;
    },
    setIsPlaylistLoading: (state, action: PayloadAction<boolean>) => {
      state.playlist.isLoading = action.payload;
    },
    setPlaylistError: (state, action: PayloadAction<string>) => {
      state.playlist.error = action.payload;
      state.playlist.data = null;
      state.playlist.isLoading = false;
    },
    setSongs: (state, action: PayloadAction<Song[]>) => {
      state.songs.data = action.payload;
      state.songs.error = null;
      state.songs.isLoading = false;
    },
    setIsSongsLoading: (state, action: PayloadAction<boolean>) => {
      state.songs.isLoading = action.payload;
    },
    setSongsError: (state, action: PayloadAction<string>) => {
      state.songs.error = action.payload;
      state.songs.data = null;
      state.songs.isLoading = false;
    },
    // Updates position property based on new index in state
    setSongPlaylistPositions: (state) => {
      if (state.playlist && state.songs && state.songs.data) {
        state.songs.data = state.songs.data.map((song, index) => {
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
// TODO: make shorthand actionCreator functions, calling dispatch is really verbose currently
export const PLAYLIST_ACTIONS = {
  ...playlistSlice.actions,
};

// Selectors are used for checking the current state
export const PLAYLIST_SELECTORS = {
  playlist: (state: RootState) => state.playlist.playlist,
  songs: (state: RootState) => state.playlist.songs,
  selectedSongID: (state: RootState) => state.playlist.selectedSongID,
  query: (state: RootState) => state.playlist.query,
  uploadedFiles: (state: RootState) => state.playlist.uploadedFiles,
  mode: (state: RootState) => state.playlist.mode,
};

export default playlistSlice.reducer;
