import React from 'react';
import { SongFieldset, LoadingSpinner } from 'Components';
import { Song } from 'Types';

type SongsFieldsProps = {
  songs: Song[] | null;
  isLoading: boolean;
  updateSongsState: any;
}

export const SongsFieldList = ({
  songs,
  isLoading,
  updateSongsState,
}: SongsFieldsProps) => {
  if (!songs || !songs[0].file) { return isLoading ? <LoadingSpinner /> : null; }

  return (
    <>
      {songs.map((song : Song, i) => {
        if (!song.file) { return <p>Song failed to load</p>; }
        return (
          <SongFieldset
            key={song.file.name + i}
            index={i.toString()}
            song={song}
            updateSongsState={updateSongsState}
          />
        );
      })}
    </>
  );
};
