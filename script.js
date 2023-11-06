// Hent data fra albums.json
fetch('albums.json')
    .then(response => response.json())
    .then(albumsData => {

      