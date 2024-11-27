function deleteChannel(title) {
  fetch('/channel/delete/' + title, {
    method: 'DELETE',
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
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
}
