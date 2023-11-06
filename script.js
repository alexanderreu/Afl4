// Width og height til SVG
const w = 1000;
const h = 500;
//Padding for at søjlerne ikke skal sidde helt op af hinanden
const padding = 10;
//Padding til akserne for at man kan se det hele
const axisPadding = 70;
// Hent data fra albums.json
fetch('albums.json')
    .then(response => response.json())
    .then(albumsData => {

      
