'use strict';
const pool = require('../db/db');
const promisePool = pool.promise();
const moment = require('moment');

const getAllPosts = async () => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    const [rows] = await promisePool.query('SELECT Postaus.PostausID, Kayttaja.Kayttajatunnus, Otsikko, Katuosoite, Aikaleima, Tiedot, Paikkakunta, Postaus.Sahkoposti, KuvaTiedosto, COUNT(Tykkays.PostausID) ' +
        'FROM Postaus INNER JOIN Kuva ON Postaus.PostausID = Kuva.PostausID INNER JOIN Kayttaja ON Postaus.Sahkoposti = Kayttaja.Sahkoposti '+
        'LEFT JOIN Tykkays ON Postaus.PostausID = Tykkays.PostausID GROUP BY Postaus.PostausID;');
    console.log('rows11', moment(rows[0].Aikaleima).format('MMMM Do YYYY, h:mm'));
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

const getLikesFilter = async () => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    const [rows] = await promisePool.query('SELECT Postaus.PostausID, Kayttaja.Kayttajatunnus, Otsikko, Katuosoite, Aikaleima, Tiedot, Paikkakunta, Postaus.Sahkoposti, KuvaTiedosto, COUNT(Tykkays.PostausID) ' +
        'FROM Postaus INNER JOIN Kuva ON Postaus.PostausID = Kuva.PostausID INNER JOIN Kayttaja ON Postaus.Sahkoposti = Kayttaja.Sahkoposti '+
        'LEFT JOIN Tykkays ON Postaus.PostausID = Tykkays.PostausID GROUP BY Postaus.PostausID ORDER BY COUNT(tykkays.PostausID) DESC;');
    console.log('rows11', moment(rows[0].Aikaleima).format('MMMM Do YYYY, h:mm'));
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
    const [rows] = await promisePool.execute('SELECT Postaus.PostausID, Kayttaja.Kayttajatunnus, Otsikko, Katuosoite, Aikaleima, Tiedot, Paikkakunta, Postaus.Sahkoposti, KuvaTiedosto ' +
        'FROM Postaus INNER JOIN Kuva ON Postaus.PostausID = Kuva.PostausID INNER JOIN Kayttaja ON Postaus.Sahkoposti = Kayttaja.Sahkoposti WHERE Postaus.PostausID = ?;',
        [id]);
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
        'INSERT INTO Postaus (Otsikko, Katuosoite, Aikaleima, Tiedot, Paikkakunta, Sahkoposti) VALUES (?,?,NOW(),?,?,?);',
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

const updateProfilePhoto = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'UPDATE kayttaja SET Profiilikuva = ? WHERE Sahkoposti = ?',
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
    const [rows] = await promisePool.execute('DELETE FROM Postaus WHERE PostausID = ?',
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
        'INSERT INTO kuva (KuvaTiedosto, PostausID) VALUES (?,?)',
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
    const [rows] = await promisePool.execute('DELETE FROM Kuva WHERE PostausID = ?',
        [id]);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const deleteProfilePhoto = async (sahkoposti) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM Profiilikuva WHERE Sahkoposti = ?',
        sahkoposti);
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
        'INSERT INTO Kommentit (Teksti, Aikaleima, PostausID, Sahkoposti) VALUES (?,NOW(),?,?)',
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
    const [rows] = await promisePool.execute('DELETE FROM Kommentit WHERE KommenttiID = ?',
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
    const [rows] = await promisePool.execute('SELECT * FROM Kommentit WHERE KommenttiID = ?',
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
    const [rows] = await promisePool.execute('SELECT * FROM Kommentit INNER JOIN Kayttaja ON Kommentit.Sahkoposti = Kayttaja.Sahkoposti WHERE PostausID = ?',
        [id]);
    console.log('commentRows', rows);
    let i;
    for(i = 0; i < rows.length; i++){
      rows[i].Aikaleima = moment(rows[i].Aikaleima).format('MMMM Do YYYY')
    }
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const addLike = async (params) => {
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO Tykkays (Sahkoposti, PostausID) VALUES (?,?)',
        params
    );
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('postausModel error', e.message);
    return { error: 'DB Error' };
  }
}

const getPostLike = async (params) => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM Tykkays WHERE PostausID = ? AND Sahkoposti = ?',
        params);
    console.log('rows', rows);
    return rows;
  } catch (e) {
    console.log('getPostLike error', e.message);
    return { error: 'DB Error' };
  }
}

const deleteLike = async (params) => {
  try {
    const [rows] = await promisePool.execute('DELETE FROM Tykkays WHERE PostausID = ? AND Sahkoposti = ?',
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
    const [rows] = await promisePool.execute('SELECT COUNT(PostausID) FROM Tykkays WHERE PostausID = ?',
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
  getLikesFilter,
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
  getPostLike,
  addTag,
  deleteTag,
  addPhoto,
  deletePhoto,
  getName,
  updatePhoto,
  updateProfilePhoto,
  deleteProfilePhoto,
};
