function deleteUser(id) {
  fetch('/user/' + id, {
    method: 'DELETE',
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          alert(data.message);
          throw new Error(data.message);
        });
      }
      return res.json();
    })
    .then((data) => {
      alert(data.message);
      location.href = '/';
    })
    .catch((error) => {
      console.log(error);
    });
}
