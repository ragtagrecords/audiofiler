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
  isLooping: boolean;
  setIsLooping: any;
}

export const Controls = ({
  isLooping,
  setIsLooping,
}: ControlsProps) => {
  const isPlaying = useAppSelector(AUDIO_PLAYER_SELECTORS.isPlaying);
  const dispatch = useAppDispatch();

  return (
    <span className="audioPlayerUI controls">
      <div style={{ width: 80, color: 'transparent' }}>
        shuffle
      </div>
      <button
        type="button"
        className="forwardBackward"
        id="backward"
        onClick={() => {
          dispatch(AUDIO_PLAYER_ACTIONS.changeSongByRelativeIndex(-1));
        }}
      >
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
      <button
        type="button"
        className="forwardBackward"
        id="forward"
        onClick={() => {
          dispatch(AUDIO_PLAYER_ACTIONS.changeSongByRelativeIndex(1));
        }}
      >
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
