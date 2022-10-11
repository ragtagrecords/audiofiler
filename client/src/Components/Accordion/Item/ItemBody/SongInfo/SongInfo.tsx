import React, { useContext } from 'react';
import { PLAYLIST_SELECTORS } from 'Pages/Playlist/PlaylistSlice';
import { useAppSelector } from 'Hooks/hooks';
import { InfoCard } from 'Components/Common/InfoCard/InfoCard';
import { ItemCtx } from '../../Item';
import './styles.scss';

export const SongInfo = () => {
  const itemContext = useContext(ItemCtx);
  const mode = useAppSelector(PLAYLIST_SELECTORS.mode);

  if (!itemContext) {
    console.log('no context');
    return null;
  }

  const {
    song,
    setEditedSong,
  } = itemContext;

  return (
    <>
      <section className="song-info">
        <InfoCard
          title="Tempo"
          info={song.tempo?.toString() ?? '???'}
          isEditable={mode.current === 'editing'}
          onChange={(e) => {
            const editedSong = { ...song };
            editedSong.tempo = parseInt(e.target.value, 10);
            setEditedSong(editedSong);
          }}
        />
        <InfoCard
          title="Key"
          info="???"
          isEditable={false}
          onChange={() => {
            console.log('no functionality for changing key yet');
          }}
        />
      </section>
      <hr />
      <section className="song-info">
        <InfoCard
          title="Notes"
          info={song.notes ?? 'lots and lots of noteslots and lots of noteslots and lots of noteslots and lots of notes'}
          isEditable={false}
          isLarge={true}
          onChange={() => {
            console.log('no functionality for changing key yet');
          }}
        />
      </section>
    </>

  );
};

/*

// TODO: add notes
<p>
        <span>notes: </span>
        {mode.current === 'editing' ? (
          <textarea
            className="big"
            value={song.notes ?? ''}
            onChange={(e) => {
              const editedSong = { ...song };
              editedSong.notes = e.target.value;
              setEditedSong(editedSong);
            }}
          />
        ) : (
          <span> {song.notes} </span>
        )}
      </p>

*/
