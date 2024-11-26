function postLogin(event) {
  event.preventDefault();

  const id = document.getElementById('id').value;
  const pwd = document.getElementById('pwd').value;

  fetch(`/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, pwd }),
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
      window.location.href = `/user/${id}`;
    })
    .catch((error) => {
      console.log(error);
    });
}
