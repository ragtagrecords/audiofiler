import React from 'react';
import { Playlist } from 'Types';
import { useLocation } from 'react-router-dom';
import {
  HeaderPortal,
  UserMenu,
  AddSongsForm,
} from 'Components';

type LocationState = {
  playlist?: Playlist;
}

export const AddSongs = () => {
  const location = useLocation();
  const state = location.state as LocationState;

  return (
    <>
      <HeaderPortal right={<UserMenu options={[]} />} />
      {state && state.playlist
        ? <AddSongsForm playlist={state.playlist ? state.playlist : undefined} />
        : <AddSongsForm />}
    </>
  );
};
