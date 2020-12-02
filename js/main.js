'use strict';
const url = 'http://localhost:3000';

const postForm = document.getElementById('postForm');
const ul = document.querySelector('.postContent');
const openFormBtn = document.querySelector('.fa-camera-retro');
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');
const close = document.querySelector('#image-modal a');
const modForm = document.querySelector('#modForm');

const createPost = (data) => {

  ul.innerHTML = '';
  data.forEach((post) => {
    const img = document.createElement('img');
    img.src = url + '/thumbnails/' + post.KuvaTiedosto;
    img.alt = post.Otsikko;
    img.classList.add('resp');

    img.addEventListener('click', () => {
      modalImage.src = url + '/' + post.KuvaTiedosto;
      imageModal.alt = post.Otsikko;
      imageModal.classList.toggle('hide');
      /*try {
        const coords = JSON.parse(post.coords);
        // console.log(coords);
        addMarker(coords);
      }
      catch (e) {
      }*/
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
//moment.js aikaleimoihin
    const likeButton = document.createElement('button');
    likeButton.innerHTML = 'Like';
    likeButton.addEventListener('click', () =>{
      //a code which calls a put method of the postRoute
    });

    //Needs a code that detects if the logged user is the creator of the post. Not used yet.
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

    //Needs a code that detects if the logged user is the creator of the post. Not used yet.
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

close.addEventListener('click', (evt) => {
  evt.preventDefault();
  imageModal.classList.toggle('hide');
});

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

postForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(postForm);
  console.log(fd);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/post', fetchOptions);
  const json = await response.json();
  console.log('add response', json);
  getPost();
  document.getElementById('openModal').style.display = 'none';
});

modForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(modForm);
  const fetchOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: JSON.stringify(data),
  };

  console.log(fetchOptions);
  const response = await fetch(url + '/post', fetchOptions);
  const json = await response.json();
  console.log('modify response', json);
  getPost();
});

openFormBtn.addEventListener('click', () => {
  document.getElementById('openModal').style.display = 'block';
});

  getPost();
