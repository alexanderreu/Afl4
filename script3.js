// Width og height til SVG
const w = 1200;
const h = 700;

//Padding for at søjlerne ikke skal sidde helt op af hinanden
const padding = 10;
  
// Padding for akserne
const axisPadding = 140;  // Padding for akserne


// Hent data fra albums.json
fetch('albums.json')
    .then(response => response.json())
    .then(albumsData => {
      // Henter data fra json
      const dataset = albumsData.map(album => {
        const fullPlaysValue = album.fullPlays; // FullPlays-værdi
        const ratingValue = album.rating; // Rating-værdi
        const productionYearValue = album.productionYear; // Produktionsår
        const albumLabels = album.albumName; // albumnavn

        return [ratingValue, fullPlaysValue, productionYearValue, albumLabels];
        });


//SVG-elementet tilføjes til body
const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);


//Skaleringsfunktioner - de er sat til null, fordi de skal sættes op senere
let yScale = null;
let xScale = null;

//Akser - de er sat til null, fordi de skal sættes op senere
let xAxis = null;
let yAxis = null;

//Denne funktion sørger for at vise den første graf, når siden loades
init(dataset, false);

//Her tilføjes der eventlisteners til knapperne
d3.selectAll("#sortByFullplays, #sortByProduktionsår, #sortByrating").on(
  "click",
  function (e) {
    // Find hvilken knap der blev trykket på
    let id = e.target.id;
    //Log id'et til konsollen
    console.log(id);
    let isFastest = false;
    if (id === "sortByrating") {
      isFastest = true;
    }
    //Data sorteres baseret på hvilken knap der blev trykket på
    sortData(id);
    //Efter sorteringen er færdig, logges det sorterede datasæt til konsollen
    console.log("Sorted data by " + id + " : ", dataset);
    //Data animeres
    animateData(dataset, isFastest);
  }
);

function init(dataset, isFastest) {
  //Først skal de dynamiske værdier sættes op
  setUp(dataset, isFastest);
  //Her oprettes det første chart som vises som standard når siden loades
  createDefaultChart(dataset);
  //Akser tilføjes
  addAxes();
}

function setUp(dataset, isFastest) {
  //Skaleringsfunktioner
  yScale = createScaleY(dataset);
  xScale = createScaleX(dataset);
  //Akser
  xAxis = createAxisX(xScale, isFastest);
  yAxis = createAxisY(yScale);
}

function createDefaultChart(dataset) {
  /**
   * Bar chart laves herunder
   * Vi bruger 'xScale' til at placere søjler langs x-aksen.
   * Vi bruger 'yScale' til at bestemme højden af søjlerne
   * Vi giver også hver søjle en unik key.
   * Derudover kommer vi akser og labels på også.
   * */
  svg
    .selectAll("rect")
    /**
     * Der skal gives en key til hvert datapunkt, så d3 kan genkende dem.
     * Det gør vi ved at give en callback-funktion som returnerer en værdi som er unik for hvert datapunkt.
     * I dette tilfælde er det dato-stemplet, som er unikt for hvert datapunkt.
     * */
    .data(dataset, function (d) {
      return d[4];
    })
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
      console.log(d);
      return i * dataset.length;
    })
    .attr("x", function (d, i) {
      return xScale(i) + padding;
    })
    .attr("y", function (d) {
      return yScale(d[1]);
    })
    .attr(
      "width",
      w / dataset.length - 2 * padding - (2 * axisPadding) / dataset.length
    )
    .attr("height", function (d) {
      console.log("height: " + (yScale(d[1]) - axisPadding));
      return h - padding - axisPadding - yScale(d[1]);
    })
    .attr("fill", function (d) {
      return "rgb(0, 0, " + (256 - d[1]) + ")";
    });
    
    
}

function createScaleX(dataset) {
  return (
    d3
      /**
       * Her brues scaleBand i stedet for ScaleLinear
       * Dette skyldes at vi vil have tickmarks jævnt fordelt i "bånd" på midten af hver søjle.
       * Før har vi gjort det ved hver start på en en søjle - altså dens x-værdi.
       * Jeg fjerner dem senere, men der sørger også for at placere labels rigtigt i forhold til søjlerne.
       * */
      .scaleBand()
      .range([padding + axisPadding, w - padding - axisPadding])
      .domain(
        /**
         * Arrays har en indbygget metode som hedder 'map'.
         * Den tager en callback-funktion som parameter.
         * Callback-funktionen køres en gang for hvert element i arrayet.
         * Der er altid tre parametre til callback-funktionen:
         * 1) selve elementet (d)
         * 2) indexet for elementet (i)
         * 3) selve arrayet (ikke brugt)
         * Da vi kun skal bruge indexet, så er det kun nødvendigt at tage de to første parametre med i callback-funktionen (d,i).
         * Hvis jeg kun skrev "i", ville jeg få elementet, da der så kun er den første parameter.
         * */
        dataset.map(function (d, i) {
          //Vi returnerer i for at fortælle d3 at der skal være lige så mange tickmarks som der er elementer i arrayet
          return i;
        })
      )
  );
}

