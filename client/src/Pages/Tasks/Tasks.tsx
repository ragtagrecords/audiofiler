import React, { useContext, useEffect } from 'react';
import { TaskColumn, TaskCard } from 'Components';
import { DragDropContext } from 'react-beautiful-dnd';
import { AppCtx } from 'Components/App/App';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'Hooks/hooks';
import { getTasks } from 'Services';
import { TASK_SELECTORS, TASK_ACTIONS } from './taskManagerSlice';
import styles from './styles.module.scss';

export const Tasks = () => {
  const { songID } = useParams<string>();
  const appContext = useContext(AppCtx);
  const allTasks = useAppSelector(TASK_SELECTORS.allTasks);
  const columns = useAppSelector(TASK_SELECTORS.columns);
  const dispatch = useAppDispatch();

  // TODO: move all this logic to the reducer, saga or thunk i guess
  const loadTasks = async () => {
    const tasks = await getTasks(songID ?? null);

    if (!tasks) {
      return false;
    }

    dispatch(TASK_ACTIONS.setAllTasks(tasks));
    const updatedColumns = [...columns];

    // Clear tasks from columns
    for (let i = 0; i < updatedColumns.length; i += 1) {
      updatedColumns[i] = {
        ...updatedColumns[i],
        tasks: [],
      };
    }

    // Load the tasks into appropriate column
    tasks.forEach((task) => {
      updatedColumns[task.stage].tasks.push(task);
    });
    dispatch(TASK_ACTIONS.setColumns(updatedColumns));
    return true;
  };

  // Reorders tasks within the columns when an item is dropped
  const handleDrop = (droppedItem: any) => {
    const { source, destination, draggableId } = droppedItem;
    // Ignore drop outside droppable container
    if (!allTasks || !destination) {
      return false;
    }

    // Reorder 1 column if dropped in same column
    if (source.droppableId === destination.droppableId) {
      dispatch(TASK_ACTIONS.reorderColumn({
        columnIndex: source.droppableId,
        taskID: draggableId,
        position: destination.index,
      }));
    } else { // Remove from source and add to destination column
      dispatch(TASK_ACTIONS.moveBetweenColumns({
        sourceColumnIndex: source.droppableId,
        targetColumnIndex: destination.droppableId,
        taskID: parseInt(draggableId, 10),
        targetPosition: destination.index,
      }));
    }
    return true;
  };

  useEffect(() => {
    appContext?.setBackgroundColor('#212121');
    loadTasks();
  }, []);

  return (
    <>
      <h1> Tasks </h1>
      <DragDropContext onDragEnd={handleDrop}>
        <div className={styles.container}>
          {allTasks && columns && columns.map(({ title, tasks }, colIndex) => {
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
