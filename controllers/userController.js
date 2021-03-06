// Controller
'use strict';
const userModel = require('../models/userModel');

const users = userModel.users;

const user_list_get = async (req, res) => {
  const users = await userModel.getAllUsers();
  res.json(users);
};

const user_get = async (req, res) => {
  const id = req.params.id;
  const user = userModel.getUser(id);
  delete user.password;
  res.json(user);
};

const profile_get = async (req, res) => {
  const id = req.params.id;
  console.log('IIDDD: '+ id);
  const user = await userModel.getUser(id);
  await console.log('uuseri: ' + user);
  res.json(user);
};

module.exports = {
  user_list_get,
  user_get,
  profile_get,
};
