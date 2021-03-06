const addUserForm = document.querySelector('#addUserForm')
const url = '.' // palvelimen osote

addUserForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(addUserForm);
    console.log(data);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url + '/auth/register', fetchOptions);
    const json = await response.json();
    console.log('user add response', json);
    // save token
  if(response.ok){
    location.href = 'login.html';
  }else{
    alert(json.error);
  }

  });