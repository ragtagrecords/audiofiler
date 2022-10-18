import React, { useContext, useEffect, useState } from 'react';
import { Song } from 'Types';
import { getSongs } from 'Services';
import './styles.scss';
import { useAppDispatch } from 'Hooks/hooks';
import { AUDIO_PLAYER_ACTIONS } from 'Components/AudioPlayer/audioPlayerSlice';
import { IconButton } from 'Components/Common/IconButton/IconButton';
import { removeSongFromPlaylist } from 'Services/PlaylistSvc';
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

  if (!song) {
    console.log('ERROR: No song found');
    return null;
  }

  // TODO: include DownloadableOptions as a part of this component, sort files by version
  return (
    <div className="song-version-header">
      {song.name}
      <IconButton
        type="play"
        onClick={() => {
          if (song.id && playlist.songs) {
            dispatch(AUDIO_PLAYER_ACTIONS.setCurrentSongID({
              songID: song.id,
              playlistSongs: playlist.songs,
            }));
          }
        }}
      />
      <IconButton
        type="crown"
        onClick={() => {
          console.log('promote to main version');
        }}
      />
      <IconButton
        type="remove"
        onClick={() => {
          if (song.id) {
            removeSongFromPlaylist(song.id, playlist.id);
          } else {
            console.log('Failed to remove from playlist');
          }
        }}
      />
    </div>
  );
};
