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
import { changePlaylistName } from 'Services';
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
  const playlistLoader = new PlaylistLoader();

  if (!playlistID) {
    return (<div>No playlistID found</div>);
  }

  playlistLoader.setPlaylistID(playlistID);

  // Used for 3 dots in upper right of page
  const menuOptions: MenuOption[] = [
    {
      href: '/songs/add',
      text: 'Upload songs',
      state: { playlist: playlist.data },
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
              onClick={playlistLoader.saveChangesToSongPositions}
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
              onSubmit={(e) => {
                e.preventDefault();
                if (!playlist.data) {
                  return;
                }
                changePlaylistName(playlist.data);
              }}
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

      <DragDropContext onDragEnd={playlistLoader.handleDrop}>
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
