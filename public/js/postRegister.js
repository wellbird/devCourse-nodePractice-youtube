function postRegister(event) {
  event.preventDefault();

  const id = document.getElementById('id').value;
  const pwd = document.getElementById('pwd').value;
  const name = document.getElementById('name').value;

  fetch(`/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, pwd, name }),
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
