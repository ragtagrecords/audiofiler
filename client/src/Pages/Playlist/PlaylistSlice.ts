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
  isPlaylistLoading: boolean;
  playlistError: string | null;

  songs: Song[] | null;
  isSongsLoading: boolean;
  songsError: string | null;
  selectedSongID: number | null;

  query: string;
  uploadedFiles: File[] | null;
  mode: Mode;
}

const initialState: PlaylistState = {
  playlist: null,
  isPlaylistLoading: true,
  playlistError: null,

  songs: null,
  isSongsLoading: true,
  songsError: null,
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
      state.playlist = action.payload;
      state.isPlaylistLoading = false;
    },
    setSongs: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
      console.log('setSongs', action.payload);
    },
    // Updates position property based on new index in state
    setSongPlaylistPositions: (state) => {
      if (state.playlist && state.songs) {
        state.songs = state.songs.map((song, index) => {
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
    setIsPlaylistLoading: (state, action: PayloadAction<boolean>) => {
      state.isPlaylistLoading = action.payload;
    },
    setIsSongsLoading: (state, action: PayloadAction<boolean>) => {
      state.isSongsLoading = action.payload;
    },
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },
    setCurrentMode: (state, action: PayloadAction<Modes>) => {
      state.mode.previous = state.mode.current;
      state.mode.current = action.payload;
    },
    setPlaylistError: (state, action: PayloadAction<string>) => {
      state.playlistError = action.payload;
    },
    setSongsError: (state, action: PayloadAction<string>) => {
      state.songsError = action.payload;
    },
  },
});

// Actions are used for modifying the state
// Exports all the reducer functions inside playlistSlice
// TODO: make shorthand functions, calling dispatch is really verbose currently
export const PLAYLIST_ACTIONS = {
  ...playlistSlice.actions,
};

// Selectors are used for checking the current state
export const PLAYLIST_SELECTORS = {
  playlist: (state: RootState) => state.playlist.playlist,
  songs: (state: RootState) => state.playlist.songs,
  isPlaylistLoading: (state: RootState) => state.playlist.isPlaylistLoading,
  isSongsLoading: (state: RootState) => state.playlist.isPlaylistLoading,
  selectedSongID: (state: RootState) => state.playlist.selectedSongID,
  query: (state: RootState) => state.playlist.query,
  uploadedFiles: (state: RootState) => state.playlist.uploadedFiles,
  mode: (state: RootState) => state.playlist.mode,
};

export default playlistSlice.reducer;
