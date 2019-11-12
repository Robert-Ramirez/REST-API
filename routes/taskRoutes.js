const express = require('express');
const taskController = require('./../controllers/taskController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(authController.restrictTo('user', 'admin'), taskController.createTask);

router
  .route('/:taskId')
  .get(taskController.getTask)
  .patch(authController.restrictTo('user', 'admin'), taskController.updateTask)
  .delete(
    authController.restrictTo('user', 'admin'),
    taskController.deleteTask
  );

module.exports = router;
