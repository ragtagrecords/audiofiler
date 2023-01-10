import React, { useEffect } from 'react';
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
  updatePlaylist,
  updateSongPlaylist,
} from 'Services';
import { filterSongs } from 'helpers';
import { AUDIO_PLAYER_ACTIONS, AUDIO_PLAYER_SELECTORS } from 'Components/AudioPlayer/audioPlayerSlice';
import { APP_SELECTORS } from 'Components/App/appSlice';
import { PLAYLIST_SELECTORS, PLAYLIST_ACTIONS } from './playlistSlice';
import { PlaylistLoader } from './playlistLoader';

type PlaylistParams = {
  playlistID: string;
}

export const Playlist = () => {
  // Get playlistID from query params
  const { playlistID } = useParams<PlaylistParams>();

  // State from redux
  const allSongs = useAppSelector(AUDIO_PLAYER_SELECTORS.allSongs);
  const currentSongID = useAppSelector(AUDIO_PLAYER_SELECTORS.currentSongID);
  const playlist = useAppSelector(PLAYLIST_SELECTORS.playlist);
  const songs = useAppSelector(PLAYLIST_SELECTORS.songs);
  const query = useAppSelector(PLAYLIST_SELECTORS.query);
  const mode = useAppSelector(PLAYLIST_SELECTORS.mode);
  const user = useAppSelector(APP_SELECTORS.user);
  const dispatch = useAppDispatch();

  if (!playlistID) {
    return (<div>No playlistID found</div>);
  }

  const playlistLoader = new PlaylistLoader(playlistID);

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

  const changePlaylistName = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!playlist.data || !playlist.data.name) { console.log("ERROR: Couldn't update playlist name"); return false; }
    const emptyString = playlist.data.name === '';
    const startsWithSpace = playlist.data.name.length > 0 && playlist.data.name[0] === ' ';
    const endsWithSpace = playlist.data.name.length > 0 && playlist.data.name.slice(-1) === ' ';

    if (emptyString) {
      alert('Playlist name can not be empty.');
    } else if (startsWithSpace || endsWithSpace) {
      alert('Playlist name can not start or end with spaces.');
    } else if (playlist.data) {
      alert('Name updated successfully.');
      return !!updatePlaylist(playlist.data);
    }
    return false;
  };

  const saveChangesToSongPositions = () => {
    if (!playlist || !songs.data) { return; }
    for (let i = 0; i < songs.data.length; i += 1) {
      if (songs.data[i].id) {
        const song = songs.data[i];
        if (song.id && playlist.data) {
          const success = updateSongPlaylist({
            songID: song.id,
            playlistID: playlist.data.id,
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
    if (!playlist || !songs.data || !droppedItem.destination) {
      return false;
    }

    const updatedPlaylistSongs = [...songs.data];
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
    dispatch(PLAYLIST_ACTIONS.setCurrentMode('normal'));
    playlistLoader.loadPlaylist();
    playlistLoader.loadSongs();
    if (!currentSongID) {
      dispatch(AUDIO_PLAYER_ACTIONS.setIsPlaying(false));
    }
  }, []);

  let songsToShow: Song[] | null = null;
  if (playlist) {
    if (mode.current === 'adding' && allSongs && allSongs.songs) {
      songsToShow = filterSongs(allSongs.songs, query, songs.data ?? []);
    } else if (songs) {
      songsToShow = songs.data;
    }
  }

  return (
    <>
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
        center={playlist.isLoading
          ? (null)
          : (
            <EditableTitle
              value={playlist?.data?.name ?? ''}
              isEditable={!!user}
              onChange={(e) => {
                const updatedPlaylist = { ...playlist.data } as PlaylistT;
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
    </>
  );
};

/*
  // this is a template for adding hotkeys
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
