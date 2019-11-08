const express = require('express');
const taskController = require('./../controllers/taskController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(taskController.getAllTasks)
  .post(
    authController.restrictTo('user'),
    taskController.setUserIds,
    taskController.createtask
  );

router
  .route('/:id')
  .get(taskController.gettask)
  .patch(authController.restrictTo('user', 'admin'), taskController.updatetask)
  .delete(
    authController.restrictTo('user', 'admin'),
    taskController.deletetask
  );

module.exports = router;
