const express = require('express')
const { body } = require('express-validator')
const User = require('../models/user')
const authController = require('../controller/auth')
const isAuth = require('../middleware/is-auth')

const router = express.Router()
router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please Enter valid Email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('E-mail address is already exists')
          }
        })
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  authController.signup
)

router.post('/login', authController.login)

router.get('/status', isAuth, authController.getUserStatus)

router.patch(
  '/status',
  isAuth,
  [body('status').trim().not().isEmpty()],
  authController.updateUserStatus
)

module.exports = router
