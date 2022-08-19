import axios from 'axios';
import { apiBaseURL } from 'env';
import { Task } from 'Types';

// Returns null if there are no results or an error
export const getTasks = async (songID: string | null = null): Promise<Task[]> => {
  // By default, gets all the tasks
  let endpoint = '/tasks';

  // Get tasks for a specific song
  if (songID) {
    endpoint = `/tasks/song/${songID}`;
  }

  try {
    const res = await axios.get(
      `${apiBaseURL()}${endpoint}`,
    );
    return res.data.length ? res.data : [];
  } catch (e) {
    return [];
  }
};

export const updateTask = async (task: Task) => {
  if (!task.id) {
    console.log('Task ID is required');
    return false;
  }

  const url = `${apiBaseURL()}/tasks/${task.id}`;
  delete task.id;

  if (Object.keys.length === 0) {
    console.log('No fields to update');
    return false;
  }

  const payload = new FormData();
  payload.append('task', JSON.stringify(task));

  try {
    await axios.put(url, payload);
    return true;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};

// Helpers

export const updateTasks = (tasks: Task[]) => {
  // Save to db
  tasks.forEach((task) => {
    updateTask({ ...task });
  });
};
