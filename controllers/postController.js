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

const post_get_logged_user = async (req, res) => {
  const user = await req.user.Sahkoposti;
  res.json(user);
};

const post_own_get = async (req, res) => {
  const posts = await postModel.getOwnPosts(req.user.Sahkoposti);
  res.json(posts);
};

const get_name = async (req, res) => {
  const user = await req.user.Kayttajatunnus;
  res.json(user);
};

const create_post = async (req, res) => {
  console.log('create_post', req.body, req.file);
  const errors = validationResult(req);


  // object destructuring
  // saattaa sisältää virheitä, mm. uploadaa vain yhden kuvan
  const {otsikko, katuosoite, tiedot, paikkakunta} = req.body;
  const params = [otsikko, katuosoite, tiedot, paikkakunta, req.user.Sahkoposti];
  console.log(params);
  const post = await postModel.addPost(params);
  const params2 = [req.file.filename, post.insertId];
  console.log(params2);
  const image = await postModel.addPhoto(params2);
  res.json({message: 'upload ok'});
};



const post_update_put = async (req, res) => {
  console.log('post_update_put', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  // object destructuring
  const {otsikko, katuosoite, tiedot, paikkakunta, postausid} = req.body;
  const params = [otsikko, katuosoite, tiedot, paikkakunta, postausid];
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

const create_comment = async (req, res) => {
  console.log('create_comment', req.body, req.file);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  // object destructuring
  const {teksti, postausID} = req.body;
  const params = [teksti, postausID];
  const post = await postModel.addComment(params);
  res.json({message: 'upload ok'});
};

const comment_delete = async (req, res) => {
  const id = req.params.id;
  const comment = await postModel.deleteComment(id);
  res.json(comment);
};

const comment_get = async (req, res) => {
  const id = req.params.id;
  const comment = await postModel.getComment(id);
  res.json(comment);
};

const get_post_comments = async (req, res) => {
  const id = req.params.id;
  const comments = await postModel.getPostComments(id);
  res.json(comments);
};

module.exports = {
  post_list_get,
  post_own_get,
  post_get,
  post_get_logged_user,
  create_post,
  post_update_put,
  post_delete,
  make_thumbnail,
  create_comment,
  comment_delete,
  comment_get,
  get_post_comments,
  get_name,

};




