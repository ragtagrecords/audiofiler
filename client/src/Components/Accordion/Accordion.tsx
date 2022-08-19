import React, { /* useContext */ } from 'react';
import { useAppSelector } from 'Hooks/hooks';
import { Droppable } from 'react-beautiful-dnd';
import { PLAYLIST_SELECTORS } from 'Pages/Playlist/PlaylistSlice';
import { LoadingSpinner } from 'Components/Common/LoadingSpinner/LoadingSpinner';
import './Accordion.scss';

type AccordionProps = {
  children: React.ReactNode;
}

export const Accordion = ({ children } : AccordionProps) => {
  const playlist = useAppSelector(PLAYLIST_SELECTORS.selectPlaylist);
  const isLoading = useAppSelector(PLAYLIST_SELECTORS.selectIsLoading);
  const mode = useAppSelector(PLAYLIST_SELECTORS.selectMode);

  if (isLoading) {
    return (
      <div className="accordionContainer">
        <LoadingSpinner />
      </div>
    );
  }

  if (playlist === null && mode.current !== 'adding') {
    return <div className="accordionContainer"> No songs in this playlist yet, use three dots in upper right to add some</div>;
  }

  return (
    <div className="accordionContainer listContainer">
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
