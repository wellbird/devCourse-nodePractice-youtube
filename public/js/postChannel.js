function postChannel(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;

  fetch('/channel/create', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  })
    .then((res) => {
      if (!res.ok) {
        if (res.headers.get('content-type').includes('text/html')) {
          return res.text().then((html) => {
            document.open();
            document.write(html);
            document.close();
          });
        } else {
          return res.json().then((data) => {
            alert(data.message);
            throw new Error(data.message);
          });
        }
      }
      return res.json();
    })
    .then((data) => {
      alert(data.message);
      window.location.href = '/channel';
    })
    .catch((error) => {
      console.log(error);
    });
}
