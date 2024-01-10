// Create the tile layer that will be the background of our map.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map.
let myMap = L.map("map", {
    center: [40, -100],
    zoom: 5
  });

streetmap.addTo(myMap);

let ski_url = "https://ski-resorts-and-conditions.p.rapidapi.com/v1/resort/whistler-blackcomb";

let options = {
    method: "GET",
    headers: {
	    "X-RapidAPI-Key": "f9fac65684msh6b17d61b8352a7fp16af60jsn1e07a303840b",
	    "X-RapidAPI-Host": "ski-resorts-and-conditions.p.rapidapi.com"
    }
};

function createResortMarkers(ski_response) {

    // Assign each resort to an object when we start importing more than one resort
    let resort = ski_response.json();

    // Set coordinates
    let lat = resort.location.latitude;
    let long = resort.location.longitude;
    let name = resort.name;

    // Set fillColor
    let fillColor = 'green';

    // Set radius
    let radius = 10000;

    // Create circle-shaped marker at each resort location
    L.circle([lat, long], {
        color: fillColor,
        fillColor: fillColor,
        fillOpacity: 0.75,
        radius: radius
    }).bindPopup("<h3>Name: " + name + "</h3>");

    // for (let index=0; index<resorts.length; index++) {

    //     // Assign current resort to object
    //     let resort = resorts[index];
        
    //     // Set coordinates
    //     let lat = resort.location.latitude;
    //     let long = resort.location.longitude;
    //     let name = resort.name;
        
    //     // Set fillColor
    //     let fillColor = 'green';

    //     // Set radius
    //     let radius = 10000;

    //     // Create circle-shaped marker at each resort location
    //     let resortCircle = L.circle([lat, long], {
    //         color: fillColor,
    //         fillColor: fillColor,
    //         fillOpacity: 0.75,
    //         radius: radius
    //       })
    //       .bindPopup("<h3>Name: " + name + "</h3>");

    //     // Add the circle to the eqMarkers array (LATER) and the map.
    //     // markers_resorts.push(resortCircle);
    //     resortCircle.addTo(myMap)
    // }
}

fetch(ski_url, options).then(createResortMarkers);