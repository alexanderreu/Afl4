// Width og height til SVG
const w = 1000;
const h = 500;


// Padding for at søjlerne ikke skal sidde helt op af hinanden
const padding = 10;


// Padding til akserne for at man kan se det hele
const axisPadding = 70;

console.log("hello")

// Hent data fra albums.json
fetch('albums.json')
    .then(response => response.json())
    .then(albumsData => {

        // FullPlays-værdierne fra json
        const fullPlaysData = albumsData.map(function (album) {
            return album.fullPlays;
        });
        
        // Rating-værdierne fra json
        const ratingData = albumsData.map(function (album) {
            return album.rating;
        });

        // ProductionYear-værdierne fra json
        const productionYearData = albumsData.map(function (album) {
            return album.productionYear;
        });
        console.log(productionYearData)

        // Albumnavne til labels
        const albumLabels = albumsData.map(function (album) {
            return album.albumName;
        });

        
        // Der defineres en Skaleringsfunktion, som værdisættes senere
        let yScale = null;
        let xScale = null;

        // Der defineres en variabel for Akserne, som værdisættes senere 
        let xAxis = null;
        let yAxis = null;
    });