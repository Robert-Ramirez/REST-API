const express = require('express');
const taskController = require('./../controllers/taskController');

const router = express.Router();

router.route('/task-stats').get(taskController.getTaskStats);

router
  .route('/top-5')
  .get(taskController.aliasTopTasks, taskController.getAllTasks);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route('/:id')
  .get(taskController.getTask)
  .put(taskController.putTask)
  .patch(taskController.patchTask)
  .delete(taskController.deleteTask);

module.exports = router;
