// store our API endpoint url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";

// perform the get request that queries the url
d3.json(url).then(function (data) {
    // console.log the data
    console.log(data);
    // wait for the response then send data.feature object to the createFeatures function
    createFeatures(data.features)
});

// create the marker size
function markerSize(magnitude) {
    return magnitude * 25000;
};

// create the color scale for depth
function colorScale(depth) {
    if (depth > 90) return 'red';
    else if (depth > 70) return 'orangered';
    else if (depth > 50) return 'orange';
    else if (depth > 30) return 'yellow';
    else if (depth > 10) return 'greenyellow';
    else return 'green';
};

function createFeatures(earthquakeData) {
    // create the popup
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h2>${feature.properties.place}</h2><hr><h3>${new Date(feature.properties.time)}</h3><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p><p>Lat: ${feature.geometry.coordinates[1]}, Lon: ${feature.geometry.coordinates[0]}</p>`);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        // bind to the marker layer
        pointToLayer: function(feature, latlon) {
            
            // set the style of the markers
            let eqMarkers = {
                radius: markerSize(feature.properties.mag),
                fillColor: colorScale(feature.geometry.coordinates[2]),
                fillOpacity: .5,
                color: colorScale(feature.geometry.coordinates[2]),
                stroke: true,
                weight: .5
            }
            // make a circle
            return L.circle(latlon, eqMarkers);
        }
    });

    // send to the createMap function
    createMap(earthquakes);

}

// create the map using the openstreetmaps.org map we've been using in class
function createMap(earthquakes) {

    // create the tile layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    // create myMap
    let myMap = L.map('map', {
        center: [35, -100],
        zoom: 3.5,
        layers: [street, earthquakes]
    });

    // create an info pannel
    let info = L.control({position: 'topright'});
    info.onAdd = function() {
        let div = L.DomUtil.create("div", "info");
        let title = "<h1>Recorded Earthquakes (last 7 days)</h1>"
        div.innerHTML = title;

        return div;
    }

    // create a legend
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "legend"),
        depth = [-10, 10, 30, 50, 70, 90];

        div.innerHTML += "<h4 style='text-align: center'>Depth (km)</h4>"

        for (let i = 0; i < depth.length; i++) {
            div.innerHTML +=
            '<i style="background:' + colorScale(depth[i] + 1) + '"></i> ' + depth[i] + (depth [i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
    };
    info.addTo(myMap)
    legend.addTo(myMap)
}