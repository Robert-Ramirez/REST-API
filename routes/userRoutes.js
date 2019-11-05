const express = require('express');
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/').post(userController.createUser);

router
  .route('/:userId')
  .get(authController.restrictTo('admin'), userController.getAllUsers)
  .get(authController.restrictTo('user', 'admin'), userController.getUser)
  .put(authController.restrictTo('user', 'admin'), userController.updateUserPut)
  .patch(
    authController.restrictTo('user', 'admin'),
    userController.updateUserPatch
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    userController.deleteUser
  );

module.exports = router;
