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

module.exports = {
  post_list_get,
  post_get,
};

