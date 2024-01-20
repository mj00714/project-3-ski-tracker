// The function createResortMarkers is a function that takes in the json data from the json
// file created by query.ipynb and assigns each of the resorts to a layer depending on when
// in the next 48 hours snow is expected.

function createResortMarkers(data, startPoint) {

    // Save the imported data to an object and declare the arrays
    // to which resorts will be added for each layer.
    let resorts = data;
    let snow12Hours = [];
    let snow24Hours = [];
    let snow48Hours = [];
    let remainderResorts = [];

    // Iterate through the resorts in the imported data
    for (let index=0; index<resorts.length; index++) {

      // Assign the current resort to an object
      let resort = resorts[index];
        
      // Set coordinates and resort name
      let lat = resort.location.latitude;
      let long = resort.location.longitude;
      let name = resort.name;

      // Find the distance using the user input lat/long coordinates
      fromPoint = turf.point(startPoint);
      destPoint = turf.point([lat, long]);
      let options = {units: 'miles'};
      let distance = Math.round(turf.distance(fromPoint, destPoint, options));

      // Set radius
      let radius = 10000;
        
      // Set fillColor
      let fillColor = 'green';

      // Assign the resort to one of the arrays depending on when snow is forecast.
      // First assign resorts expecting snow within 12 hours. 
      if (resort.snow_firstperiod === true) {
          snow12Hours.push(L.circle([lat, long], {
            color: fillColor,
            fillColor: fillColor,
            fillOpacity: 0.75,
            radius: radius
      }).bindPopup("<h3>Name: " + name + "<h3><h3>" + distance + " miles away</h3>"));

      // Next assign resorts expecting snow between 12 and 24 hours
      } else if (resort.snow_secondperiod === true) {
          snow24Hours.push(L.circle([lat, long], {
            color: fillColor,
            fillColor: fillColor,
            fillOpacity: 0.75,
            radius: radius
      }).bindPopup("<h3>Name: " + name + "<h3><h3>" + distance + " miles away</h3>"));

      // Next assign resorts expecting snow between 24 and 48 hours
      } else if (resort.snow_thirdperiod === true || resort.snow_fourthperiod === true) {
          snow48Hours.push(L.circle([lat, long], {
            color: fillColor,
            fillColor: fillColor,
            fillOpacity: 0.75,
            radius: radius
            }).bindPopup("<h3>Name: " + name + "<h3><h3>" + distance + " miles away</h3>"));

       // Assign all the remaining resorts to their own array 
       } else {
          remainderResorts.push(L.circle([lat, long], {
            color: fillColor,
            fillColor: fillColor,
            fillOpacity: 0.75,
            radius: radius
          }).bindPopup("<h3>Name: " + name + "<h3><h3>" + distance + " miles away</h3>"));
      }
    };

    // Create the tile layer that will be the background of the map
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the layer group for resorts expecting snow in 12 hours
    let twelveHours = L.layerGroup(snow12Hours);
    
    // Create the layer group for resorts expecting snow in 24 hours
    let tempArray1 = snow12Hours.concat(snow24Hours);
    let twentyfourHours = L.layerGroup(tempArray1);
    
    // Create the layer group for resorts expecting snow in 48 hours
    let tempArray2 = tempArray1.concat(snow48Hours);
    let fortyeightHours = L.layerGroup(tempArray2);

    // Create the layer group containing all the resorts
    let tempArray3 = tempArray2.concat(remainderResorts);
    let allResorts = L.layerGroup(tempArray3);

    // Assign street map to base layer
    let baseMap = {
      "Street Map": streetmap
    };

    // Assign the different layer groups to the overlay layers
    let overlayMaps = {
      "Snow Forecast 12 Hours": twelveHours,
      "Snow Forecast 24 Hours": twentyfourHours,
      "Snow Forecast 48 Hours": fortyeightHours,
      "All Resorts": allResorts
    };

    // Create the map with just the base layer initially showing
    let myMap = L.map("map", {
    center: [40, -100],
    zoom: 5,
    layers: [streetmap]
    });

    // Add the layer control function
    L.control.layers(baseMap, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
};

// Prompt the user for starting coordinates
// const userLatString = prompt("Please Enter Your Starting Latitude: ");
// const userLongString = prompt("Please Enter Your Starting Longitude: ");
// const userStartPoint = [parseFloat(userLatString), parseFloat(userLongString)];
const userStartPoint = [33.83, -111.95];

// Use createResortMarkers function to create the map from the imported resort data
d3.json("resort_data.json").then((importedData) => {
  createResortMarkers(importedData, userStartPoint);
});