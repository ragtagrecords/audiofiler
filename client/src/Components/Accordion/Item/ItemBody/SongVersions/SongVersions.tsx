import React, { useContext, useEffect, useState } from 'react';
import { Song } from 'Types';
import { getSongs } from 'Services';
import './SongVersions.scss';
import { useAppDispatch } from 'Hooks/hooks';
import { AUDIO_PLAYER_ACTIONS } from 'Components/AudioPlayer/audioPlayerSlice';
import { IconButton } from 'Components/Common/IconButton/IconButton';
import { ItemCtx } from '../../Item';

type SongVersionsProps = {
  parentID: number;
}

export const SongVersions = ({ parentID }: SongVersionsProps) => {
  const [songs, setSongs] = useState<Song[] | null>(null);
  const itemContext = useContext(ItemCtx);
  const dispatch = useAppDispatch();
  if (!itemContext) {
    return null;
  }

  const { playlist } = itemContext;

  const getSongVersions = async () => {
    const tempSongs = await getSongs(null, parentID.toString(10));
    if (!tempSongs) {
      console.log("Couldn't retrieve different versions of the parent song");
      return false;
    }
    setSongs(tempSongs);
    return true;
  };

  useEffect(() => {
    getSongVersions();
  }, []);

  if (!songs) {
    return <div> No versions found</div>;
  }

  return (
    <>
      <ul className="songVersionsList">
        {songs.map((song) => {
          return (
            <>
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
              <button
                type="button"
                onClick={() => {
                  if (song.id && playlist.songs) {
                    dispatch(AUDIO_PLAYER_ACTIONS.setCurrentSongID({
                      songID: song.id,
                      playlistSongs: playlist.songs,
                    }));
                  }
                }}
                className="songVersionButton"
                key={`version-link-${song.id}`}
              >
                {song.name}
              </button>
            </>

          );
        })}
      </ul>
    </>
  );
};
