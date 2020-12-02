'use strict';
// postRoute
const express = require('express');
const router = express.Router();
const multer = require('multer');
const {body} = require('express-validator');
const postController = require('../controllers/postController');

const fileFilter = (req, file, cb) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({dest: './uploads/', fileFilter});

const injectFile = (req, res, next) => {
  if (req.file) {
    req.body.mimetype = req.file.mimetype;
  }
  next();
};

router.get('/', postController.post_list_get);

router.get('/:id', postController.post_get);

//inside router post =  
router.post('/', upload.single('image'), injectFile, postController.make_thumbnail, [
  body('otsikko', 'vaadittu kenttä').isLength({min: 1}),
  body('katuosoite', 'vaadittu kenttä').isLength({min: 1}),
  body('paikkakunta', 'vaadittu kenttä').isLength({min: 1}),
  body('tiedot', 'anna tietoja'),
  body('mimetype', 'ei ole kuva').contains('image'),
], postController.create_post);

router.put('/', [
  body('otsikko', 'vaadittu kenttä').isLength({min: 1}),
  body('katuosoite', 'vaadittu kenttä').isLength({min: 1}),
  body('tiedot', 'anna tietoja spotista'),
  body('paikkakunta', 'vaadittu kenttä').isLength({min: 1}),
], postController.post_update_put);

router.delete('/:id', postController.post_delete);


//same '/' address? might not work.

/*
router.post('/', upload.single('comment'), [
  body('teksti', 'vaadittu kenttä').isLength({min: 1}),
  body('postausID', 'vaadittu kenttä').isLength({min: 1}).isNumeric(),
], postController.create_comment);

router.delete('/:id', postController.comment_delete);

router.get('/:id', postController.comment_get);

//uses post id to get post comments
router.get('/:id', postController.get_post_comments);
*/

module.exports = router;
