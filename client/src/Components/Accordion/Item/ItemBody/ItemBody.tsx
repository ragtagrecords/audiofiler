import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { PlaylistCtx } from 'Pages/Playlist/Playlist';
import { PLAYLIST_ACTIONS, PLAYLIST_SELECTORS } from 'Pages/Playlist/PlaylistSlice';
import { AUDIO_PLAYER_ACTIONS } from 'Components/AudioPlayer/audioPlayerSlice';
import {
  UploadArea,
  FileList,
  UploadOptions,
  SongVersionHeader,
  InfoCard,
} from 'Components';
import classNames from 'classnames';
import { Song } from 'Types';
import { getSongs } from 'Services';
import { ItemCtx } from '../Item';
import './styles.scss';

export const ItemBody = () => {
  const [songVersions, setSongVersions] = useState<Song[]>([]);
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

  const getSongVersions = async () => {
    const tempSongs = song.id && song.isParent && await getSongs(null, song.id);
    if (tempSongs) {
      setSongVersions(tempSongs);
    } else if (song.isParent) {
      console.log("Couldn't retrieve different versions of the parent song");
      return false;
    }
    return true;
  };

  useEffect(() => {
    getSongVersions();
  }, []);

  // Only show upload options after files are uploaded
  const bodyContents = () => {
    if (uploadedFiles) {
      return (
        <UploadOptions
          uploadedFiles={uploadedFiles}
          parentSong={song}
        />
      );
    }
    return (
      <>
        <section>
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
        <section>
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
        <section className="versions-and-files">
          <div className="header">
            <h1>Versions and Files</h1>
            <UploadArea handleUpload={handleUploadedFiles} />
          </div>
          {[song, ...songVersions].map((song) => {
            if (!song.id) {
              return null;
            }
            return (
            // TODO: fix alignment and colors
              <div className="version-and-files" key={`version-and-files-${song.id}`}>
                <hr />
                <SongVersionHeader song={song} />
                <FileList songs={[song]} />
              </div>
            );
          })}
        </section>
      </>
    );
  };

  return (
    <div className={classNames({
      'item-body': true,
      open: isOpen,
    })}
    >
      {bodyContents()}
    </div>
  );
};
