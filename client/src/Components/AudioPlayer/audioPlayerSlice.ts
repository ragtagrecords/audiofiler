// This file defines the state and actions for the AudioPlayer in Redux
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'Hooks/store';
import { store } from 'Hooks/store';
import { validIndex } from 'helpers';
import { Song } from 'Types';

interface AudioPlayerState {
  currentSongID: number | null;
  songQueue: Song[] | null;
  allSongs: Song[] | null;
  isPlaying: boolean;
}

const initialState: AudioPlayerState = {
  currentSongID: null,
  songQueue: null,
  allSongs: null,
  isPlaying: false,
};

type songIDAndPlaylist = {
  songID: number;
  playlistSongs: Song[];
}

export const audioPlayerSlice = createSlice({
  name: 'audioPlayer',
  initialState,
  reducers: {
    setSongQueue: (state, action: PayloadAction<Song[]>) => {
      state.songQueue = action.payload;
    },
    setCurrentSongID: (state, action: PayloadAction<songIDAndPlaylist>) => {
      const { songID, playlistSongs } = action.payload;
      if (!songID) { return; }
      const isFirstSong = !state.currentSongID;
      const isSongInQueue = state.songQueue
        && state.songQueue.some((s) => s.id === songID);
      if (!state.songQueue || !isSongInQueue) {
        state.songQueue = playlistSongs;
      }
      state.currentSongID = songID;
      if (isFirstSong) {
        state.isPlaying = true;
      }
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setAllSongs: (state, action: PayloadAction<Song[]>) => {
      state.allSongs = action.payload;
    },
    changeSongByRelativeIndex: (state, action: PayloadAction<number>) => {
      const { songQueue } = state;
      if (!state.currentSongID || !songQueue) {
        return;
      }
      const currentSongIndex = songQueue.findIndex((song) => song.id === state.currentSongID);
      const nextSongIndex = validIndex(currentSongIndex + action.payload, songQueue.length);
      const nextSongID = songQueue[nextSongIndex].id;
      if (nextSongID) {
        state.currentSongID = nextSongID;
      }
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
  songQueue: (state: RootState) => state.audioPlayer.songQueue,
  currentSongID: (state: RootState) => state.audioPlayer.currentSongID,
  currentSong: (state: RootState) => {
    const { allSongs } = state.audioPlayer;
    if (!allSongs) {
      console.log('ERROR: no songs in state');
      return null;
    }
    const songsByID = allSongs.filter((song) => song.id === state.audioPlayer.currentSongID);
    return songsByID.length > 0 ? songsByID[0] : null;
  },
  allSongs: (state: RootState) => state.audioPlayer.allSongs,
  isPlaying: (state: RootState) => state.audioPlayer.isPlaying,
};

export default audioPlayerSlice.reducer;
