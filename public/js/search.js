'use strict';
const url = '.';

const createPost = (data) => {
        postsToMap(data);
        let i = 0;
        data.forEach((post) => {
          const num = post.PostausID;
          console.log(document.querySelector('#id'+num));
          let img = document.querySelector('#id'+post.PostausID);
          console.log(img);
          img.addEventListener('click', () => {
            console.log('Klikkasit kuvaa '+post.PostausID);
          });
        });
  };

const getPost = async () => {
  console.log('getPost token ', sessionStorage.getItem('token'));
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/post', options);
    const data = await response.json();
    console.log(data);
    createPost(data);
  }
  catch (e) {
    console.log(e.message);
  }
};
getPost();
