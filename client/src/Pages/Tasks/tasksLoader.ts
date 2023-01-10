// This class can be used to fetch data and store it in the redux state
// It's main purpose is to separate the data fetching logic from the components
import { useAppDispatch } from 'Hooks/hooks';
import { AppDispatch } from 'Hooks/store';
import { getTasks } from 'Services';
import { Task } from 'Types';
import { defaultColumns, TASK_ACTIONS } from './taskManagerSlice';

export class TaskLoader {
  private dispatch: AppDispatch;

  private songID: string;

  private tasks: Task[];

  constructor(songID: string) {
    this.dispatch = useAppDispatch();
    this.songID = songID;
    this.tasks = [];
  }

  private async mapTasksToColumns() {
    const columns = [...defaultColumns];

    // Load the tasks into appropriate column
    this.tasks.forEach((task) => {
      columns[task.stage] = {
        ...columns[task.stage],
        tasks: [...columns[task.stage].tasks, task],
      };
    });
    this.dispatch(TASK_ACTIONS.setColumns(columns));
  }

  // Attempt to load tasks from database into redux state
  public async loadTasksBySongID(songID: string) {
    this.dispatch(TASK_ACTIONS.setIsTasksLoading(true));
    const tasks = await getTasks(songID ?? null);

    if (!tasks) {
      this.dispatch(TASK_ACTIONS.setTasksError('No tasks found'));
      return false;
    }

    this.dispatch(TASK_ACTIONS.setTasks([...tasks]));
    this.tasks = [...tasks];
    this.mapTasksToColumns();
    return true;
  }

  // Reorders tasks within the columns when an item is dropped
  public handleDrop = (droppedItem: any) => {
    const { source, destination, draggableId } = droppedItem;
    // Ignore drop outside droppable container
    if (!this.tasks || !destination) {
      return false;
    }

    // Reorder 1 column if dropped in same column
    if (source.droppableId === destination.droppableId) {
      this.dispatch(TASK_ACTIONS.reorderColumn({
        columnIndex: source.droppableId,
        taskID: draggableId,
        position: destination.index,
      }));
    } else { // Remove from source and add to destination column
      this.dispatch(TASK_ACTIONS.moveBetweenColumns({
        sourceColumnIndex: source.droppableId,
        targetColumnIndex: destination.droppableId,
        taskID: parseInt(draggableId, 10),
        targetPosition: destination.index,
      }));
    }
    return true;
  };
}
