'use strict';
const url = '.';

const postForm = document.getElementById('postForm');
const ul = document.querySelector('.postContent');
const openFormBtn = document.querySelector('.fa-camera-retro');
const imageModal = document.querySelector('#image-modal');
const modalImage = document.querySelector('#image-modal img');
const close = document.querySelector('#image-modal a');
const modForm = document.querySelector('#modForm');

const createPost = async (data) => {

  const loggedUser = await getLoggedUser();
  ul.innerHTML = '';
  for (const post of data) {
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

    const h4 = document.createElement('h4');
    h4.innerHTML = post.Kayttajatunnus;
    const h2 = document.createElement('h2');
    h2.innerHTML = post.Otsikko;
    const p0 = document.createElement('p');
    p0.innerHTML = post.Aikaleima;
    const p1 = document.createElement('p');
    p1.innerHTML = post.Katuosoite + ' ' + post.Paikkakunta;
    const p2 = document.createElement('p');
    p2.innerHTML = post.Tiedot;

    let div = document.createElement('div');
    const comments = await getComments(post.PostausID);

    comments.forEach((comment) => {
      const p = document.createElement('p');
      p.classList.add('comment');
      p.innerHTML = '<b>' + comment.Kayttajatunnus + ': ' + '</b>' + comment.Teksti;
      div.appendChild(p);
    });

    const showComments = document.createElement('button');
    const commentCount = comments.length;
    console.log('Commentcount: ' + commentCount);
    if(commentCount === 1){
      showComments.innerHTML = commentCount + ' Comment';
    }else{
      showComments.innerHTML = commentCount + ' Comments';
    }
    showComments.classList.add('showComments');
    showComments.addEventListener('click', () => {
      if (getComputedStyle(div, null).display === 'none' && commentCount !== 0) {
        div.style.display = 'block';
      } else {
        div.style.display = 'none';
      }
    });

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
      location.href='#modModal';
      const inputs = modForm.querySelectorAll('input');
      const textarea = modForm.querySelector('#modInfo');
      textarea.value = post.Tiedot;
      inputs[0].value = post.Otsikko;
      inputs[1].value = post.Katuosoite;
      inputs[2].value = post.Paikkakunta;
      inputs[3].value = null;
      inputs[4].value = post.PostausID;
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
        const response = await fetch(url + '/post/user/' + post.PostausID, fetchOptions);
        const json = await response.json();
        console.log('delete response', json);
        getPost();
      }
      catch (e) {
        console.log(e.message());
      }
    });

    const commentForm = document.createElement('form');
    commentForm.setAttribute('enctype', 'multipart/form-data');
    commentForm.classList.add('commentForm');

    const commentInput = document.createElement('input');
    commentInput.setAttribute('type', 'text');
    commentInput.setAttribute('name', 'Kommentti');

    const IDInput = document.createElement('input');
    IDInput.setAttribute('type', 'hidden');
    IDInput.setAttribute('name', 'PostausID');
    IDInput.value = post.PostausID;

    const commentButton = document.createElement('button');
    commentButton.setAttribute('type', 'submit');
    commentButton.innerHTML = 'Send';

    commentForm.appendChild(commentInput);
    commentForm.appendChild(IDInput);
    commentForm.appendChild(commentButton);

    commentForm.addEventListener('submit', async (evt) => {
      evt.preventDefault();
      console.log('Kommentti ' + JSON.stringify(serializeJson(commentForm)));
      const cfd = JSON.stringify(serializeJson(commentForm));
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: cfd,
      };
      const response = await fetch(url + '/post/comment', fetchOptions);
      const json = await response.json();
      console.log('add comment response', json);
      const comments = await getComments(post.PostausID);
      const index = comments.length -1;
      const newComment = comments[index];
      const p = document.createElement('p');
      p.classList.add('comment');
      p.innerHTML = '<b>' + newComment.Kayttajatunnus + ': ' + '</b>' + newComment.Teksti;
      div.appendChild(p);
      commentInput.value = '';
    });

    const li = document.createElement('li');
    li.classList.add('postItem');


    li.appendChild(h4);
    li.appendChild(h2);
    li.appendChild(figure);
    li.appendChild(p0);
    li.appendChild(p1);
    li.appendChild(p2);
    li.appendChild(likeButton);
    if(post.Sahkoposti === loggedUser){
      li.appendChild(modButton);
      li.appendChild(delButton);
    }else{
      console.log('No match!');
    }
    li.appendChild(showComments);
    li.appendChild(div);
    li.appendChild(commentForm);
    ul.appendChild(li);
  }
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

const getLoggedUser = async () => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/post/logged', options);
    const data = await response.json();
    console.log('Logged user: ' + data);
    return data;
  }
  catch (e) {
    console.log(e.message);
  }
};

const getComments = async (id) => {
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/post/comment/' + id, options);
    const data = await response.json();
    console.log(data);
    return data;
  }
  catch (e) {
    console.log(e.message);
  }
};

postForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  console.log('PostForm ' + postForm);
  const fd = new FormData(postForm);
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
  location.href='#close';
});

modForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  await changePhoto(modForm);
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
  location.href='#close';
});

const changePhoto = async (formdata) => {
  const imgData = new FormData(formdata);
  console.log('Kuvadata ' + imgData);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: imgData,
  };
  const response = await fetch(url + '/post/photoChange', fetchOptions);
  const json = await response.json();
  console.log('add photoresponse', json);
};

openFormBtn.addEventListener('click', () => {
  document.getElementById('openModal').style.display = 'block';
});

  getPost();
