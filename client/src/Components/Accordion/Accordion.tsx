import React, { /* useContext */ } from 'react';
import { useAppSelector } from 'Hooks/hooks';
import { Droppable } from 'react-beautiful-dnd';
import { PLAYLIST_SELECTORS } from 'Pages/Playlist/PlaylistSlice';
import { LoadingSpinner } from 'Components/Common/LoadingSpinner/LoadingSpinner';
import listStyles from 'Styles/lists.module.scss';
import './Accordion.scss';

type AccordionProps = {
  children: React.ReactNode;
}

export const Accordion = ({ children } : AccordionProps) => {
  const songs = useAppSelector(PLAYLIST_SELECTORS.songs);
  const isSongsLoading = useAppSelector(PLAYLIST_SELECTORS.isSongsLoading);
  const mode = useAppSelector(PLAYLIST_SELECTORS.mode);

  if (isSongsLoading) {
    return (
      <div className="accordionContainer">
        <LoadingSpinner />
      </div>
    );
  }

  if (!songs && mode.current !== 'adding') {
    return <div className="accordionContainer"> No songs in this playlist yet, use three dots in upper right to add some</div>;
  }

  return (
    <div className={`accordionContainer ${listStyles.listContainer}`}>
      <Droppable droppableId="list-container">
        {(provided) => (
          <div
            className="accordion list-container"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {children}
            {provided.placeholder}
          </div>
        )}

      </Droppable>
    </div>

  );
};
