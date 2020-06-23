"use strict";

function init() {

  var pointsURL =
    "https://docs.google.com/spreadsheets/d/12Pzc3r2SvfQvTBFy6JuSBfVzBK714rmzTeI8vO_Hiw8/edit?usp=sharing";

  Tabletop.init({ key: pointsURL, callback: addPoints, simpleSheet: true }); // simpleSheet assumes there is only one table and automatically sends its data
}
window.addEventListener("DOMContentLoaded", init);



var map = L.map("map").setView([25.3921, 88.9546], 13);

var hash = new L.Hash(map);


var basemap = L.tileLayer(
  "https://raw.githubusercontent.com/arahmandc/birampur/master/gameimage/{z}/{x}/{y}.png",
  {
    attribution:"",
    subdomains: "abcd",
    maxZoom: 19,
    minZoom: 12
  }
);

basemap.addTo(map);




L.control.scale().addTo(map);



map.zoomControl.setPosition('bottomleft');




  var bounds_group = new L.featureGroup([]);
  function setBounds() {
  if (bounds_group.getLayers().length) {
    map.fitBounds(bounds_group.getBounds());
  }
  map.setMaxBounds([[25.29,88.83],[25.49,89.09]]);
}
setBounds();



var pointGroupLayers = [];



// Predefined list of categories. To be used to match indexes for the
// "pointGroupLayers" array.
// There must be at least one POI for every category listed here. Otherwise,
// the "featureGroup" creation for Leaflet Search will throw errors.
let categories = [
  // "Bakery",
  // "Coffee shop",
  // "Restaurant",
  // "Store",
  // "Supermarket",
  "education",
  "health",
  "pharmacy",
  // "doctors",
  "training_center",
  "bank",
  "courier",
  // "fuel",
  "atm",
];



var geojson = {
    'type': 'FeatureCollection',
    'features': []
  };



// Match with the "categories" array, and add the corresponding layer to
// the map.
// The function parameter must exactly match a value from the "categories"
// array.
let add_layer = function (category) {
  let index = categories.indexOf(category);
  if (index > -1) {
    map.addLayer(pointGroupLayers[index]);
  }
}



// Remove all existing layers from the map.
let remove_all_layers = function () {
  pointGroupLayers.forEach(function (layer) {
    map.hasLayer(layer) && map.removeLayer(layer);
  });
}



// Add appropriate layer(s) based on passed zoom level.
// The parameter (layer name) that is passed to the "add_layer()" function
// must exactly match a value from the "categories" array.
let add_layer_for_zoom = function (zoom_level) {

  if (zoom_level > 15) {
    add_layer("education");
    add_layer("pharmacy");
  }

  if (zoom_level == 12) {
    add_layer("education");
    add_layer("health");
  } else if (zoom_level == 13) {
    add_layer("pharmacy");
  } else if (zoom_level == 14) {
    add_layer("training_center");
  } else if (zoom_level == 15) {
    add_layer("bank");
    add_layer("courier");
  } else {
    add_layer("atm");
  }

}



// Show different layers at different zoom levels.
map.on("zoomend", function () {
  remove_all_layers();
  add_layer_for_zoom( map.getZoom() );
});



function addPoints(data) {

  if (pointGroupLayers.length) {
    remove_all_layers();
  }

  for (var row = 0; row < data.length; row++) {

    var marker = L.marker([data[row].lat, data[row].long]);

    // Add each marker to its corresponding category layer. (Create if layer
    // does not exist.)
    let index = categories.indexOf(data[row].category);
    if (index > -1) {
      if (!pointGroupLayers[index]) {
        pointGroupLayers[index] = L.layerGroup().addTo(map);
      }
      marker.addTo(pointGroupLayers[index]);
    }

    marker.bindPopup('<b style="text-align:center">'+ data[row].Name +'</b><br> <b>Operator:</b>'+data[row].group +'<br><b>Address:</b>'+data[row].group +'<br><b>Contact Number:</b>'+data[row].group);

    marker.feature ={
      properties: {
        Name: data[row].Name,
        lat: data[row].lat,
        long: data[row].long,
        group: data[row].group,
        category: data[row].category
      }
    };
    marker.on({
      click: function(e) {
        L.DomEvent.stopPropagation(e);  
      }
    });

    // Get different icon URLs based on category.
    let get_icon_url = function (category) {
      return category === "education" ? "images/custom-icon-1.png"
        : category === "health" ? "images/custom-icon-2.png"
        : category === "pharmacy" ? "images/custom-icon-3.png"
        : category === "bank" ? "images/custom-icon-4.png"
        : "images/custom-icon.png";
    }

    var icon = L.icon({
      iconUrl: get_icon_url(data[row].category),
      // shadowUrl: 'custom-icon-shadow.png',
      // iconSize:     [38, 95], // size of the icon
      // shadowSize:   [50, 64], // size of the shadow
      // iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      // shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [20, 0] // point from which the popup should open relative to the iconAnchor
    });
    marker.setIcon(icon);
  }

  // Add search control after data loading is complete.
  add_search_control();

  // Only show the layer(s) corresponding to the current zoom level.
  remove_all_layers();
  add_layer_for_zoom( map.getZoom() );

}




map.addControl( new L.Control.Compass({position: "topright", title: "Compass"}) );

L.control.locate().addTo(map);

let add_search_control = function () {
 //search options
      map.addControl(new L.Control.Search({
            layer: L.featureGroup(pointGroupLayers),    // Create "featureGroup" to pass array of layers
            initial: false,
            hideMarkerOnCollapse: true,
            propertyName: 'Name'}));
        document.getElementsByClassName('search-button')[0].className +=
         '';
}









    // slide menu contents and position

  // var contents = '<h4 style="text-align:center">Birampur Map</h4>';
  var contents = '<img src="images/bmap.png" alt="BirampurMap" width="300">';
  contents += '<h5>Mobile-friendly web maps<br>with importent location markers.</h5>';
  
  // contents += '<img src="images/BikeMapCodeKey.png" alt="BikeMapCode key" width="196" height="299">';
  // contents += '<p>Distributed as-is with no warranty</p>';
  // contents += '<p>Stop your bike in a safe place before using</p>';
  contents += '<p>Requires internet access to view maps and location</p>';
  contents += '<p>Allow smartphone browser to show your location<br> Phone > Settings > Privacy > Location Services (On) > While Using<br></p>';
  contents += '<p>Click OK if browser asks permission to show your location</p>';
  contents += '<a href="https://www.facebook.com/groups/birampurmap" target:"_blank"> <img src="images/birampurfb.png" alt="Facebook" width="300" height="120"> </a>';
  // contents += '<h5>Open Cycle Map layer legend</h5>';
  // contents += '<img src="images/OpenCycleMapKey.png" alt="OpenCycleMap key" width="290" height="438">';
  var slideMenu = L.control.slideMenu('', {position: 'topright', width: '300px',  height: '100%', delay: '1'}).addTo(map);
  slideMenu.setContents(contents);


