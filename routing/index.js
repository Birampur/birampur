var map = L.map('map');

// https://raw.githubusercontent.com/Birampur/tile-a/main/{z}/{x}/{y}.png
// http://{s}.tile.osm.org/{z}/{x}/{y}.png

L.tileLayer('https://raw.githubusercontent.com/Birampur/tile-a/main/{z}/{x}/{y}.png', {
	maxZoom: 18,
    minZoom: 12,
	attribution: ''
}).addTo(map);


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

var control = L.Routing.control(L.extend(window.lrmConfig, {
	waypoints: [
		L.latLng(25.36477,89.00008),
		L.latLng(25.39438,88.99476)
	],
	geocoder: L.Control.Geocoder.nominatim(),
	routeWhileDragging: true,
	reverseWaypoints: true,
	showAlternatives: true,
	altLineOptions: {
		styles: [
			{color: 'black', opacity: 0.15, weight: 9},
			{color: 'white', opacity: 0.8, weight: 6},
			{color: 'blue', opacity: 0.5, weight: 2}
		]
	}
})).addTo(map);




// L.Routing.errorControl(control).addTo(map);

// https://www.openstreetmap.org/?mlat=25.38989&mlon=88.99068#map=19/25.38989/88.99068
// https://www.openstreetmap.org/?mlat=25.3948&mlon=88.9823#map=15/25.3948/88.9823


 


