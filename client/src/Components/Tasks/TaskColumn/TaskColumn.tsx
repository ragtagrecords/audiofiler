import React, { useEffect, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styles from './styles.module.scss';

type TaskColumnProps = {
  children: React.ReactNode;
  title: string;
  index: number;
};

// TODO: this isnt rerendering properly
export const TaskColumn = ({ children, title, index }: TaskColumnProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div className={styles.columnContainer}>
      <h2>{title}</h2>
      <Droppable droppableId={`${index}`}>
        {(provided) => (
          <>
            <div
              className={styles.cardsContainer}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {children}
              {provided.placeholder}
            </div>
          </>
        )}
      </Droppable>
    </div>

  );
};
