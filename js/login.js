const loginForm = document.querySelector('#loginForm')
const url = 'http://localhost:3000' // palvelimen osote

loginForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const data = serializeJson(loginForm);
  console.log(data);
  const fetchOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url + '/auth/login', fetchOptions);
  const json = await response.json();
  console.log('login response', json);
  if (!json.user) {
    alert(json.message);
  } else {
    sessionStorage.setItem('token', json.token);
    sessionStorage.setItem('user', JSON.stringify(json.user));
    location.href = 'index.html';
  }
});

