const express = require('express');
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protect all routes after this middleware
router.use(authController.protect);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:userId')
  .get(userController.getAllUsers)
  .get(userController.getUser)
  .put(userController.updateUserPut)
  .patch(userController.updateUserPatch)
  .delete(userController.deleteUser);

module.exports = router;
