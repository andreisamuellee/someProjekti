// Controller
'use strict';
const {validationResult} = require('express-validator');
const postModel = require('../models/postModel');
const {makeThumbnail} = require('../utils/resize');
const {getCoordinates} = require('../utils/imageMeta');

const posts = postModel.posts;

const post_list_get = async (req, res) => {
  const posts = await postModel.getAllPosts();
  res.json(posts);
};

const post_get = async (req, res) => {
  const id = req.params.id;
  const post = await postModel.getPost(id);
  res.json(post);
};

const create_post = async (req, res) => {
  console.log('create_post', req.body, req.file);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  let coords = [];
  try {
    coords = await getCoordinates(req.file.path);
  } catch (e) {
    console.log(e);
    coords = [60,20];
  }

  console.log('coords', coords);
  // object destructuring
  const {name, age, weight, owner} = req.body;
  const params = [name, age, weight, owner, req.file.filename, coords];
  const post = await postModel.addPost(params);
  res.json({message: 'upload ok'});
};

const post_update_put = async (req, res) => {
  console.log('post_update_put', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  // object destructuring
  const {name, age, weight, owner, id} = req.body;
  const params = [name, age, weight, owner, id];
  const post = await postModel.updatePost(params);
  res.json({message: 'modify ok'});
};

const post_delete = async (req, res) => {
  const id = req.params.id;
  const post = await postModel.deletePost(id);
  res.json(post);
};

const make_thumbnail = async (req, res, next) => {
  // kutsu makeThumbnail
  try {
    const kuvake = await makeThumbnail(req.file.path, req.file.filename);
    console.log('kuvake', kuvake);
    if (kuvake) {
      next();
    }
  } catch (e) {
    res.status(400).json({errors: e.message});
  }
};

module.exports = {
  post_list_get,
  post_get,
  create_post,
  post_update_put,
  post_delete,
  make_thumbnail,
};


