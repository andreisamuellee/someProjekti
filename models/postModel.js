'use strict';
const pool = require('../db/db');
const promisePool = pool.promise();
const moment = require('moment');

const getAllPosts = async () => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    const [rows] = await promisePool.query('SELECT Postaus.PostausID, Kayttaja.Kayttajatunnus, Otsikko, Katuosoite, Aikaleima, Tiedot, Paikkakunta, Postaus.Sahkoposti, KuvaTiedosto ' +
        'FROM Postaus INNER JOIN Kuva ON Postaus.PostausID = Kuva.PostausID INNER JOIN Kayttaja ON Postaus.Sahkoposti = Kayttaja.Sahkoposti;');
    console.log('rows11', moment(rows[1].Aikaleima).format('MMMM Do YYYY, h:mm'));
    let i;
    for(i = 0; i < rows.length; i++){
      rows[i].Aikaleima = moment(rows[i].Aikaleima).format('MMMM Do YYYY')
    }
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
};
/*
const getPost = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM postaus WHERE postausID = ?',
      [id]);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}
*/

const getOwnPosts = async (id) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    const [rows] = await promisePool.query('SELECT Postaus.PostausID, Otsikko, Katuosoite, Aikaleima, Tiedot, Paikkakunta, Sahkoposti, KuvaTiedosto ' +
        'FROM Postaus INNER JOIN Kuva WHERE Postaus.PostausID = Kuva.PostausID AND Sahkoposti = ?;', [id]);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
};

const getPost = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM postaus WHERE postausID = ?',
        [id]);
    rows.push(await promisePool.execute('SELECT * FROM kommentit WHERE kommenttiID = ?',
        [id]));
    rows.push(await promisePool.execute('SELECT * FROM tykkays WHERE postausID = ?',
        [id]));
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const addPost = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO postaus (otsikko, katuosoite, aikaleima, tiedot, paikkakunta, sahkoposti) VALUES (?,?,NOW(),?,?,?);',
        params
    );
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const updatePost = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'UPDATE postaus SET Otsikko = ?, Katuosoite = ?, Tiedot = ?, Paikkakunta = ? WHERE PostausID = ?',
        params
    );
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const deletePost = async (id) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM postaus WHERE postausID = ?',
        [id]);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const addPhoto = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO kuva (kuvaTiedosto, postausID) VALUES (?,?)',
        params
    );
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const updatePhoto = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'UPDATE Kuva SET KuvaTiedosto = ? WHERE PostausID = ?',
        params
    );
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const deletePhoto = async (id) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM kuva WHERE postausID = ?',
        [id]);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const addComment = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO kommentit (teksti, aikaleima, postausID) VALUES (?,(SELECT CURRENT_TIMESTAMP),?)',
        params
    );
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const deleteComment = async (id) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM kommentit WHERE kommenttiID = ?',
        [id]);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const getComment = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM kommentit WHERE kommenttiID = ?',
        [id]);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const getPostComments = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM kommentit WHERE postausID = ?',
        [id]);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const addLike = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO tykkays (sahkoposti, postausID) VALUES (?,?)',
        params
    );
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const deleteLike = async (params) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM tykkays WHERE postausID = ? AND sahkoposti = ?',
        params
    );
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const getLikeCount = async (id) => {
  try {
    const [rows] = await promisePool.execute('SELECT COUNT(postausID) FROM tykkays WHERE postausID = ?',
        [id]);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const addTag = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO tagit (tagID, tag) VALUES (?,?)',
        params
    );
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const deleteTag = async (id) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM tagit WHERE tagID = ?',
        [id]
    );
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const getName = async (Kayttajanimi) => {
  try {
    const [rows] = await promisePool.query('SELECT kayttaja.Kayttajanimi FROM kayttaja;', [Kayttajanimi]);
    return rows;
  } catch (e) {
    console.log('getName error', e.message);
    return { error: 'DB Error' };
  }
};

//INSERT INTO tykkays (sahkoposti, postausID) VALUES ('topi@g.com', 1);

module.exports = {
  getAllPosts,
  getOwnPosts,
  getPost,
  addPost,
  updatePost,
  deletePost,
  addComment,
  deleteComment,
  getComment,
  getPostComments,
  addLike,
  deleteLike,
  getLikeCount,
  addTag,
  deleteTag,
  addPhoto,
  deletePhoto,
  getName,
  updatePhoto,
  deletePhoto
};
