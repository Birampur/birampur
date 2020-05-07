
// init() is called as soon as the page loads
function init() {
    // PASTE YOUR URLs HERE
    // simpleSheet assumes there is only one table and automatically sends its data 
    var pointsURL = 'https://docs.google.com/spreadsheets/d/12Pzc3r2SvfQvTBFy6JuSBfVzBK714rmzTeI8vO_Hiw8/edit?usp=sharing';
    Tabletop.init({ key: pointsURL, callback: addPoints, simpleSheet: true }); 

}
window.addEventListener("DOMContentLoaded", init);


var map = L.map('map').setView([23.403, 90.303],6);
map.zoomControl.remove();

var hash = new L.Hash(map);

let tile_url = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

let attr_html = "&copy;" +
    (map_lang === "bn" ? " মানচিত্রের তথ্যের উৎস: " : " Map Data courtesy: ") +
    "<a href='https://www.iedcr.gov.bd/' target='_blank'>" +
    (map_lang === "bn" ? "আইইডিসিআর" : "IEDCR") +
    "</a>, " +
    "<a href='https://osm.org/' target='_blank'>" +
    (map_lang === "bn" ? "ওপেনস্ট্রিটম্যাপ" : "OpenStreetMap") +
    "</a>";

var base_map = L.tileLayer(tile_url, {
    attribution: attr_html,
    subdomains: "abcd",
    maxZoom: 12,
    minZoom: 6
});
base_map.addTo(map);






//Scale
// L.control.scale().addTo(map);

var pointGroupLayer;

var geojsonStates = {
    'type': 'FeatureCollection',
    'features': []
};



function addPoints(data) {
    if (pointGroupLayer != null) {
        pointGroupLayer.remove();
    }
    pointGroupLayer = L.layerGroup().addTo(map);

    for(var row = 0; row < data.length; row++) {
        var marker = L.marker([data[row].lat, data[row].long]).addTo(pointGroupLayer);

        marker.feature = {
            properties: {
                location: data[row].Name,
            }
        };
        marker.on({
            click: function(e) {
                L.DomEvent.stopPropagation(e);
            }
        });

        var icon = L.AwesomeMarkers.icon({
            icon: 'info-sign',
            iconColor: 'white',
            prefix: 'glyphicon',
            extraClasses: 'fa-rotate-0'
        });
        marker.setIcon(icon);
    }
}

/**
 * Returns different icon names depending on the string passed.
 */
function getIcon(type) {
    switch (type) {
        case "Bakery": return "birthday-cake";
        case "Coffee shop": return "coffee";
        case "Restaurant": return "cutlery";
        case "Store": return "shopping-basket"; // orange-gold
        case "Supermarket": return "shopping-cart"; // red
        default: return "info"; // pink
    }
}


map.addControl( new L.Control.Compass({position: "topright"}) );

 //Scale
    L.control.scale().addTo(map);

    L.control.locate().addTo(map);

    map.zoomControl.setPosition('bottomleft');

 //search options
      map.addControl(new L.Control.Search({
            // layer: layer_OsmFile_3,
            initial: false,
            hideMarkerOnCollapse: true,
            propertyName: 'Name'}));
        document.getElementsByClassName('search-button')[0].className +=
         ' fa fa-binoculars';


    //bound box
  var bounds_group = new L.featureGroup([]);
  function setBounds() {
  if (bounds_group.getLayers().length) {
    map.fitBounds(bounds_group.getBounds());
  }
  map.setMaxBounds([[25.29,88.83],[25.49,89.09]]);
}
setBounds();



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
  contents += '<a href="#" ; target:"_blank"> <img src="images/birampurfb.png" alt="Facebook" width="300" height="120"> </a>';
  // contents += '<h5>Open Cycle Map layer legend</h5>';
  // contents += '<img src="images/OpenCycleMapKey.png" alt="OpenCycleMap key" width="290" height="438">';
  var slideMenu = L.control.slideMenu('', {position: 'topright', width: '300px',  height: '100%', delay: '1'}).addTo(map);
  slideMenu.setContents(contents);