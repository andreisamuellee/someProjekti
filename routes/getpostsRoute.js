'use strict';
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const getpostsController = require('../controllers/getpostsController');

router.get('/', getpostsController.post_list_get);

module.exports = router;