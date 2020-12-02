const logOut = document.querySelector('.log-out');
const url = 'http://localhost:3000' // palvelimen osote

logOut.addEventListener('click', async (evt) => {
  evt.preventDefault();
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
    alert('You have logged out');
    location.href = 'login.html';
  } catch (e) {
    console.log(e.message);
  }
});