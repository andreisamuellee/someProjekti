'use strict';
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

router.get('/own', postController.post_own_get);

router.get('/user/:id', postController.post_get);

router.get('/logged', postController.post_get_logged_user);



//inside router post =  
router.post('/', upload.single('image'), injectFile, postController.make_thumbnail, [
  body('otsikko', 'vaadittu kenttä').isLength({min: 1}),
  body('katuosoite', 'vaadittu kenttä').isLength({min: 1}),
  body('paikkakunta', 'vaadittu kenttä').isLength({min: 1}),
  body('tiedot', 'anna tietoja'),
  body('mimetype', 'ei ole kuva').contains('image'),
], postController.create_post);

router.post('/photoChange', upload.single('KuvaTiedosto'), injectFile, postController.make_thumbnail, [
  body('mimetype', 'ei ole kuva').contains('image'),
], postController.change_photo);

router.post('/profilePhotoChange', upload.single('Profiilikuva'), injectFile, [
  body('mimetype', 'ei ole kuva').contains('image'),
], postController.change_profile_photo);

router.put('/', [
  body('Otsikko', 'vaadittu kenttä').isLength({min: 1}),
  body('Katuosoite', 'vaadittu kenttä').isLength({min: 1}),
  body('Paikkakunta', 'vaadittu kenttä').isLength({min: 1}),
  body('Tiedot', 'anna tietoja'),
  //body('mimetype', 'ei ole kuva').contains('image'),
], postController.post_update_put);

router.delete('/user/:id', postController.post_delete);


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
