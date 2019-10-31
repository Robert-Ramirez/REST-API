const express = require('express');
const taskController = require('./../controllers/taskController');

const router = express.Router();

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

  router
  .route('/top-5')
  .get(tourController.aliasTopTasks, tourController.getAllTours);

router.route('/tasks-stats').get(tourController.getTaskStats);


module.exports = router;