function createScaleY(dataset) {
  return d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return d[1];
      }),
    ])
    .range([h - padding - axisPadding, padding + axisPadding])
    .nice();
}

function createAxisY(yScale) {
  return d3.axisLeft().scale(yScale).ticks(5);
}

function createAxisX(xScale, isFastest) {
  return (
    d3
      .axisBottom()
      .scale(xScale)
      //Her fortæller vi hvad der skal skrives på aksen, isFastest bestemmer om det skal være måletid eller måledato
      .tickFormat(function (d) {
        while (d < dataset.length) {
          if (isFastest) {
            return dataset[d][3] + " - " + dataset[d][0];
          } else {
            return dataset[d][3] + " - " + dataset[d][2];
          }
        }
      })
  );
}

function addAxes() {
  svg
    .append("g")
    .attr("transform", "translate(0," + (h - padding - axisPadding) + ")")
    .attr("id", "xAxis");

  svg
    .append("g")
    .attr("transform", "translate(" + (padding + axisPadding) + ",0)")
    .attr("id", "yAxis")
    .call(yAxis);



  //X-aksen formateres, så den viser sine labels korrekt
  formatAxisX();
}
svg.append("text")
        .attr("text-anchor", "center")
        .attr("y", 50)
        .attr("x", -270)  
        .style("font-size", "20px")   
        .text("Fullplays")
        .attr("transform", "rotate(-90,50,20)");

        svg.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle")
        .attr("x", w / 2)
        .attr("y", h - 10)
        .style("font-size", "20px") 
        .text("Rating /  Produktionsår");

function formatAxisX() {
  svg
    .select("#xAxis")
    .call(xAxis)
    //Her fjernes tickmarks fra x-aksen - det synes jeg ser pænere ud
    .call(xAxis.tickSize(0))
    .selectAll("text")
    .attr("transform", "translate(-10,5)rotate(-45)")
    .style("text-anchor", "end");
    
}

function animateData(data, isFastest) {
  setUp(data, isFastest);
  formatAxisX();
  // select alle 'rect'.
  svg
    .selectAll("rect")
    .data(data, function (d) {
      // Vælg key til hvert dataelement
      return d[2],d[3];
    })
    //start en animation
    .transition()
    //Lad den vare 2000 ms
    .duration(2000)
    /**
     * Dette skal være slutresultatet: flyt søjlerne til de nye positioner
     * 'width', 'height' og 'color' er de samme som før,
     * så dem behøver vi ikke at tage med i vores 'transition'
     * Men i praksis kan man sagtens animere flere ting på én gang, hvis man vil.
     * I dette tilfælde skal altså kun 'x' ændres.
     * */
    .attr("x", function (d, i) {
      return xScale(i) + padding;
    });

  //her opdateres så x-aksen
}

function sortData(by) {
  /**
   * I array-objektet i JS er der indbygget en metoder som hedder 'sort'.
   * Den tager en callback-funktion som parameter.
   * I denne callback-funktion skal der returneres et tal, som er enten positivt, negativt eller 0.
   * Hvis tallet er positivt, så bytter 'sort' metoden om på de to elementer i arrayet.
   * Hvis tallet er negativt eller 0, så lader 'sort' metoden dem være som de er.
   * På den måde bliver elementerne i arrayet sorteret.
   */
  if (by === "sortByFullplays") {
    dataset.sort(function (a, b) {
      return a[1] - b[1];
    });
  } else if (by === "sortByProduktionsår") {
    dataset.sort(function (a, b) {
      /**
       * I JS er der indbygget et objekt som hedder 'Date'.
       * Den kan bruges til at lave en dato ud fra en tekststreng.
       * Derfor giver vi det andet element i hvert indre array til 'Date' objektet.
       * JS kan sammenligne Date-objekter ved at trække dem fra hinanden.
       */
      return a[2] - b[2];
    });
  } else {
    dataset.sort(function (a, b) {
      return a[0] - b[0];
     });
      }
        }
    });