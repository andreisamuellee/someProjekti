'use strict';
const url = '.';

const postForm = document.getElementById('postForm');
const ul = document.querySelector('.content');
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
    console.log(post["count(tykkays.postausID)"]);
    const figure = document.createElement('figure').appendChild(img);

    const h4 = document.createElement('h4');
    h4.innerHTML = post.Kayttajatunnus;
    const h2 = document.createElement('h2');
    h2.innerHTML = post.Otsikko;
    const p0 = document.createElement('h4');
    p0.innerHTML = post.Aikaleima;
    const p1 = document.createElement('h4');
    p1.innerHTML = '<i class="fas fa-thumbtack"></i> ' + post.Katuosoite + ' ' + post.Paikkakunta;
    const p2 = document.createElement('p');
    p2.innerHTML = post.Tiedot;

    let commentDiv = document.createElement('div');
    const comments = await getComments(post.PostausID);
    const commentCount = comments.length;

    const showComments = document.createElement('button');

    console.log('Commentcount: ' + commentCount);
    if(commentCount === 1){
      showComments.innerHTML = commentCount + ' Comment';
    }else{
      showComments.innerHTML = commentCount + ' Comments';
    }
    showComments.classList.add('showComments');
    showComments.addEventListener('click', () => {
      if (getComputedStyle(commentDiv, null).display === 'none' && commentCount !== 0) {
        commentDiv.style.display = 'block';
      } else {
        commentDiv.style.display = 'none';
      }
    });

    for (const comment of comments) {
      await commentDelete(commentDiv, comment.Kayttajatunnus, comment.Teksti, comment.Aikaleima, comment.KommenttiID, loggedUser, comment.Sahkoposti, showComments, post.PostausID);
    }

    //moment.js aikaleimoihin
    const likeButton = document.createElement('span');
    likeButton.className = "heart";
    const likeValue = document.createElement('p');
    likeValue.className = "likeVal";

    setLikedState(post.PostausID, likeButton, post ,likeValue);

    likeButton.addEventListener('click', async (evt) => {
      evt.preventDefault();
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/post/like/' + post.PostausID, fetchOptions);
      const json = await response.json();
      console.log('like response', json);
      if (json.error) {
        deleteLike(post.PostausID);
      }
      getPost();
    });



    //Needs a code that detects if the logged user is the creator of the post. Not used yet.
    const modButton = document.createElement('button');
    modButton.innerHTML = 'Modify';
    modButton.addEventListener('click', () => {
      location.href = '#modModal';
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
      const verification = confirm('Are you sure?');
      if(verification) {
        const fetchOptions = {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        };
        try {
          const response = await fetch(url + '/post/user/' + post.PostausID,
              fetchOptions);
          const json = await response.json();
          console.log('delete response', json);
          getPost();
        } catch (e) {
          console.log(e.message());
        }
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

      if(commentInput.value !== ''){
        const comments = await getComments(post.PostausID);
        const index = comments.length -1;
        const newComment = comments[index];
        await commentDelete(commentDiv, newComment.Kayttajatunnus, newComment.Teksti, newComment.Aikaleima, newComment.KommenttiID, loggedUser, newComment.Sahkoposti, showComments, post.PostausID);
        if(comments.length === 1){
          showComments.innerHTML = comments.length + ' Comment';
        }else{
          showComments.innerHTML = comments.length + ' Comments';
        }
        commentDiv.style.display = 'block';
        commentInput.value = '';
      }
    });

    const div = document.createElement('div');
    div.classList.add('postItem');

    console.log('Log ' + loggedUser);
    console.log('Post-sposti ' + post.Sahkoposti);

    
    div.appendChild(h2);
    div.appendChild(h4);
    div.appendChild(p1);
    div.appendChild(figure);
    
    
    div.appendChild(p2);
    if (sessionStorage.getItem('token') != null) {
      div.appendChild(likeButton);
      div.appendChild(likeValue);
    }
    if (post.Sahkoposti === loggedUser) {
      div.appendChild(modButton);
      div.appendChild(delButton);
    } else {
      console.log('No match!');
    }

    div.appendChild(showComments);
    div.appendChild(commentDiv);
    div.appendChild(commentForm);
    div.appendChild(p0);
    ul.appendChild(div);
  }

  };


close.addEventListener('click', (evt) => {
  evt.preventDefault();
  imageModal.classList.toggle('hide');
});

const commentDelete = async (commentDiv, user, text, timestamp, id, loggedUser, email, showComments, postausID) =>{
  const p = document.createElement('p');
  p.classList.add('comment');
  const comDel = document.createElement('button');
  comDel.innerHTML = 'Delete';
  p.innerHTML = '<b>' + user + ': ' + '</b>' + text;
  const pt = document.createElement('p');
  pt.classList.add('commentTime');
  pt.innerHTML = timestamp;
  commentDiv.appendChild(p);
  commentDiv.appendChild(pt);
  if(loggedUser === email) {
    pt.appendChild(comDel);
    comDel.addEventListener('click', async () => {
      const fetchOptions = {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      try {
        const response = await fetch(url + '/post/comment/' + id, fetchOptions);
        const json = await response.json();
        console.log('commentDelete response', json);
        p.remove();
        pt.remove();
        comDel.remove();
        const comments = await getComments(postausID);
        console.log('COUNT: ' + comments.length);
        if(comments.length === 1){
          showComments.innerHTML = comments.length + ' Comment';
        }else{
          showComments.innerHTML = comments.length + ' Comments';
        }
      } catch (e) {
        console.log(e.message());
      }
    });
  }
};

const getCommentCount = (mode) => {
  if(mode === 1){
    commentCount--;
  }else {
    commentCount++;
  }
  return commentCount;
};

const getPost = async () => {
  console.log('getPost token ', sessionStorage.getItem('token'));
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    let response = null;
    if (sessionStorage.getItem('token') == null) {
      response = await fetch(url + '/getposts', options);
    } else {
      response = await fetch(url + '/post', options);
    }
    const data = await response.json();
    console.log(data);
    createPost(data);
  }
  catch (e) {
    console.log(e.message);
  }
};

const setLikedState = async (id, likeButton, post, likeValue) => {
  const liked = await getLike(id);
  if (liked === undefined || liked.length == 0) {
    likeButton.innerHTML = '<i class="fas fa-heart notliked"></i>';
    likeValue.innerHTML = post["COUNT(Tykkays.PostausID)"];
  } else {
    likeButton.innerHTML = '<i class="fas fa-heart liked"></i>';
    likeValue.innerHTML = post["COUNT(Tykkays.PostausID)"];
  }
}

const Like = async (id) => {
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
  const response = await fetch(url + '/post/like/' + id, fetchOptions);
  const json = await response.json();
  console.log('like response', json);
  return json;
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

const getLike = async (id) => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/post/like/' + id, options);
    const data = await response.json();
    console.log('get like: ' + data);
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
  postForm.reset();
  location.href = '#close';
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
  location.href = '#close';
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

const deleteLike = async (id) => {
  const fetchOptions = {
    method: 'DELETE',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
  try {
    const response = await fetch(url + '/post/like/' + id, fetchOptions);
    const json = await response.json();
    console.log('delete response', json);
  }
  catch (e) {
    console.log(e.message());
  }
};


openFormBtn.addEventListener('click', () => {
  document.getElementById('openModal').style.display = 'block';
});

getPost();
