// This file defines the state and actions for the task manager in Redux
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Column, Task } from 'Types';
import type { RootState } from 'Hooks/store';
import { updateTasks } from 'Services';

interface TaskManagerState {
  allTasks: Task[];
  columns: Column[];
}

const initialState: TaskManagerState = {
  allTasks: [],
  columns: [
    {
      title: 'To Do',
      tasks: [],
    },
    {
      title: 'In Progress',
      tasks: [],
    },
    {
      title: 'Done',
      tasks: [],
    },
  ],
};

type ReorderColumnArgs = {
  columnIndex: number;
  taskID: string;
  position: number;
}

type MoveBetweenColumnsArgs = {
  taskID: number;
  sourceColumnIndex: number;
  targetColumnIndex: number;
  targetPosition: number;
};

export const taskManagerSlice = createSlice({
  name: 'taskManager',
  initialState,
  reducers: {
    setAllTasks: (state, action: PayloadAction<Task[]>) => {
      state.allTasks = action.payload;
    },
    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    // Updates position property based on new index in state
    reorderColumn: (state, action: PayloadAction<ReorderColumnArgs>) => {
      const tasks = state.columns[action.payload.columnIndex].tasks;
      if (tasks) {
        // Find and remove item with matching id
        let reorderedItem = null;
        for (let i = 0; i < tasks.length; i += 1) {
          if (String(tasks[i].id) === action.payload.taskID) {
            reorderedItem = tasks.splice(i, 1)[0];
            break;
          }
        }

        if (!reorderedItem) {
          console.log('Failed to reorder column');
          return;
        }

        // Place item in new position in array
        tasks.splice(action.payload.position, 0, reorderedItem);

        // Store new position in state
        for (let i = 0; i < tasks.length; i += 1) {
          tasks[i].position = i;
        }

        // Save new positions to db
        updateTasks(tasks);
      }
    },
    moveBetweenColumns: (state, { payload }: PayloadAction<MoveBetweenColumnsArgs>) => {
      const {
        taskID,
        sourceColumnIndex,
        targetColumnIndex,
        targetPosition,
      } = payload;
      const sourceTasks = state.columns[sourceColumnIndex].tasks;
      const targetTasks = state.columns[targetColumnIndex].tasks;
      if (!sourceTasks || !targetTasks) {
        console.log('Failed to move between columns');
        return;
      }

      // Find and remove item with matching id from source list
      let removedItem = null;
      for (let i = 0; i < sourceTasks.length; i += 1) {
        if (sourceTasks[i].id === taskID) {
          removedItem = sourceTasks.splice(i, 1)[0];
          break;
        }
      }

      if (!removedItem) {
        console.log('Failed to move between columns 2');
        return;
      }

      // Place item in new column
      targetTasks.splice(targetPosition, 0, removedItem);

      // Save new positions and stage for each task
      sourceTasks.forEach((task, index) => { task.position = index; });
      targetTasks.forEach((task, index) => {
        task.position = index;
        task.stage = targetColumnIndex;
      });

      // Save new positions to db
      updateTasks([...sourceTasks, ...targetTasks]);
    },
  },
});

// Actions are used for modifying the state
// Exports all the reducer functions inside taskManagerSlice
export const TASK_ACTIONS = {
  ...taskManagerSlice.actions,
};

// Selectors are used for checking the current state
export const TASK_SELECTORS = {
  selectAllTasks: (state: RootState) => state.taskManager.allTasks,
  selectColumns: (state: RootState) => state.taskManager.columns,
};

export default taskManagerSlice.reducer;
