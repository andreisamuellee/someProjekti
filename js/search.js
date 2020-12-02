'use strict';
let searchBar = document.getElementById("searchBar");
let searchBtn = document.getElementById("searchBtn");

searchBtn.onclick = () => {
    search();
}

function search(){
    console.log(searchBar.value);
}

const createPost = (data) => {

    ul.innerHTML = '';
    data.forEach((post) => {
      const img = document.createElement('img');
      img.src = url + '/thumbnails/' + post.filename;
      img.alt = post.Otsikko;
      img.classList.add('resp');
  
      img.addEventListener('click', () => {
        modalImage.src = url + '/' + post.filename;
        imageModal.alt = post.name;
        imageModal.classList.toggle('hide');
      });
  
      const figure = document.createElement('figure').appendChild(img);
  
      const h2 = document.createElement('h2');
      h2.innerHTML = post.Otsikko;
      const p0 = document.createElement('p');
      p0.innerHTML = post.Aikaleima;
      const p1 = document.createElement('p');
      p1.innerHTML = post.Katuosoite + ' ' + post.Kaupunki;
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

