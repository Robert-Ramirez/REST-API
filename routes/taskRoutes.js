const express = require('express');
const taskController = require('../controllers/taskController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
  .route('/:userId/tasks')
  .get(authController.restrictTo('user', 'admin'), taskController.gettasks)
  .post(authController.restrictTo('user'), taskController.createTasks);

router
  .route('/:userId/tasks/:taskId')
  .get(taskController.getTasksById)
  .put(
    authController.restrictTo('user', 'admin'),
    taskController.updateTasksPut
  )
  .patch(
    authController.restrictTo('user', 'admin'),
    taskController.updateTasksPatch
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    taskController.deleteTasks
  );

module.exports = router;
