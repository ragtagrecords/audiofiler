import React, { useContext } from 'react';

// Context
import { AppCtx } from 'Components/App/App';
import { PlaylistCtx } from 'Pages/Playlist/Playlist';
import { ItemCtx } from 'Components/Accordion/Item/Item';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { PLAYLIST_SELECTORS } from 'Pages/Playlist/PlaylistSlice';
import { IconButton } from 'Components';
import './ItemHeader.scss';
import { AUDIO_PLAYER_ACTIONS } from 'Components/AudioPlayer/audioPlayerSlice';

export const ItemHeader = () => {
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
  const dispatch = useAppDispatch();

  // By default show the position of the song in the playlist
  // If in editing mode, show the discard changes button
  // If in adding mode, show the add button
  const left = () => {
    const defaultLeft = <> {song.position ?? '-'} </>;
    if (mode.current === 'normal') {
      return defaultLeft;
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

    if (mode.current === 'editing') {
      if (isEdited) {
        return (<IconButton type="cancel" onClick={discardEdits} />);
      }
      return defaultLeft;
    }

    return null;
  };

  // Center is a button with the song name, plays the song on click
  const center = () => {
    const handleClick = () => {
      if (!song?.id) {
        return false;
      }

      if (playlist.songs) {
        dispatch(AUDIO_PLAYER_ACTIONS.setCurrentSongID({
          songID: song.id,
          playlistSongs: playlist.songs,
          shouldPlay: true,
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

  // In normal mode, show dropdown caret in normal mode
  // In editing mode, show save button after edits are made
  const right = () => {
    const defaultRight = (
      <IconButton
        type="dropdown"
        size="30px"
        color="#5ae7ff"
        onClick={() => {
          console.log(isOpen);
          setBodyType('info');
          setIsOpen(!isOpen);
        }}
      />
    );
    if (mode.current === 'normal') {
      return defaultRight;
    }

    if (mode.current === 'editing') {
      if (isEdited) {
        return (<IconButton type="save" onClick={saveEditedSongToDB} />);
      }
      return defaultRight;
    }

    return null;
  };

  return (
    <div className={`item-header ${mode.current === 'adding' ? 'adding' : ''}`}>

      <div className="left">
        {left()}
      </div>

      <div className="center">
        {center()}
      </div>

      <div className="right">
        {right()}
      </div>
    </div>
  );
};
