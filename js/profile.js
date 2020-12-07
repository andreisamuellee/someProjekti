'use strict';
const ul = document.querySelector('.ownPostContent');
const url = 'http://localhost:3000';
const user = JSON.parse(sessionStorage.getItem('user'));
document.querySelector('#infoArea .name').innerHTML=user.Kayttajatunnus;
document.querySelector('#bio').innerHTML=user.Bio;
document.querySelector('.profilePic').src=user.Profiilikuva;

const createPost = (data) => {

    ul.innerHTML = '';
    //const post = JSON.parse(post);
    //console.log(post);
    data.forEach((post) => {
      const img = document.createElement('img');
      img.src = url + '/thumbnails/' + post.KuvaTiedosto;
      img.alt = post.Otsikko;
      img.classList.add('resp');
  
      img.addEventListener('click', () => {
        modalImage.src = url + '/' + post.KuvaTiedosto;
        imageModal.alt = post.Otsikko;
        imageModal.classList.toggle('hide');
      });
  
      const figure = document.createElement('figure').appendChild(img);
  
      const h2 = document.createElement('h2');
      h2.innerHTML = post.Otsikko;
      const p0 = document.createElement('p');
      p0.innerHTML = post.Aikaleima;
      const p1 = document.createElement('p');
      p1.innerHTML = post.Katuosoite + ' ' + post.Paikkakunta;
      const p2 = document.createElement('p');
      p2.innerHTML = post.Tiedot;
      
      const likeButton = document.createElement('button');
      likeButton.innerHTML = 'Like';
      likeButton.addEventListener('click', () =>{
      });
  
      const modButton = document.createElement('button');
      modButton.innerHTML = 'Modify';
      modButton.addEventListener('click', () => {
        const inputs = modForm.querySelectorAll('input');
        inputs[0].value = post.name;
        inputs[1].value = post.address;
        inputs[2].value = post.city;
        inputs[3].value = post.info;
        inputs[4].value = post.image;
        inputs[5].value = post.post_id;
      });
  
      const delButton = document.createElement('button');
      delButton.innerHTML = 'Delete';
      delButton.addEventListener('click', async () => {
        const fetchOptions = {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        };
        try {
          const response = await fetch(url + '/post/' + post.post_id, fetchOptions);
          const json = await response.json();
          console.log('delete response', json);
          getPost();
        }
        catch (e) {
          console.log(e.message());
        }
      });
  
      const li = document.createElement('li');
      li.classList.add('postItem');
  
      li.appendChild(h2);
      li.appendChild(figure);
      li.appendChild(p0);
      li.appendChild(p1);
      li.appendChild(p2);
      li.appendChild(likeButton);
      ul.appendChild(li);
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
      const response = await fetch(url + '/post/own', options);
      const data = await response.json();
      console.log(data);
      createPost(data);
    }
    catch (e) {
      console.log(e.message);
    }


 };

  // const getLoggedUsername = async () => {
  //   try {
  //     const options = {
  //       headers: {
  //         'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
  //       },
  //     };
  //     const response = await fetch(url + '/post/logged', options);
  //     const data = await response.json();
  //     console.log('Logged user: ' + data);
  //     return data;
  //   }
  //   catch (e) {
  //     console.log(e.message);
  //   }
  // };

if (sessionStorage.getItem('token')) {
    getPost();
  }else{
    window.location.href = 'login.html';
  }

  