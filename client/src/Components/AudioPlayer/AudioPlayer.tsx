import React, { useState } from 'react';
import { Player, Controls, CurrentPosition } from 'Components';
import { Song } from 'Types';
import './AudioPlayer.scss';
import { fileServerURL } from 'env';
import { useAppSelector } from 'Hooks/hooks';
import { AUDIO_PLAYER_SELECTORS } from './audioPlayerSlice';

type AudioPlayerProps = {
    song: Song | null,
    skipSong: any,
    prevSong: any,
}

export const AudioPlayer = ({ song, skipSong, prevSong }: AudioPlayerProps) => {
  // Time is tracked in seconds
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0); // controlled by audio player
  const [seekTime, setSeekTime] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  const isPlaying = useAppSelector(AUDIO_PLAYER_SELECTORS.selectIsPlaying);

  return (
    <div className="audioPlayer">
      {song && song.path
          && (
          <Player
            src={`${fileServerURL()}/songs/${song.path}`}
            isPlaying={isPlaying}
            skipSong={skipSong}
            seekTime={seekTime}
            onTimeUpdate={(e: React.ChangeEvent<HTMLAudioElement>) => {
              setCurrentTime(e.target.currentTime);
            }}
            onLoadedMetadata={(e: React.ChangeEvent<HTMLAudioElement>) => {
              setDuration(e.target.duration);
            }}
            isLooping={isLooping}
          />
          )}

      <span className="audioPlayerUI name">
        {song?.name ?? 'No song selected'}
      </span>

      <CurrentPosition
        duration={duration}
        currentTime={currentTime}
        setSeekTime={setSeekTime}
      />

      <Controls
        prevSong={prevSong}
        skipSong={skipSong}
        isLooping={isLooping}
        setIsLooping={setIsLooping}
      />
    </div>
  );
};
