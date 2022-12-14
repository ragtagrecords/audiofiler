// This file defines the state and actions for the AudioPlayer in Redux
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from 'Hooks/store';
import { validIndex } from 'helpers';
import { FetchableObject, Song } from 'Types';

interface AudioPlayerState {
  currentSongID: number | null;
  songQueue: Song[] | null;
  allSongs: FetchableObject<{songs: Song[] | null}>;
  isPlaying: boolean;
}

const initialState: AudioPlayerState = {
  currentSongID: null,
  songQueue: null,
  allSongs: {
    songs: null,
    isLoading: false,
    error: null,
  },
  isPlaying: false,
};

type songIDAndPlaylist = {
  songID: number;
  playlistSongs: Song[];
  shouldPlay?: boolean;
}

export const audioPlayerSlice = createSlice({
  name: 'audioPlayer',
  initialState,
  reducers: {
    setSongQueue: (state, action: PayloadAction<Song[]>) => {
      state.songQueue = action.payload;
    },
    setCurrentSongID: (state, action: PayloadAction<songIDAndPlaylist>) => {
      const { songID, playlistSongs, shouldPlay } = action.payload;
      if (!songID) { return; }
      const isSongInQueue = state.songQueue
        && state.songQueue.some((s) => s.id === songID);
      if (!state.songQueue || !isSongInQueue) {
        state.songQueue = playlistSongs;
      }
      state.currentSongID = songID;
      if (shouldPlay) {
        state.isPlaying = true;
      }
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },

    setAllSongs: (state, action: PayloadAction<Song[]>) => {
      state.allSongs.songs = action.payload;
      state.allSongs.error = null;
      state.allSongs.isLoading = false;
    },
    setIsAllSongsLoading: (state, action: PayloadAction<boolean>) => {
      state.allSongs.isLoading = action.payload;
    },
    setAllSongsError: (state, action: PayloadAction<string>) => {
      state.allSongs.songs = null;
      state.allSongs.error = action.payload;
      state.allSongs.isLoading = false;
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
    const { allSongs, currentSongID } = state.audioPlayer;
    if (currentSongID && allSongs && allSongs.songs) {
      const songsByID = allSongs.songs.filter((song) => song.id === state.audioPlayer.currentSongID);
      return songsByID.length > 0 ? songsByID[0] : null;
    }
    if (currentSongID && !allSongs) {
      console.log('ERROR: no songs in state');
      return null;
    }
    return null;
  },
  allSongs: (state: RootState) => state.audioPlayer.allSongs,
  isPlaying: (state: RootState) => state.audioPlayer.isPlaying,
};

export default audioPlayerSlice.reducer;
