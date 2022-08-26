// This file defines the state and actions for the AudioPlayer in Redux
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'Hooks/store';
import { Song } from 'Types';

interface AudioPlayerState {
  songs: Song[] | null;
  currentSongID: number | null;
  isPlaying: boolean;
}

const initialState: AudioPlayerState = {
  songs: null,
  currentSongID: null,
  isPlaying: false,
};

export const audioPlayerSlice = createSlice({
  name: 'audioPlayer',
  initialState,
  reducers: {
    setSongs: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
    },
    setCurrentSongID: (state, action: PayloadAction<number>) => {
      state.currentSongID = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
  },
});

// Actions are used for modifying the state
// Exports all the reducer functions inside audioPlayerSlice
export const AUDIO_PLAYER_ACTIONS = {
  ...audioPlayerSlice.actions,
};

// Selectors are used for checking the current state
export const AUDIO_PLAYER_SELECTORS = {
  selectSongs: (state: RootState) => state.audioPlayer.songs,
  selectCurrentSongID: (state: RootState) => state.audioPlayer.currentSongID,
  selectIsPlaying: (state: RootState) => state.audioPlayer.isPlaying,
};

export default audioPlayerSlice.reducer;
