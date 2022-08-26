import React, {
  createContext, useEffect, useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { MenuOption, Playlist as PlaylistT, Song } from 'Types';
import { DragDropContext } from 'react-beautiful-dnd';
import {
  Accordion,
  Item,
  ItemHeader,
  ItemBody,
  UserMenu,
  IconButton,
  EditableTitle,
  HeaderPortal,
  SearchBar,
  DragIconPortal,
} from 'Components';
import {
  authenticate,
  getSongs,
  getPlaylistByID,
  addSongToPlaylist,
  updatePlaylist,
  updateSongPlaylist,
} from 'Services';
import { filterSongs } from 'helpers';
import { AUDIO_PLAYER_ACTIONS, AUDIO_PLAYER_SELECTORS } from 'Components/AudioPlayer/audioPlayerSlice';
import { PLAYLIST_SELECTORS, PLAYLIST_ACTIONS } from './PlaylistSlice';
import './Playlist.scss';

interface PlaylistContextInterface {
  userID: number | null;
  addSongToCurrentPlaylist: any;
  loadPlaylist: any;
}

export const PlaylistCtx = createContext<PlaylistContextInterface | null>(null);

type PlaylistParams = {
  playlistID: string;
}

export const Playlist = () => {
  // Get playlistID from query params
  const { playlistID } = useParams<PlaylistParams>();

  if (!playlistID) {
    return (<div>No playlistID found</div>);
  }

  // TODO: move userID to redux
  const [userID, setUserID] = useState<number | null>(null);

  // State from redux
  const allSongs = useAppSelector(AUDIO_PLAYER_SELECTORS.allSongs);
  const playlist = useAppSelector(PLAYLIST_SELECTORS.selectPlaylist);
  const audioPlayerSongQueue = useAppSelector(AUDIO_PLAYER_SELECTORS.songQueue);
  const query = useAppSelector(PLAYLIST_SELECTORS.selectQuery);
  const isLoading = useAppSelector(PLAYLIST_SELECTORS.selectIsLoading);
  const mode = useAppSelector(PLAYLIST_SELECTORS.selectMode);
  const dispatch = useAppDispatch();

  const auth = async () => {
    const userID = await authenticate();
    setUserID(userID);
  };

  // Used for 3 dots in upper right of page
  const menuOptions: MenuOption[] = [
    {
      href: '/songs/add',
      text: 'Upload songs',
      state: { playlist },
    },
    {
      href: '/',
      text: 'Add existing songs',
      onClick: () => dispatch(
        PLAYLIST_ACTIONS.setCurrentMode(mode.current === 'adding' ? 'normal' : 'adding'),
      ),
    },
    {
      href: '/',
      text: 'Edit songs',
      onClick: () => dispatch(
        PLAYLIST_ACTIONS.setCurrentMode(mode.current === 'editing' ? 'normal' : 'editing'),
      ),
    },
    {
      href: '/',
      text: 'Reorder songs',
      onClick: () => dispatch(
        PLAYLIST_ACTIONS.setCurrentMode(mode.current === 'dragging' ? 'normal' : 'dragging'),
      ),
    },
  ];

  // TODO: move these async loads into redux with a thunk, or saga or something
  const loadPlaylist = async () => {
    const p = await getPlaylistByID(playlistID);
    const songs = await getSongs(playlistID);

    if (!p || !p.name || !songs || songs.length === 0 || !songs[0].id) {
      return false;
    }

    p.songs = songs;
    dispatch(PLAYLIST_ACTIONS.setPlaylist(p));

    if (!audioPlayerSongQueue) {
      dispatch(AUDIO_PLAYER_ACTIONS.setCurrentSongID({
        songID: songs[0].id,
        playlistSongs: songs,
      }));
    }

    return true;
  };

  const loadAllSongs = async () => {
    const songs = filterSongs(await getSongs(), '', null);
    if (songs) {
      dispatch(AUDIO_PLAYER_ACTIONS.setAllSongs(songs));
      return true;
    }
    return false;
  };

  // When add button is clicked for a particular item
  const addSongToCurrentPlaylist = async (id: number) => {
    if (!playlist) {
      console.log("Couldn't add song");
      return false;
    }
    await addSongToPlaylist(id, playlist.id);
    loadPlaylist();
    return true;
  };

  const changePlaylistName = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!playlist || !playlist.name) { console.log("ERROR: Couldn't update playlist name"); return false; }
    const emptyString = playlist.name === '';
    const startsWithSpace = playlist.name.length > 0 && playlist.name[0] === ' ';
    const endsWithSpace = playlist.name.length > 0 && playlist.name.slice(-1) === ' ';

    if (emptyString) {
      alert('Playlist name can not be empty.');
    } else if (startsWithSpace || endsWithSpace) {
      alert('Playlist name can not start or end with spaces.');
    } else if (playlist) {
      alert('Name updated successfully.');
      return !!updatePlaylist(playlist);
    }
    return false;
  };

  const saveChangesToSongPositions = () => {
    if (!playlist || !playlist.songs) { return; }
    for (let i = 0; i < playlist.songs.length; i += 1) {
      if (playlist.songs[i].id) {
        const song = playlist.songs[i];
        if (song.id && playlist) {
          const success = updateSongPlaylist({
            songID: song.id,
            playlistID: playlist.id,
            position: song.position,
          });
          if (!success) {
            alert('Error encountered while updated song positions');
          } else {
            dispatch(PLAYLIST_ACTIONS.setCurrentMode('normal'));
          }
        }
      }
    }
  };

  // Function to update list order on drop
  const handleDrop = (droppedItem: any) => {
    // Ignore drop outside droppable container
    if (!playlist || !playlist.songs || !droppedItem.destination) {
      return false;
    }

    const updatedPlaylistSongs = [...playlist.songs];
    // Remove dragged item
    const [reorderedItem] = updatedPlaylistSongs.splice(droppedItem.source.index, 1);

    // Add dropped item
    updatedPlaylistSongs.splice(
      droppedItem.destination.index,
      0,
      reorderedItem,
    );

    // Update State
    if (reorderedItem.id) {
      dispatch(PLAYLIST_ACTIONS.setPlaylistSongs(updatedPlaylistSongs));
      dispatch(PLAYLIST_ACTIONS.setSongPlaylistPositions());
    }
    return true;
  };

  // When component is initally loaded
  useEffect(() => {
    auth();
    dispatch(PLAYLIST_ACTIONS.setIsLoading(true));
    dispatch(PLAYLIST_ACTIONS.setCurrentMode('normal'));
    loadPlaylist();
    loadAllSongs();
  }, []);

  let songs = null;
  if (playlist && playlist.songs) {
    if (mode.current === 'adding' && allSongs) {
      songs = filterSongs(allSongs, query, playlist.songs);
    } else {
      songs = playlist.songs;
    }
  }

  return (
    <PlaylistCtx.Provider
      value={{
        loadPlaylist,
        addSongToCurrentPlaylist,
        userID,
      }}
    >
      <HeaderPortal
        left={mode.current === 'dragging' ? (
          <IconButton
            type="cancel"
            onClick={() => {
              dispatch(PLAYLIST_ACTIONS.setCurrentMode('normal'));
            }}
          />
        ) : null}
        right={mode.current === 'dragging'
          ? (
            <IconButton
              type="save"
              onClick={saveChangesToSongPositions}
            />)
          : (<UserMenu options={menuOptions} />)}
        center={isLoading
          ? (null)
          : (
            <EditableTitle
              value={playlist?.name ?? ''}
              isEditable={!!userID}
              onChange={(e) => {
                const updatedPlaylist = { ...playlist } as PlaylistT;
                updatedPlaylist.name = e.target.value;
                if (updatedPlaylist.name && updatedPlaylist.id) {
                  dispatch(PLAYLIST_ACTIONS.setPlaylist(updatedPlaylist));
                }
              }}
              onSubmit={changePlaylistName}
            />
          )}
      />

      {mode.current === 'adding' && (
        <div className="searchItem">
          <SearchBar
            onChange={(e) => dispatch(PLAYLIST_ACTIONS.setQuery(e.target.value))}
            query={query}
          />
        </div>
      )}

      <DragIconPortal />

      <DragDropContext onDragEnd={handleDrop}>
        {/* <SearchBar /> */}
        <Accordion>
          {songs && songs.map((song: Song, index) => (
            <Item
              key={song.id}
              index={index}
              song={song}
            >
              <ItemHeader />
              <ItemBody />
            </Item>
          ))}
        </Accordion>
      </DragDropContext>
    </PlaylistCtx.Provider>
  );
};
