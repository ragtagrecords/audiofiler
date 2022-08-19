const DbSvc = require('../services/Db.js');
const TaskSvc = require('../services/Tasks.js');

exports.addTask = (async function (req ,res) {
  let task = null;

  // Requests from React App must be parsed from JSON
  try {
      task = await JSON.parse(req.body.task);
  } catch(ex) { // Requests from Python do not
      task = req.body.task
  }

  // Return if required fields are null
  if (!task || !task.songID || !task.name) {
      res.status(500).send({ message: "Song ID and name are required"});
      return;
  }

  const db = await DbSvc.connectToDB();
  let newTaskID = await TaskSvc.addTask(db, task);

  if (!newTaskID) {
      db.end();
      res.status(404).send({message: 'Failed to add task'});
      return;
  }

  db.end();
  res.status(200).send({newTaskID})
  return;
})

exports.getAllTasks = (async function (req, res) {
  const db = await DbSvc.connectToDB();
  const tasks = await TaskSvc.getAllTasks(db);
  db.end();

  if(tasks) {
    res.status(200).send(tasks);
    return true;
  } else {
    res.status(404).send({ message: "Couldn't get tasks"});
    return false;
  }
})

exports.getTaskByID = (async function (req, res) {
  const db = await DbSvc.connectToDB();
  const id = req.params.id;
  const task = await TaskSvc.getTasksByID(db, id);
  db.end();

  if(task) {
    res.status(200).send(task);
    return true;
  } else {
    res.status(404).send({ message: "Couldn't get task"});
    return false;
  }
})

exports.getTasksBySongID = (async function (req, res) {
  const db = await DbSvc.connectToDB();
  const songID = req.params.songID;
  const tasks = await TaskSvc.getTasksByID(db, null, songID);
  db.end();

  if(tasks) {
    res.status(200).send(tasks);
    return true;
  } else {
    res.status(404).send({ message: "Couldn't get tasks"});
    return false;
  }
})

exports.updateTask = (async function (req ,res) {
  const id = req.params.id;
  let task = null;

  // Requests from React App need to be parsed from JSON
  try {
      task = await JSON.parse(req.body.task);
  } catch(ex) { // Requests from Python do not
      task = req.body.task
  }

  if (!task || !id) {
      res.status(404).send({message: 'No task object found in request body'});
      return false;
  }

  const db = await DbSvc.connectToDB();

  // Attempt to update in DB
  let updatedTask = await TaskSvc.updateTask(db, id, task);
  db.end();

  const response = updatedTask 
  ? { message: `Task (${id}) was updated`, data: updatedTask}
  : { message: `Couldn't update task ${id}`};
  res.status(200).send({
    success: updatedTask ? true : false,
    message: updatedTask ? `Task (${id}) was updated` : `Couldn't update task ${id}`,
    data: updatedTask
  });
  return true;
})

exports.deleteTask = (async function (req, res) {
  const id = req.params.id;

  const db = await DbSvc.connectToDB();
  db.beginTransaction();
  const taskDeleted = await TaskSvc.deleteTaskByID(db, id);

  if (!taskDeleted) {
    db.rollback();
    db.end();
    res.status(404).send({ message: `Failed to delete task`});
    return false;
  }

  const subtasks = await TaskSvc.getTasksByID(db, null, null, id);

  if (subtasks) {
    try {
      for (let i = 0; i < subtasks.length; i++) {
        await TaskSvc.deleteTaskByID(db, subtasks[i].id);
      }
    } catch (e) {
      db.rollback();
      db.end();
      res.status(404).send({ message: `Failed to delete subtasks`});
      return false;
    }
  }

  db.commit();
  db.end();
  res.status(200).send({ message: `Task ${id} deleted`});
  return true;
})
