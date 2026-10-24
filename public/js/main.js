var form = document.getElementById('search');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    var postalcode = document.getElementById('postalcode').value;

    console.log(postalcode);

    var n = document.getElementsByClassName('result')[0];
    if (n) {
      n.parentNode.removeChild(n);
    }
  

    fetch('/search', {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({
            postalcode: postalcode,
        }),
    })
      .then((res) => {
        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((blob) => {
        console.log(blob);
        if (blob.error) {
          alert(blob.error);
          return;
        }
        var node = document.createElement('p');
        var text = document.createTextNode(`${blob.prefecture}${blob.city}${blob.address}`);
        node.setAttribute('class', 'result');
        node.appendChild(text);

        document.getElementById('contents').appendChild(node);
      })
      .catch((reason) => {
        console.log(reason);
      });
});