const logOut = document.querySelector('.log-out');
const logOutDiv = document.querySelector('#logOutDiv');

logOut.addEventListener('click', async (evt) => {
  evt.preventDefault();
  console.log('Kliki toimii');
  const varmistus = confirm('Oletko varma?');
  if (varmistus) {
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/auth/logout', options);
      const json = await response.json();
      console.log(json);
      // remove token
      sessionStorage.removeItem('token');
      location.href = 'index.html';
    } catch (e) {
      console.log(e.message);
    }
  }
});

if (!sessionStorage.getItem('token')) {
  logOutDiv.style.visibility='collapse';
} else {
  logOut.style.display='block';
}
