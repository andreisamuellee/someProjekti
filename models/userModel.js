'use strict';
const pool = require('../db/db');
const promisePool = pool.promise();

const getAllUsers = async () => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    const [rows] = await promisePool.query('SELECT * FROM Kayttaja');
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('userModel error', e.message);
    return {error: 'DB Error'};
  }
};

const getUser = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM Kayttaja WHERE Sahkoposti = ?',
        [id]);
    console.log('UserRows', rows);
    return rows;
  } catch (e) {
    console.log('userModel error', e.message);
    return {error: 'DB Error'};
  }
}

const addUser = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO Kayttaja (Sahkoposti, Kayttajatunnus, Salasana) VALUES (?,?,?)',
        params
    );
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('userModel error', e.message);
    return {error: 'DB Error'};
  }
}

const getUserLogin = async (params) => {
  try {
    console.log('getUserLogin', params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM Kayttaja WHERE Sahkoposti = ?;',
        params);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  addUser,
  getUserLogin,
};
