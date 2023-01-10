// This file is boilerplate for Redux state library
// Defines the reducers used throughout the app
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from 'Components/App/appSlice';
import playlistReducer from 'Pages/Playlist/playlistSlice';
import taskManagerReducer from 'Pages/Tasks/taskManagerSlice';
import audioPlayerReducer from 'Components/AudioPlayer/audioPlayerSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    audioPlayer: audioPlayerReducer,
    playlist: playlistReducer,
    taskManager: taskManagerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
