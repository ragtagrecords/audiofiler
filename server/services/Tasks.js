const { sqlInsert, sqlSelect, sqlUpdate, sqlDelete } = require('../services/Db.js');

const defColumns = [
  'task.stage',
  'task.name',
  'task.description',
  'task.songID',
  'task.parentID',
  'task.position',
];

const allColumns = [
  ...defColumns,
  'task.id', 
  'task.createTimestamp'
];

async function addTask(db, task) {
  const { stage, name, description, songID, parentTaskID } = task;

    if (!name || !songID) {
        console.log('ERROR: Task must have name and songID');
        return false;
    }

    return sqlInsert(
        db,
        'task',
        defColumns,
        [
            stage,
            name,
            description ? description : null,
            songID ? songID : null,
            parentTaskID ? parentTaskID : null,
        ]
    );
}

async function getAllTasks(db) {
  if (!db) {
      return false;
  }

  return sqlSelect(
      db,
      'task',
      allColumns,
      null,
      null,
  );
}

async function getTasksByID(db, id = null, songID = null, parentID = null) {
  if (!db || (!id && !songID && !parentID)) {
    return false;
  }

  let whereClause = null;
  let whereValue = null;
  if (id) {
    whereClause = 'WHERE id = ? ORDER BY position';
    whereValue = [id];
  } else if (songID) {
    whereClause = 'WHERE songID = ? ORDER BY position';
    whereValue = [songID];
  } else if (parentID) {
    whereClause = 'WHERE parentID = ? ORDER BY position';
    whereValue = [parentID];
  }

  return sqlSelect(
      db,
      'task',
      allColumns,
      whereClause,
      whereValue,
  );
}

async function updateTask(db, id, task) {

  if (!db || !task || !id) {
      console.log('ERROR: Task and ID required to update task');
      return false;
  }

  // ID and createTimestamp should not be updated
  if (task.id) { delete task.id }
  if (task.createTimestamp) { delete task.createTimestamp }

  return sqlUpdate(
      db,
      'task',
      'WHERE id = ?',
      task,
      [id]
  );
}

async function deleteTaskByID(db, id) {
  if (!db || !id) {
      return false;
  }

  return sqlDelete(
      db,
      'task',
      'WHERE id = ?',
      [id],
  );
}

module.exports = {
  addTask,
  getAllTasks,
  getTasksByID,
  updateTask,
  deleteTaskByID,
};
