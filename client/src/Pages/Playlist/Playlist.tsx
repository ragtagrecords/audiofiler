import React, {
  createContext, useContext, useEffect, useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { AppCtx } from 'Components/App/App';
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

import { PLAYLIST_SELECTORS, PLAYLIST_ACTIONS } from './PlaylistSlice';
import './Playlist.scss';

interface PlaylistContextInterface {
  userID: number | null;
  changeSong: any;
  addSongToCurrentPlaylist: any;
  loadPlaylistSongs: any;
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

  const appContext = useContext(AppCtx);
  // TODO: move userID to redux
  const [userID, setUserID] = useState<number | null>(null);

  // State from redux
  const playlist = useAppSelector(PLAYLIST_SELECTORS.selectPlaylist);
  const playlistSongs = useAppSelector(PLAYLIST_SELECTORS.selectPlaylistSongs);
  const allSongs = useAppSelector(PLAYLIST_SELECTORS.selectAllSongs);
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
    if (!p || !p.name) {
      return false;
    }
    dispatch(PLAYLIST_ACTIONS.setPlaylist(p));
    return true;
  };

  const loadPlaylistSongs = async () => {
    const s = await getSongs(playlistID);
    if (!s || s.length === 0) {
      return false;
    }
    dispatch(PLAYLIST_ACTIONS.setPlaylistSongs(s));
    dispatch(PLAYLIST_ACTIONS.setIsLoading(false));
    return true;
  };

  // TODO: move function to helper file, doesnt need local state
  // Returns songs from the array that match the query
  // Optionally pass in songs to exclude from the search
  const filterSongs = (
    songs: Song[],
    query: string,
    excludedSongs: Song[] | null,
  ) => {
    if (!songs) {
      return [] as Song[];
    }

    // Grab ID's from excluded songs
    const excludedSongIDs = excludedSongs ? excludedSongs.map((s) => s.id) : [];

    // Remove songs that are excluded or don't match query
    const filteredSongs = songs.filter((song) => {
      const matchesQuery = query === '' || song.name.toLowerCase().includes(query.toLowerCase());
      const excluded = excludedSongs && excludedSongIDs.includes(song.id);
      return matchesQuery && !excluded;
    });

    return filteredSongs;
  };

  const loadAllSongs = async () => {
    const songs = filterSongs(await getSongs(), '', null);
    if (songs) {
      dispatch(PLAYLIST_ACTIONS.setAllSongs(songs));
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
    loadPlaylistSongs();
    return true;
  };

  // Change the song that is playing in the AudioPlayer
  const changeSong = (song: Song, isChild = false) => {
    if (mode.current === 'editing') {
      return false;
    }

    if (!song.id) {
      console.log('Failed to change song!');
      return false;
    }

    if (appContext?.song?.id !== song.id) {
      appContext?.setSong(song);
    }

    // If song is in different playlist than the one playing, update songs in context
    if (playlist?.id !== appContext?.playlistID) {
      appContext?.setPlaylistID(playlistID);
      appContext?.setSongs(playlistSongs);
    }

    if (!isChild) {
      dispatch(PLAYLIST_ACTIONS.setSelectedSongID(song.id));
    }

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
    if (!playlistSongs) { return; }
    for (let i = 0; i < playlistSongs.length; i += 1) {
      if (playlistSongs[i].id) {
        const song = playlistSongs[i];
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
    if (!playlistSongs || !droppedItem.destination) {
      return false;
    }

    const updatedPlaylistSongs = [...playlistSongs];
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
    loadPlaylistSongs();
    loadAllSongs();
  }, []);

  useEffect(() => {
    // If there is no song currently being played, play the first one in the playlist
    const isFirstSong = appContext?.song === null;
    if (isFirstSong && playlistSongs && playlistSongs[0].id) {
      changeSong(playlistSongs[0]);
    }
  }, [playlistSongs]);

  let songs = null;
  if (playlistSongs) {
    if (mode.current === 'adding' && allSongs) {
      songs = filterSongs(allSongs, query, playlistSongs);
    } else {
      songs = playlistSongs;
    }
  }

  return (
    <PlaylistCtx.Provider
      value={{
        loadPlaylistSongs,
        addSongToCurrentPlaylist,
        changeSong,
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
