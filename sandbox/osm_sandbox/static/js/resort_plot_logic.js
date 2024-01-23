// The function createResortMarkers is a function that takes in the json data from the json
// file created by query.ipynb as well as user input for starting coordinates. It then assigns
// each of the resorts to a layer depending on which resort passes they accept.
//
// It also assigns marker fill color based on snow forecast. The markers, when clicked,
// display the name of the resort, how far (in miles) they are frm the user's starting coordinates,
// and the forecast information.
// Create the layer for OpenSnowMap, which contains slope information

// install leaflet-extras package in the terminal using 
// npm install leaflet-providers 

// define the OpenSnowMap layer
let OpenSnowMap_pistes = L.tileLayer('https://tiles.opensnowmap.org/pistes/{z}/{x}/{y}.png', {
  minZoom: 9,
  maxZoom: 18,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & ODbL, &copy; <a href="https://www.opensnowmap.org/iframes/data.html">www.opensnowmap.org</a> <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
});

// Create the tile layer that will be the background of the map
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create the map with just the base layer initially showing
let myMap = L.map("map", {
  center: [40, -100],
  zoom: 5,
  layers: [streetmap]
  });

function createResortMarkers(data, startPoint, forecast) {

    // Save the imported data to an object and declare the arrays
    // to which resorts will be added for each layer based on resort passes.
    let resorts = data;
    let ikonPasses = [];
    let epicPasses = [];
    let remainderResorts = [];

    // Use the user's forecast selection to determine which data to display
    if (forecast == "12") {
      forecastChoice = "firstperiod";
    } else if (forecast == "24") {
      forecastChoice = "secondperiod";
    } else if (forecast == "36") {
      forecastChoice = "thirdperiod";
    }  else if (forecast == "48") {
        forecastChoice = "fourthperiod";
    }

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
        
      // Initialize fillColor and snow info to display
      let fillColor = 'black';
      let snow_info = "";
      let snow_chance = "";

      // Assign fill color and snow info to Canadian resorts with snow in the forecast.
      // Since the Canadian weather data does not include chance of precipitation, the
      // markers will appear blue if snow is in the forecast and stay black otherwise.
      if (resort.country === "CA") {
        if (resort['snow_' + forecastChoice] === true) {
          fillColor = 'blue';
        }
        snow_info = "Forecast: " + resort['forecast_' + forecastChoice];
      } else if (resort['snow_' + forecastChoice] === true) {
        
        // For American ski resorts with snow in the forecast, include displays for forecast
        // summary as well as chance of snow.
        snow_chance = "Chance of Snow: " + resort['precip_chance_' + forecastChoice] + "%";
        snow_info = "Forecast: " + resort['forecast_' + forecastChoice];

        // Assign green fill color if the chance of snow is >= 50% and yellow otherwise
        if (resort['precip_chance_' + forecastChoice] >= 50) {
          fillColor = 'green';
        } else {
          fillColor = 'yellow';
        }
      } else {
        // For American resorts with no snow in the forecast, just display the forecast summary
        // and keep fill color black.
        snow_info = "Forecast: " + resort['forecast_' + forecastChoice];
      }

      // Assign the resort to one of the arrays depending on resort pass.
      // First assign resorts for Epic passes. 
      if (resort['pass type'] === 'Epic') {
        epicPasses.push(L.circle([lat, long], {
          color: fillColor,
          fillColor: fillColor,
          fillOpacity: 0.75,
          radius: radius
      }).bindPopup("<h3>Name: " + name + "<h3><h3>" + distance + " miles away<h3><h3>" + snow_info + "<h3><h3>" + snow_chance + "</h3>"));

      // Next assign resorts for Ikon passes
      } else if (resort['pass type'] === 'Ikon') {
        ikonPasses.push(L.circle([lat, long], {
          color: fillColor,
          fillColor: fillColor,
          fillOpacity: 0.75,
          radius: radius
      }).bindPopup("<h3>Name: " + name + "<h3><h3>" + distance + " miles away<h3><h3>" + snow_info + "<h3><h3>" + snow_chance + "</h3>"));

      // Assign all the remaining resorts to their own array 
      } else {
        remainderResorts.push(L.circle([lat, long], {
          color: fillColor,
          fillColor: fillColor,
          fillOpacity: 0.75,
          radius: radius
        }).bindPopup("<h3>Name: " + name + "<h3><h3>" + distance + " miles away<h3><h3>" + snow_info + "<h3><h3>" + snow_chance + "</h3>"));
      } 
    };


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
      "All Resorts": allResortsGroup,
      "Slope Details": OpenSnowMap_pistes
    };

    // // Add the layer control function
    // L.control.layers(baseMap, overlayMaps, {
    //   collapsed: false
    // }).addTo(myMap);

    // define a layer control function
    let layerControl = L.control.layers(baseMap, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // add the OpenSnowMap as an overlay layer
    // layerControl.addOverlay(OpenSnowMap_pistes, "Slope details").addTo(myMap)

    // // add OpenSnowMap as a base layer option
    // let layerControl = L.control.layers(baseMap, overlayMaps).addTo(myMap);
    // L.tileLayer.provider('OpenSnowMap.pistes').addTo(myMap);
    // layerControl.addBaseLayer(OpenSnowMap_pistes, 'Slope details');
};

// Prompt the user for starting coordinates
// const userLatString = prompt("Please Enter Your Starting Latitude: ");
// const userLongString = prompt("Please Enter Your Starting Longitude: ");
// const userStartPoint = [parseFloat(userLatString), parseFloat(userLongString)];
const userStartPoint = [33.83, -111.95];

// Prompt the user for forecast period selection: 12 hour, 24 hour, 36 hour, 48 hour
const forecastSelection = prompt("Please enter 12, 24, 36 or 48 for forecast period: ");

// Use createResortMarkers function to create the map from the imported resort data
d3.json("resort_data.json").then((importedData) => {
  createResortMarkers(importedData, userStartPoint, forecastSelection);
});
