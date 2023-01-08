import React, { useContext } from 'react';

// Context
import { AppCtx } from 'Components/App/App';
import { ItemCtx } from 'Components/Accordion/Item/Item';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { PLAYLIST_SELECTORS } from 'Pages/Playlist/PlaylistSlice';
import { IconButton } from 'Components';
import './ItemHeader.scss';
import { AUDIO_PLAYER_ACTIONS } from 'Components/AudioPlayer/audioPlayerSlice';
import { addSongToPlaylist, removeSongFromPlaylist } from 'Services/PlaylistSvc';
import { PlaylistLoader } from 'Pages/Playlist/playlistLoaders';

export const ItemHeader = () => {
  const appContext = useContext(AppCtx);
  const itemContext = useContext(ItemCtx);
  if (appContext === null || itemContext === null) {
    return null;
  }
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
  const songs = useAppSelector(PLAYLIST_SELECTORS.songs);
  const dispatch = useAppDispatch();
  const playlistLoader = new PlaylistLoader(playlist.id.toString());

  // When add button is clicked for a particular item
  const addSongToCurrentPlaylist = async (id: number) => {
    if (!playlist) {
      console.log("Couldn't add song");
      return false;
    }
    await addSongToPlaylist(id, playlist.id);
    playlistLoader.loadSongs();
    return true;
  };

  // By default show the # position of the song in the playlist
  // If in editing mode, show the discard changes button
  // If in adding mode, show the add button
  // If in reorder mode, show the drag handle
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
            if (song && song.id) {
              addSongToCurrentPlaylist(song.id);
            }
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

    if (mode.current === 'dragging') {
      return <IconButton type="drag" />;
    }

    return null;
  };

  // Center is a button with the song name, plays the song on click
  const center = () => {
    const handleClick = () => {
      if (!song?.id) {
        return false;
      }

      if (songs) {
        dispatch(AUDIO_PLAYER_ACTIONS.setCurrentSongID({
          songID: song.id,
          playlistSongs: songs,
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
  // In reorder mode, show remove from playlist button
  const right = () => {
    const defaultRight = (
      <IconButton
        type="dropdown"
        size="30px"
        color="#5ae7ff"
        onClick={() => {
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

    if (mode.current === 'dragging') {
      return (
        <IconButton
          type="remove"
          onClick={async () => {
            if (song.id && playlist.id) {
              await removeSongFromPlaylist(song.id, playlist.id);
              window.location.reload();
            }
          }}
        />
      );
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
