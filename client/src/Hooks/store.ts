// This file is boilerplate for Redux state library
// Defines the reducers used throughout the app
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import playlistReducer from 'Pages/Playlist/PlaylistSlice';
import taskManagerReducer from 'Pages/Tasks/taskManagerSlice';

export const store = configureStore({
  reducer: {
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
