const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

router
  .route('/:userId/tasks')
  .get(taskController.gettasks)
  .post(taskController.createTasks);

router
  .route('/:userId/tasks/:taskId')
  .get(taskController.getTasksById)
  .put(taskController.updateTasksPut)
  .patch(taskController.updateTasksPatch)
  .delete(taskController.deleteTasks);

module.exports = router;
