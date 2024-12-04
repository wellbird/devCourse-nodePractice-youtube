function postLogout(event) {
  event.preventDefault();

  fetch(`/logout`, {
    method: 'POST',
    credentials: 'include',
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
      window.location.href = `/`;
    })
    .catch((error) => {
      console.log(error);
    });
}
