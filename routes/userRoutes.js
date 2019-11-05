const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:userId')
  .get(userController.getUser)
  .put(userController.updateUserPut)
  .patch(userController.updateUserPatch)
  .delete(userController.deleteUser);

module.exports = router;
