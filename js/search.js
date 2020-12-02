'use strict';
let searchBar = document.getElementById("searchBar");
let searchBtn = document.getElementById("searchBtn");

searchBtn.onclick = () => {
    search();
}

function search(){
    console.log(searchBar.value);
}