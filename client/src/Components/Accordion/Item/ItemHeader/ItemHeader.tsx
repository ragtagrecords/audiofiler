import React, { useContext } from 'react';

// Context
import { AppCtx } from 'Components/App/App';
import { PlaylistCtx } from 'Pages/Playlist/Playlist';
import { ItemCtx } from 'Components/Accordion/Item/Item';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { PLAYLIST_ACTIONS, PLAYLIST_SELECTORS } from 'Pages/Playlist/PlaylistSlice';
import { IconButton } from 'Components';
import './ItemHeader.scss';
import { AUDIO_PLAYER_ACTIONS, AUDIO_PLAYER_SELECTORS } from 'Components/AudioPlayer/audioPlayerSlice';

export const ItemHeader = () => {
  const username = localStorage.getItem('username');

  const appContext = useContext(AppCtx);
  const playlistContext = useContext(PlaylistCtx);
  const itemContext = useContext(ItemCtx);
  if (appContext === null || itemContext === null || !playlistContext) {
    return null;
  }
  const {
    addSongToCurrentPlaylist,
  } = playlistContext;
  const {
    song,
    playlist,
    setBodyType,
    isEdited,
    isOpen,
    setIsOpen,
    discardEdits,
    setEditedSong,
    saveEditedSongToDB,
  } = itemContext;

  const mode = useAppSelector(PLAYLIST_SELECTORS.mode);
  const audioPlayerSongID = useAppSelector(AUDIO_PLAYER_SELECTORS.currentSongID);
  const dispatch = useAppDispatch();

  // Either show the add button or the upload button
  const left = () => {
    return <div>{song.position}</div>;
    // TODO: repurpose this (buttons for discarding edits and adding songs in search)
    /*
    if (!username) {
      return null;
    }

    if (mode.current === 'adding') {
      return (
        <IconButton
          type="add"
          onClick={() => {
            addSongToCurrentPlaylist(song?.id);
          }}
        />
      );
    }

    if (isSelected && mode.current !== 'editing') {
      return (
        <IconButton
          type="upload"
          onClick={() => {
            setBodyType('upload');
            setIsOpen(true);
          }}
        />
      );
    }

    if (isSelected && isEdited && mode.current === 'editing') {
      return (<IconButton type="cancel" onClick={discardEdits} />);
    }
    */

    return null;
  };

  // Song name and a button to select the song and toggle body section
  const center = () => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!song?.id) {
        return false;
      }

      if (playlist.songs) {
        dispatch(AUDIO_PLAYER_ACTIONS.setCurrentSongID({
          songID: song.id,
          playlistSongs: playlist.songs,
        }));
      }
      return true;
    };
    return mode.current === 'editing' ? (
      <input
        value={song.name}
        onChange={(e) => {
          const editedSong = { ...song };
          editedSong.name = e.target.value;
          setEditedSong(editedSong);
        }}
      />
    ) : (
      <button
        type="button"
        className="accordionButton"
        onClick={handleClick}
      >
        {song.name}
      </button>
    );
  };

  // TODO: repurpose functionality
  // If song is selected and user is authenticated, show extra options
  const right = () => {
    if (!song.path || !username) {
      return null;
    }

    if (mode.current !== 'editing') {
      return (
        <>
          <IconButton
            type="download"
            key={`download-song-${song.id}`}
            onClick={() => {
              setBodyType('download');
              setIsOpen(true);
            }}
          />
          <IconButton
            type="options"
            size="40px"
            onClick={() => {
              setBodyType('versions');
              setIsOpen(true);
            }}
          />
        </>
      );
    }

    if (isEdited) {
      return (<IconButton type="save" onClick={saveEditedSongToDB} />);
    }

    return null;
  };

  return (
    <div className={`accordionHeader ${mode.current === 'adding' ? 'adding' : ''}`}>

      <div className="accordionHeaderSection left">
        {song.position ?? '-'}
      </div>

      <div className="accordionHeaderSection center">
        {center()}
      </div>

      <div className="accordionHeaderSection right">
        <IconButton
          type="dropdown"
          size="30px"
          color="white"
          onClick={() => {
            console.log(isOpen);
            setBodyType('info');
            setIsOpen(!isOpen);
          }}
        />
      </div>
    </div>
  );
};
