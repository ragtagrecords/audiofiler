import React, { useContext } from 'react';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { PlaylistCtx } from 'Pages/Playlist/Playlist';
import { PLAYLIST_ACTIONS, PLAYLIST_SELECTORS } from 'Pages/Playlist/PlaylistSlice';
import {
  UploadArea, DownloadOptions, UploadOptions, SongVersions,
} from 'Components';
import { ItemCtx } from '../Item';
import './ItemBody.scss';

export const ItemBody = () => {
  const playlistContext = useContext(PlaylistCtx);
  const itemContext = useContext(ItemCtx);
  if (!playlistContext || !itemContext) {
    return null;
  }

  const {
    changeSong,
  } = playlistContext;

  const mode = useAppSelector(PLAYLIST_SELECTORS.selectMode);
  const bodyType = useAppSelector(PLAYLIST_SELECTORS.selectBodyType);
  const uploadedFiles = useAppSelector(PLAYLIST_SELECTORS.selectUploadedFiles);
  const dispatch = useAppDispatch();

  const {
    song,
    isSelected,
    isOpen,
    setEditedSong,
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

  if (bodyType === 'collapsed' || !isSelected) {
    return null;
  }

  let body = null;

  // TODO: separate this conditional into two blocks and make it a SongInfo component
  if (bodyType === 'info' || mode.current === 'editing') {
    body = (
      <>
        <p>
          <span>tempo: </span>
          {mode.current === 'editing' ? (
            <input
              value={song.tempo}
              onChange={(e) => {
                const editedSong = { ...song };
                editedSong.tempo = e.target.value;
                setEditedSong(editedSong);
              }}
            />
          ) : (
            <span> {song.tempo} </span>
          )}
        </p>
        <p>
          <span>notes: </span>
          {mode.current === 'editing' ? (
            <textarea
              className="big"
              value={song.notes ?? ''}
              onChange={(e) => {
                const editedSong = { ...song };
                editedSong.notes = e.target.value;
                setEditedSong(editedSong);
              }}
            />
          ) : (
            <span> {song.notes} </span>
          )}
        </p>
      </>
    );
  } else if (bodyType === 'upload') {
    if (uploadedFiles) { // After files are uploaded
      body = (
        <UploadOptions
          uploadedFiles={uploadedFiles}
          parentSong={song}
        />
      );
    } else { // Before files are uploaded
      body = (
        <UploadArea handleUpload={handleUploadedFiles} />
      );
    }
  } else if (bodyType === 'download') {
    body = (
      <DownloadOptions song={song} />
    );
  } else if (bodyType === 'versions') {
    if (song.id && song.isParent) {
      body = <SongVersions parentID={song.id} changeSong={changeSong} />;
    } else {
      body = <span>No additional versions found</span>;
    }
  }

  return (
    <button
      type="button"
      className={`accordionBody ${(isSelected && isOpen) ? 'open' : ''} ${bodyType}`}
      onClick={() => {
        if (bodyType === 'info') { changeSong(song); }
      }}
    >
      {body}
    </button>
  );
};
