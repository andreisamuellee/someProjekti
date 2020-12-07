if (sessionStorage.getItem('token')) {
    getPost();
  }else{
    window.location.href = 'login.html';
  }