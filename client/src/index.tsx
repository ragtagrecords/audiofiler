import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from 'Hooks/store';
import {
  AddSongs,
  AddPlaylist,
  Playlist,
  Playlists,
  Login,
  Signup,
  Tasks,
} from 'Pages';
import { App } from 'Components';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App>
          <Routes>
            <Route path="/" element={<Playlists />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/playlists/:playlistID" element={<Playlist />} />
            <Route path="/playlists/add" element={<AddPlaylist />} />
            <Route path="/songs/add" element={<AddSongs />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tasks/song/:songID" element={<Tasks />} />
            <Route path="/tasks/playlist/:playlistID" element={<Tasks />} />
          </Routes>
        </App>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// import reportWebVitals from './reportWebVitals';
// reportWebVitals();
