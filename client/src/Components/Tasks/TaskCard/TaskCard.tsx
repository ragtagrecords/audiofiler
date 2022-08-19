import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task } from 'Types';
import styles from './styles.module.scss';

type TaskCardProps = {
  task: Task;
  index: number;
};

export const TaskCard = ({ task, index }: TaskCardProps) => {
  const { name, description } = task;

  return (
    <Draggable key={`${task.id}`} draggableId={String(task.id)} index={index}>
      {(provided) => (
        <div
          className={`${styles.container}`}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
          {...provided.draggableProps}
        >
          <h3>{name}</h3>
          <hr />
          <p>{description}</p>
        </div>
      )}
    </Draggable>
  );
};
