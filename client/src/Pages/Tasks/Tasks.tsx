import React, { useEffect } from 'react';
import { TaskColumn, TaskCard, HeaderPortal } from 'Components';
import { DragDropContext } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { APP_ACTIONS } from 'Components/App/appSlice';
import { TASK_SELECTORS } from './taskManagerSlice';
import styles from './styles.module.scss';
import { TaskLoader } from './tasksLoader';

export const Tasks = () => {
  const { songID } = useParams<string>();
  const allTasks = useAppSelector(TASK_SELECTORS.allTasks);
  const columns = useAppSelector(TASK_SELECTORS.columns);
  const dispatch = useAppDispatch();

  if (!songID) {
    return <h1> No tasks found </h1>;
  }
  const taskLoader = new TaskLoader(songID);

  useEffect(() => {
    dispatch(APP_ACTIONS.setBackgroundColor('#212121'));
    taskLoader.loadTasksBySongID(songID);
  }, []);

  return (
    <>
      <HeaderPortal />
      <h1> Tasks </h1>
      <DragDropContext onDragEnd={taskLoader.handleDrop}>
        <div className={styles.container}>
          {allTasks.data && columns && columns.map(({ title, tasks }, colIndex) => {
            return (
              <TaskColumn key={title} title={title} index={colIndex}>
                {tasks.map((task, cardIndex) => {
                  return (
                    <TaskCard
                      key={`task-card-${task.id}`}
                      task={task}
                      index={cardIndex}
                    />
                  );
                })}
              </TaskColumn>
            );
          })}
        </div>
      </DragDropContext>
    </>
  );
};
