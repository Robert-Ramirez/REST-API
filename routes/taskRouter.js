const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

router
  .route('/')
  .get(taskController.gettasks)
  .post(taskController.createTasks);

router
  .route('/:id')
  .get(taskController.getTasksById)
  .put(taskController.updateTasksPut)
  .patch(taskController.updateTasksPatch)
  .delete(taskController.deleteTasks);

module.exports = router;
