'use strict';
const url = '.';
const ul = document.querySelector('.ownPostContent');
const user = JSON.parse(sessionStorage.getItem('user'));

document.querySelector('#infoArea .name').innerHTML=user.Kayttajatunnus;
const email = document.getElementById('emailInput');
email.value = user.Sahkoposti;

const getUser = async () => {
  console.log('getPost token ', sessionStorage.getItem('token'));
  console.log('SPOSTI ' + user.Sahkoposti);
  try {
    const options = {
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/user/profile/' + user.Sahkoposti, options);
    const data = await response.json();
    console.log('Ville: ' + data);
    console.log('DATAA: ' + data[0].Bio);
    console.log('profiilikuva: '+data[0].Profiilikuva);

    if (data[0].Bio !== null) {
      document.querySelector('#bio').innerHTML= data[0].Bio;
    } else {
      document.querySelector('#bio').innerHTML="My name is " + user.Kayttajatunnus + " and I use Skater app";
    }

    if (data[0].Profiilikuva !== null) {
      document.querySelector('.profilePic').src='/' + data[0].Profiilikuva;
    } else {
      document.querySelector('.profilePic').src="";
    }
  }
  catch (e) {
    console.log(e.message);
  }


};





const createPost = (data) => {
    console.log('Höhöö ' + data[0]);
    console.log('Eemaili: ' + email.value);
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
  
      const h4 = document.createElement('h4');
    h4.innerHTML = post.Kayttajatunnus;
    const h2 = document.createElement('h2');
    h2.innerHTML = post.Otsikko;
    const p0 = document.createElement('h4');
    p0.innerHTML = post.Aikaleima;
    const p1 = document.createElement('h4');
    p1.innerHTML = '<i class="fas fa-thumbtack"></i> ' + post.Katuosoite + ' ' + post.Paikkakunta;
    const p2 = document.createElement('p');
    p2.className = 'postInfo';
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

//NOT READY YET --------------->

  const editButton = document.querySelector('#Edit');
    editButton.addEventListener('click', () => {
      location.href='#editModal';    
    });

  const saveForm = document.querySelector('#editForm');
    saveForm.addEventListener('submit', async (evt) => {
      evt.preventDefault();
      await changeProfilePhoto(saveForm);
      const data = serializeJson(saveForm);
      const fetchOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: JSON.stringify(data),
      };
    
      console.log(fetchOptions);
      const response = await fetch(url + '/post/bio', fetchOptions);
      const json = await response.json();
      console.log('edit response', json);
      getUser();
      getPost();
      location.href='#close';
    });

const changeProfilePhoto = async (formdata) => {
  const imgData = new FormData(formdata);
  console.log('Kuvadata ' + imgData);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: imgData,
  };
  const response = await fetch(url + '/post/profilePhotoChange', fetchOptions);
  const json = await response.json();
  console.log('add photoresponse', json);
};
//<--------------- NOT READY YET 

if (sessionStorage.getItem('token')) {
    getUser();
    getPost();
  }else{
    window.location.href = 'login.html';
  }

  