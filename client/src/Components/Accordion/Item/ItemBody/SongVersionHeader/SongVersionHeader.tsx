import React, { useContext, useEffect, useState } from 'react';
import { Song } from 'Types';
import { deleteSongFromDB, getSongs, updateSong } from 'Services';
import './styles.scss';
import { useAppDispatch } from 'Hooks/hooks';
import { AUDIO_PLAYER_ACTIONS } from 'Components/AudioPlayer/audioPlayerSlice';
import { IconButton } from 'Components/Common/IconButton/IconButton';
import { ItemCtx } from '../../Item';

type SongVersionHeaderProps = {
  song: Song;
}

export const SongVersionHeader = ({ song }: SongVersionHeaderProps) => {
  // const [songs, setSongs] = useState<Song[] | null>(null);
  const itemContext = useContext(ItemCtx);
  const dispatch = useAppDispatch();
  if (!itemContext) {
    return null;
  }

  const { playlist } = itemContext;

  if (!song || !song.id) {
    console.log('ERROR: No song found');
    return null;
  }

  // TODO: Recall loadPlaylist() after promoting or removing a version
  return (
    <div className="song-version-header">
      {song.name}
      <IconButton
        type="play"
        size="15px"
        onClick={() => {
          if (song.id && playlist.songs) {
            dispatch(AUDIO_PLAYER_ACTIONS.setCurrentSongID({
              songID: song.id,
              playlistSongs: playlist.songs,
              shouldPlay: true,
            }));
          }
        }}
      />
      <IconButton
        type="crown"
        size="15px"
        onClick={() => {
          const updatedSong = { ...song };
          updatedSong.isParent = true;
          updateSong(updatedSong);
        }}
      />
      <IconButton
        type="remove"
        size="15px"
        onClick={async () => {
          const confirmDeletion = confirm('Are you sure you want to delete this version?');
          if (confirmDeletion) {
            const songWasDeleted = await deleteSongFromDB(song.id);
            if (songWasDeleted) {
              console.log('deleted');
              return true;
            }
          }

          console.log('Failed to delete song');
          return false;
        }}
      />
    </div>
  );
};
