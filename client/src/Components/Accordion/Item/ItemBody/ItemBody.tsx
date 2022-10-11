import React, { useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { PlaylistCtx } from 'Pages/Playlist/Playlist';
import { PLAYLIST_ACTIONS, PLAYLIST_SELECTORS } from 'Pages/Playlist/PlaylistSlice';
import { AUDIO_PLAYER_ACTIONS } from 'Components/AudioPlayer/audioPlayerSlice';
import {
  UploadArea,
  DownloadOptions,
  UploadOptions,
  SongVersions,
  SongInfo,
} from 'Components';
import { ItemCtx } from '../Item';
import './styles.scss';

export const ItemBody = () => {
  const playlistContext = useContext(PlaylistCtx);
  const itemContext = useContext(ItemCtx);
  if (!playlistContext || !itemContext) {
    console.log('no context');
    return null;
  }

  const uploadedFiles = useAppSelector(PLAYLIST_SELECTORS.uploadedFiles);
  const dispatch = useAppDispatch();

  const {
    song,
    isOpen,
  } = itemContext;

  const handleUploadedFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) {
      console.log('Upload failed');
      return false;
    }
    const fileArray: File[] = [];
    for (let i = 0; i < files.length; i += 1) {
      fileArray.push(files[i]);
    }
    dispatch(PLAYLIST_ACTIONS.setUploadedFiles(fileArray));
    return true;
  };

  return (
    <div className={`accordionBody ${isOpen ? 'open' : ''}`}>
      <SongInfo />
      <hr />
      {song.id && song.isParent ? <SongVersions parentID={song.id} /> : 'no versions'}
      <hr />
      {uploadedFiles ? (
        <UploadOptions
          uploadedFiles={uploadedFiles}
          parentSong={song}
        />
      ) : (
        <UploadArea handleUpload={handleUploadedFiles} />
      )}
      <hr />
      <DownloadOptions song={song} />
      <hr />
    </div>
  );
};
