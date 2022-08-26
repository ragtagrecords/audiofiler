import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import React from 'react';
import {
  BsArrowLeftCircle,
  BsArrowRightCircle,
  BsPlayCircle,
  BsPauseCircle,
} from 'react-icons/bs';
import { ImLoop } from 'react-icons/im';
import { AUDIO_PLAYER_ACTIONS, AUDIO_PLAYER_SELECTORS } from '../audioPlayerSlice';
import './Controls.scss';

type ControlsProps = {
  skipSong: any;
  prevSong: any;
  isLooping: boolean;
  setIsLooping: any;
}

export const Controls = ({
  skipSong,
  prevSong,
  isLooping,
  setIsLooping,
}: ControlsProps) => {
  const isPlaying = useAppSelector(AUDIO_PLAYER_SELECTORS.selectIsPlaying);
  const dispatch = useAppDispatch();

  return (
    <span className="audioPlayerUI controls">
      <div style={{ width: 80, color: 'transparent' }}>
        shuffle
      </div>
      <button type="button" className="forwardBackward" id="backward" onClick={prevSong}>
        <BsArrowLeftCircle />
      </button>
      <button
        type="button"
        className="playPause"
        onClick={() => {
          dispatch(AUDIO_PLAYER_ACTIONS.setIsPlaying(!isPlaying));
        }}
      >
        {isPlaying ? <BsPauseCircle /> : <BsPlayCircle />}
      </button>
      <button type="button" className="forwardBackward" id="forward" onClick={skipSong}>
        <BsArrowRightCircle />
      </button>
      <button
        type="button"
        className="loop"
        onClick={() => {
          setIsLooping(!isLooping);
        }}
      >
        {isLooping ? <ImLoop id="isLooping" /> : <ImLoop />}
      </button>
    </span>
  );
};
