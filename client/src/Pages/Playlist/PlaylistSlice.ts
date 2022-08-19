// This file defines the state and actions for the playlist in Redux
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BodyType, Playlist, Song } from 'Types';
import type { RootState } from 'Hooks/store';

type Modes = 'normal' | 'editing' | 'adding' | 'dragging';

type Mode = {
  current: Modes;
  previous: Modes;
}

interface PlaylistState {
  playlist: Playlist | null;
  playlistSongs: Song[] | null;
  allSongs: Song[] | null;
  selectedSongID: number | null;
  query: string;
  bodyType: BodyType;
  uploadedFiles: File[] | null;
  isLoading: boolean;
  mode: Mode;
}

const initialState: PlaylistState = {
  playlist: null,
  playlistSongs: null,
  allSongs: null,
  selectedSongID: null,
  query: '',
  bodyType: 'info',
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
    },
    setPlaylistSongs: (state, action: PayloadAction<Song[]>) => {
      state.playlistSongs = action.payload;
    },
    // Updates position property based on new index in state
    setSongPlaylistPositions: (state) => {
      if (state.playlistSongs) {
        state.playlistSongs = state.playlistSongs.map((song, index) => {
          song.position = index;
          return song;
        });
      }
    },
    setAllSongs: (state, action: PayloadAction<Song[]>) => {
      state.allSongs = action.payload;
    },
    setSelectedSongID: (state, action: PayloadAction<number>) => {
      state.selectedSongID = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setBodyType: (state, action: PayloadAction<BodyType>) => {
      state.bodyType = action.payload;
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
  selectPlaylist: (state: RootState) => state.playlist.playlist,
  selectPlaylistSongs: (state: RootState) => state.playlist.playlistSongs,
  selectAllSongs: (state: RootState) => state.playlist.allSongs,
  selectSelectedSongID: (state: RootState) => state.playlist.selectedSongID,
  selectQuery: (state: RootState) => state.playlist.query,
  selectBodyType: (state: RootState) => state.playlist.bodyType,
  selectUploadedFiles: (state: RootState) => state.playlist.uploadedFiles,
  selectIsLoading: (state: RootState) => state.playlist.isLoading,
  selectMode: (state: RootState) => state.playlist.mode,
};

export default playlistSlice.reducer;
