// Width og height til SVG
const w = 1000;
const h = 500;


// Padding for at søjlerne ikke skal sidde helt op af hinanden
const padding = 10;


// Padding til akserne for at man kan se det hele
const axisPadding = 70;


// Hent data fra albums.json
fetch('albums.json')
    .then(response => response.json())
    .then(albumsData => {});

        // FullPlays-værdierne fra albumsData
        let fullPlaysData = albumsData.map(function (album) {
            return album.fullPlays;
        });

        // Albumnavne til labels
        let albumLabels = albumsData.map(function (album) {
            return album.albumName;
        });


// Denne kode opretter et SVG-element og tilføjer det til HTML-kroppen med en angivet bredde og højde.
    const svg = d3 .select("body").append("svg").attr("width", w).attr("height", h);


// Der defineres en Skaleringsfunktion, som værdisættes senere
let yScale = null;
let xScale = null;

// Der defineres en variabel for Akserne, som værdisættes senere 
let xAxis = null;
let yAxis = null;
