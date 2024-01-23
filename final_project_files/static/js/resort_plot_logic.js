// The function createResortMarkers is a function that creats a map with markers for each
// resort in the Mongo database. The function takes three arguments:
//
//        data - json data from resort_data.json, which is created by query.ipynb
//        startPoint - user input on their current location to calculate the distance to each
//      resort
//        forecast - user input for what time period (either 12, 24, 36, or 48 hours ahead) they
//      want snow forecast information for
//
// The file resort_data.json contains information on each ski resort (which is stored in the Mongo database)
// as well as weather data pulled from American and Canadian weather APIs.
//
// The createResortMarkers function assigns markers to three overlay layers corresponding to the lift passes accepted
// at each ski resort. The layers are "Ikon", "Epic", and "All Resorts" and can be selected by the user in the map.
//
// The color of each marker corresponds to the snow forecast. The colors are assigned as follows:
//
//         Green: the ski resort has snow in the forecast at the specified time period with chances >= 50%
//         Yellow: the ski resort has snow in the forecast at the specified time period with chances < 50%
//         Blue: the ski resort has snow in the forecast at the specified time period with no precipitation
//       probability data available
//         Black: the ski resort either doesn't have snow in the forecast at the specified time period or weather data
//       is unavailable.

function createResortMarkers(data, startPoint, forecast) {

    // Save the imported data to an object and declare the arrays to which resorts
    // will be added for each overlay layer based on accepted resort passes
    let resorts = data;
    let ikonPasses = [];
    let epicPasses = [];
    let remainderResorts = [];

    // Use the user's forecast time period selection to determine which forecast data to display
    if (forecast == "12") {
      forecastChoice = "firstperiod";
    } else if (forecast == "24") {
      forecastChoice = "secondperiod";
    } else if (forecast == "36") {
      forecastChoice = "thirdperiod";
    }  else if (forecast == "48") {
        forecastChoice = "fourthperiod";
    };

    // Iterate through the resorts in the imported data
    for (let index=0; index<resorts.length; index++) {

      // Assign the current resort to an object
      let resort = resorts[index];
        
      // Set coordinates and resort name
      let lat = resort.location.latitude;
      let long = resort.location.longitude;
      let name = resort.name;

      // Find the distance to the resort using the Turf library and the user-input lat/long coordinates
      fromPoint = turf.point(startPoint);
      destPoint = turf.point([lat, long]);
      let options = {units: 'miles'};
      let distance = Math.round(turf.distance(fromPoint, destPoint, options));

      // Set the marker circle radius
      let radius = 10000;
        
      // Initialize fillColor and forecast data to display
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
      };

      // Assign the resort to one of the arrays depending on which lift pass the resort accepts.
      // First assign resorts for Epic passes. 
      if (resort.pass_type === 'Epic') {
        epicPasses.push(L.circle([lat, long], {
          color: fillColor,
          fillColor: fillColor,
          fillOpacity: 0.75,
          radius: radius
      }).bindPopup("<h3>Name: " + name + "<h3><h3>" + distance + " miles away<h3><h3>" + snow_info + "<h3><h3>" + snow_chance + "</h3>"));

      // Next assign resorts for Ikon passes
      } else if (resort.pass_type === 'Ikon') {
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

    // Create the tile layer that will be the background of the map
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create the layer group for resorts with Epic passes
    let epicPassGroup = L.layerGroup(epicPasses);
    
    // Create the layer group for resorts with Ikon passes
    let ikonPassGroup = L.layerGroup(ikonPasses);
        
    // Create an array with all the resorts and assign them to allResortsGroup
    let tempArray1 = epicPasses.concat(ikonPasses);
    let allResortArray = tempArray1.concat(remainderResorts);
    let allResortsGroup = L.layerGroup(allResortArray);

    // Set the street map as the base layer
    let baseMap = {
      "Street Map": streetmap
    };

    // Assign the different layer groups to the overlay layers
    let overlayMaps = {
      "Epic Resort Pass": epicPassGroup,
      "Ikon Resort Pass": ikonPassGroup,
      "All Resorts": allResortsGroup
    };

    // Create the map with just the base layer initially showing and none of the overlay layers pre-selected
    let myMap = L.map("map", {
    center: [40, -100],
    zoom: 5,
    layers: [streetmap]
    });

    // Add the layer control function
    L.control.layers(baseMap, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // Create a legend to the map
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let categories = ['> 50%','< 50%','% Unavailable','No Snow Forecast'];
      let labelColors = ['green', 'yellow', 'blue', 'black'];

      let legendInfo = "<h1>Chance of Snow<br /></h1>" +
                      "<div class=\"labels\">" +
                      "<div class=\"first\">" + categories[0] + " <span class=\"color-block\" style=\"background-color: " + labelColors[0] + "\"></span></div>" +
                      "<div class=\"second\">" + categories[1] + " <span class=\"color-block\" style=\"background-color: " + labelColors[1] + "\"></span></div>" +
                      "<div class=\"third\">" + categories[2] + " <span class=\"color-block\" style=\"background-color: " + labelColors[2] + "\"></span></div>" +
                      "<div class=\"fourth\">" + categories[3] + " <span class=\"color-block\" style=\"background-color: " + labelColors[3] + "\"></span></div>" +
                      "</div>";

      div.innerHTML = legendInfo;

      return div;
    };

  // Add the legend to the map
  legend.addTo(myMap);
};

// Prompt the user for starting coordinates. For Phoenix enter lat: 33.5, long: -112
const userLatString = prompt("Please Enter Your Starting Latitude (33.5 for Phoenix): ");
const userLongString = prompt("Please Enter Your Starting Longitude (-112 for Phoenix): ");
const userStartPoint = [parseFloat(userLatString), parseFloat(userLongString)];


// Use createResortMarkers function to create the map from the imported resort data
d3.json("resort_data.json").then((importedData) => {

  // Prompt the user for forecast period selection (either 12, 24, 36, or 48 hours ahead)
  const forecastSelection = prompt("Please enter 12, 24, 36 or 48 for forecast period: ");

  // Create the map using the user input
  createResortMarkers(importedData, userStartPoint, forecastSelection);
});