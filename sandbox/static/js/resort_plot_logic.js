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

let MongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017';
let dbName = 'ski-tracker-master-db';
let client = new MongoClient(url, { useUnifiedTopology: true });

// Connect to the MongoDB server
client.connect(function(err) {
    if (err) {
      console.error('Error connecting to MongoDB:', err);
      return;
    }  
    console.log('Connected to MongoDB');
  
    // Select the database
    let db = client.db(dbName);
  
    // Perform your query
    let collection = db.collection('resort_master');
  
    // Example query: Find all documents in the collection
    collection.find({}).toArray(function(err, documents) {
      if (err) {
        console.error('Error executing query:', err);
        return;
      }
  
      console.log('Query result:', documents);
  
      // Close the connection
      client.close();
    });
  });

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