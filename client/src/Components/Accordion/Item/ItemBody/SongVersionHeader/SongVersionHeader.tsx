import React from 'react';
import { Song } from 'Types';
import { deleteSongFromDB, updateSong } from 'Services';
import './styles.scss';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { AUDIO_PLAYER_ACTIONS } from 'Components/AudioPlayer/audioPlayerSlice';
import { IconButton } from 'Components/Common/IconButton/IconButton';
import { PLAYLIST_SELECTORS } from 'Pages/Playlist/playlistSlice';
import { PlaylistLoader } from 'Pages/Playlist/playlistLoader';

type SongVersionHeaderProps = {
  song: Song;
  hasVersions: boolean;
}

export const SongVersionHeader = ({ song, hasVersions }: SongVersionHeaderProps) => {
  const songs = useAppSelector(PLAYLIST_SELECTORS.songs);
  const playlist = useAppSelector(PLAYLIST_SELECTORS.playlist);
  const dispatch = useAppDispatch();
  const playlistLoader = new PlaylistLoader();

  if (!playlist.data) {
    console.log('ERROR: No playlist found');
    return null;
  }

  playlistLoader.setPlaylistID(playlist.data.id.toString());

  if (!song || !song.id) {
    console.log('ERROR: No song found');
    return null;
  }

  return (
    <div className="song-version-header">
      <section className="title">
        {song.name}
      </section>
      <section className="icons">
        <IconButton
          type="play"
          size="20px"
          onClick={() => {
            if (song.id && songs.data) {
              dispatch(AUDIO_PLAYER_ACTIONS.setCurrentSongID({
                songID: song.id,
                playlistSongs: songs.data,
                shouldPlay: true,
              }));
            }
          }}
        />
        {!song.isParent && hasVersions
          && (
          <>
            <IconButton
              type="crown"
              size="20px"
              tooltipText="Promote to main version"
              onClick={async () => {
                const updatedSong = { ...song };
                updatedSong.isParent = true;
                await updateSong(updatedSong);
                await playlistLoader.loadSongs();
              }}
            />
            <IconButton
              type="remove"
              size="20px"
              tooltipText="Delete version"
              onClick={async () => {
                const confirmDeletion = confirm('Are you sure you want to delete this version?');
                if (!confirmDeletion) {
                  console.log('Failed to remove version');
                  return false;
                }
                await deleteSongFromDB(song.id) ? playlistLoader.loadSongs() : console.log('Failed to remove version');
                return true;
              }}
            />
          </>
          )}
      </section>
    </div>
  );
};
