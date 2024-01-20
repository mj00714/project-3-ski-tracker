// The function createResortMarkers is a function that takes in the json data from the json
// file created by query.ipynb as well as user input for starting coordinates. It then assigns
// each of the resorts to a layer depending on which resort passes they accept.
//
// It also assigns marker fill color based on snow forecast. The markers, when clicked,
// display the name of the resort, how far (in miles) they are frm the user's starting coordinates,
// and the forecast information.

function createResortMarkers(data, startPoint) {

    // Save the imported data to an object and declare the arrays
    // to which resorts will be added for each layer based on resort passes.
    let resorts = data;
    let ikonPasses = [];
    let epicPasses = [];
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
        
      // Set fillColor based on snow forecast
      let fillColor = 'black';
      let snow_info = "";

      // Assign green to resorts with chance of snow within 12 hours
      if (resort.snow_firstperiod === true) {
        fillColor = 'green';
        if (resort.country === "CA") {
          snow_info = "Forecast (12 Hours): " + resort.forecast_firstperiod;
        } else {
        snow_info = "Chance of Snow (12 Hours): " + resort.precip_chance_firstperiod + "%";
        }

      // Assign yellow to resorts with chance of snow between 12 and 24 hours
      } else if (resort.snow_seconderiod === true) {
        fillColor = 'yellow';
        if (resort.country === "CA") {
          snow_info = "Forecast (24 Hours): " + resort.forecast_secondperiod;
        } else {
          snow_info = "Chance of Snow (24 Hours): " + resort.precip_chance_secondperiod + "%";
        }

      // Assign orange to resorts with chance of snow beween 24 and 48 hours
      } else if (resort.snow_thirdperiod === true || resort.snow_fourthperiod === true) {
        fillColor = 'orange';
        if (resort.country === "CA") {
          snow_info = "Forecast (48 Hours): " + resort.forecast_fourthperiod;
        } else {
          let snowChance = Math.max(resort.precip_chance_thirdperiod, resort.precip_chance_fourthperiod);
          snow_info = "Chance of Snow (48 Hours): " + snowChance + "%";
        }
      }

      // Assign the resort to one of the arrays depending on resort pass.
      // First assign resorts for Epic passes. 
      if (resort['pass type'] === 'Epic') {
        epicPasses.push(L.circle([lat, long], {
          color: fillColor,
          fillColor: fillColor,
          fillOpacity: 0.75,
          radius: radius
      }).bindPopup("<h3>Name: " + name + "<h3><h3>" + distance + " miles away<h3><h3>" + snow_info));

      // Next assign resorts for Ikon passes
      } else if (resort['pass type'] === 'Ikon') {
        ikonPasses.push(L.circle([lat, long], {
          color: fillColor,
          fillColor: fillColor,
          fillOpacity: 0.75,
          radius: radius
      }).bindPopup("<h3>Name: " + name + "<h3><h3>" + distance + " miles away<h3><h3>" + snow_info));

      // Assign all the remaining resorts to their own array 
      } else {
        remainderResorts.push(L.circle([lat, long], {
          color: fillColor,
          fillColor: fillColor,
          fillOpacity: 0.75,
          radius: radius
        }).bindPopup("<h3>Name: " + name + "<h3><h3>" + distance + " miles away<h3><h3>" + snow_info));
      } 
    };

    // Create the tile layer that will be the background of the map
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the layer group for resorts with Epic passes
    let epicPassGroup = L.layerGroup(epicPasses);
    
    // Create the layer group for resorts with Ikon passes
    let ikonPassGroup = L.layerGroup(ikonPasses);
        
    // Create an array with all the resorts and assign to resort group
    let tempArray1 = epicPasses.concat(ikonPasses);
    let allResortArray = tempArray1.concat(remainderResorts);
    let allResortsGroup = L.layerGroup(allResortArray);

    // Assign street map to base layer
    let baseMap = {
      "Street Map": streetmap
    };

    // Assign the different layer groups to the overlay layers
    let overlayMaps = {
      "Epic Resort Pass": epicPassGroup,
      "Ikon Resort Pass": ikonPassGroup,
      "All Resorts": allResortsGroup
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