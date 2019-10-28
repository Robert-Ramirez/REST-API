const express = require('express');
const taskController = require('./../controllers/taskController');

const router = express.Router();

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(taskController.createTask)
  .put(taskController.putTask);

router
  .route('/:id')
  .get(taskController.getTask)
  .patch(taskController.patchTask)
  .delete(taskController.deleteTask);

module.exports = router;
