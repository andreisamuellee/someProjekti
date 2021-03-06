'use strict';
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/register',
    [
      body('username', 'minimum 3 characters').isLength({min: 3}),
      body('email', 'email is not valid').isEmail(),
      body('password', 'password must be 8 letters long and with atleast one uppercase letter').
      matches('(?=.*[A-Z]).{8,}'),
    ],
    authController.user_create_post
);

module.exports = router;
