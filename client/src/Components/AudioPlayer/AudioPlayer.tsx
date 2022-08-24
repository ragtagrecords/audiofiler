import React, { useState } from 'react';
import { Player, Controls, CurrentPosition } from 'Components';
import { Song } from 'Types';
import './AudioPlayer.scss';

type AudioPlayerProps = {
    song: Song | null,
    skipSong: any,
    prevSong: any,
}

export const AudioPlayer = ({ song, skipSong, prevSong }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // Time is tracked in seconds
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0); // controlled by audio player
  const [seekTime, setSeekTime] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(false);

  return (
    <div className="audioPlayer">
      {song && song.path
          && (
          <Player
            src={song.path}
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
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        skipSong={skipSong}
        isLooping={isLooping}
        setIsLooping={setIsLooping}
      />
    </div>
  );
};
