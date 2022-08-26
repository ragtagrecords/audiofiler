import React, { useState } from 'react';
import { Player, Controls, CurrentPosition } from 'Components';
import { Song } from 'Types';
import { fileServerURL } from 'env';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { AUDIO_PLAYER_ACTIONS, AUDIO_PLAYER_SELECTORS } from './audioPlayerSlice';
import './AudioPlayer.scss';

export const AudioPlayer = () => {
  // Time is tracked in seconds
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0); // controlled by audio player
  const [seekTime, setSeekTime] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const isPlaying = useAppSelector(AUDIO_PLAYER_SELECTORS.isPlaying);
  const song = useAppSelector(AUDIO_PLAYER_SELECTORS.currentSong);

  return (
    <div className="audioPlayer">
      {song && song.path
          && (
          <Player
            src={`${fileServerURL()}/songs/${song.path}`}
            isPlaying={isPlaying}
            skipSong={() => {
              dispatch(AUDIO_PLAYER_ACTIONS.changeSongByRelativeIndex(-1));
            }}
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
        isLooping={isLooping}
        setIsLooping={setIsLooping}
      />
    </div>
  );
};
