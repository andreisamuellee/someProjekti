'use strict';
const url = 'http://localhost:3000';

let searchBar = document.getElementById("searchBar");
let searchBtn = document.getElementById("searchBtn");

searchBtn.onclick = () => {
    search();
}

function search(){
    console.log(searchBar.value);
}

const createPost = (data) => {

    data.forEach((post) => {
        postsToMap(post);
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

