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
    changeSong,
    addSongToCurrentPlaylist,
  } = playlistContext;
  const {
    song,
    isSelected,
    isEdited,
    setIsOpen,
    discardEdits,
    setEditedSong,
    saveEditedSongToDB,
  } = itemContext;

  const mode = useAppSelector(PLAYLIST_SELECTORS.selectMode);
  const isPlaying = useAppSelector(AUDIO_PLAYER_SELECTORS.selectIsPlaying);
  const dispatch = useAppDispatch();

  // Either show the add button or the upload button
  const left = () => {
    if (!username) {
      return null;
    }

    if (mode.current === 'adding') {
      return (
        <IconButton
          type="add"
          onClick={() => {
            addSongToCurrentPlaylist(song.id);
          }}
        />
      );
    }

    if (isSelected && mode.current !== 'editing') {
      return (
        <IconButton
          type="upload"
          onClick={() => {
            dispatch(PLAYLIST_ACTIONS.setBodyType('upload'));
            setIsOpen(true);
          }}
        />
      );
    }

    if (isSelected && isEdited && mode.current === 'editing') {
      return (<IconButton type="cancel" onClick={discardEdits} />);
    }

    return null;
  };

  // Song name and a button to select the song and toggle body section
  const center = () => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!song.id) {
        return false;
      }
      switch (e.detail) {
        case 1: // click
          dispatch(PLAYLIST_ACTIONS.setBodyType('info'));
          dispatch(PLAYLIST_ACTIONS.setSelectedSongID(song.id));
          setIsOpen(true);
          if (isSelected) {
            changeSong(song);
          }
          return true;
        case 2: // double click
          changeSong(song);
          if (appContext?.song?.id === song.id) {
            setIsOpen(false);
          }
          dispatch(AUDIO_PLAYER_ACTIONS.setIsPlaying(true));
          return true;
        default:
          return true;
      }
    };
    return (
      <button
        type="button"
        className="accordionButton"
        onClick={handleClick}
      >
        {mode.current === 'editing' ? (
          <input
            value={song.name}
            onChange={(e) => {
              const editedSong = { ...song };
              editedSong.name = e.target.value;
              setEditedSong(editedSong);
            }}
          />
        ) : (
          <span>{song.name}</span>
        )}
      </button>
    );
  };

  // If song is selected and user is authenticated, show extra options
  const right = () => {
    if (!isSelected || !song.path || !username) {
      return null;
    }

    if (mode.current !== 'editing') {
      return (
        <>
          <IconButton
            type="download"
            key={`download-song-${song.id}`}
            onClick={() => {
              dispatch(PLAYLIST_ACTIONS.setBodyType('download'));
              setIsOpen(true);
            }}
          />
          <IconButton
            type="options"
            size="40px"
            onClick={() => {
              dispatch(PLAYLIST_ACTIONS.setBodyType('versions'));
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
    <div className={`accordionHeader ${isSelected ? 'selected' : ''} ${mode.current === 'adding' ? 'adding' : ''}`}>

      <div className="accordionHeaderSection left">
        {left()}
      </div>

      <div className="accordionHeaderSection center">
        {center()}
      </div>

      <div className="accordionHeaderSection right">
        {right()}
      </div>
    </div>
  );
};
