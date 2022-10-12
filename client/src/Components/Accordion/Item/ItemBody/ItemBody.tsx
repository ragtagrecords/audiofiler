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
  InfoCard,
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
  const mode = useAppSelector(PLAYLIST_SELECTORS.mode);
  const dispatch = useAppDispatch();

  const {
    song,
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

  return (
    <div className={`item-body ${isOpen ? 'open' : ''}`}>
      <section className="song-info">
        <InfoCard
          title="Tempo"
          info={song.tempo?.toString() ?? '???'}
          isEditable={mode.current === 'editing'}
          onChange={(e) => {
            const editedSong = { ...song };
            editedSong.tempo = parseInt(e.target.value, 10);
            setEditedSong(editedSong);
          }}
        />
        <InfoCard
          title="Key"
          info="???"
          isEditable={false}
          onChange={() => {
            console.log('no functionality for changing key yet');
          }}
        />
      </section>
      <section className="song-info">
        <InfoCard
          title="Notes"
          info={song.notes ?? 'lots and lots of noteslots and lots of noteslots and lots of noteslots and lots of notes'}
          isEditable={false}
          isLarge={true}
          onChange={() => {
            console.log('no functionality for changing key yet');
          }}
        />
      </section>

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
