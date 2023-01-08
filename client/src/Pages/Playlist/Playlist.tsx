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
import { PlaylistLoader } from './playlistLoaders';

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
  const playlistLoader = new PlaylistLoader(playlistID);

  // TODO: move userID to redux
  const [userID, setUserID] = useState<number | null>(null);

  // State from redux
  const allSongs = useAppSelector(AUDIO_PLAYER_SELECTORS.allSongs);
  const audioPlayerSongQueue = useAppSelector(AUDIO_PLAYER_SELECTORS.songQueue);
  const currentSongID = useAppSelector(AUDIO_PLAYER_SELECTORS.currentSongID);
  const playlist = useAppSelector(PLAYLIST_SELECTORS.playlist);
  const songs = useAppSelector(PLAYLIST_SELECTORS.songs);
  const query = useAppSelector(PLAYLIST_SELECTORS.query);
  const isPlaylistLoading = useAppSelector(PLAYLIST_SELECTORS.isPlaylistLoading);
  const mode = useAppSelector(PLAYLIST_SELECTORS.mode);
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
      text: 'Edit song info',
      onClick: () => dispatch(
        PLAYLIST_ACTIONS.setCurrentMode(mode.current === 'editing' ? 'normal' : 'editing'),
      ),
    },
    {
      href: '/',
      text: 'Reorder/remove songs',
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

    dispatch(PLAYLIST_ACTIONS.setPlaylist({ ...p }));
    const songs = await getSongs(parseInt(playlistID, 10));

    if (!songs || songs.length === 0 || !songs[0].id) {
      dispatch(PLAYLIST_ACTIONS.setIsPlaylistLoading(false));
      return false;
    }

    dispatch(PLAYLIST_ACTIONS.setPlaylist({ ...p, songs: [...songs] }));

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
    playlistLoader.loadSongs();
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
    if (!playlist || !songs) { return; }
    for (let i = 0; i < songs.length; i += 1) {
      if (songs[i].id) {
        const song = songs[i];
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
    if (!playlist || !songs || !droppedItem.destination) {
      return false;
    }

    const updatedPlaylistSongs = [...songs];
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
      dispatch(PLAYLIST_ACTIONS.setSongs(updatedPlaylistSongs));
      dispatch(PLAYLIST_ACTIONS.setSongPlaylistPositions());
    }
    return true;
  };

  // When component is initally loaded
  useEffect(() => {
    auth();
    dispatch(PLAYLIST_ACTIONS.setCurrentMode('normal'));

    playlistLoader.loadPlaylist();
    playlistLoader.loadSongs();
    loadAllSongs();
    if (!currentSongID) {
      dispatch(AUDIO_PLAYER_ACTIONS.setIsPlaying(false));
    }
  }, []);

  /*
  // TODO: this is a template for adding hotkeys
  // Need to find a way to remove them when you leave the page
  document.addEventListener(
    'keydown',
    (e) => {
      // Redirect to upload page if user presses 'u'
      if (e.key === 'u') {
        navigate('/songs/add', {
          state: { playlist },
        });
      }
    },
    false,
  );
  */

  let songsToShow = null;
  if (playlist) {
    if (mode.current === 'adding' && allSongs) {
      songsToShow = filterSongs(allSongs, query, songs ?? []);
    } else if (songs) {
      songsToShow = songs;
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
        center={isPlaylistLoading
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
          {songsToShow && songsToShow.map((song: Song, index) => (
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
