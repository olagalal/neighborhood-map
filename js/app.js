'use strict';

/* Global Varibales */
var map, infowindow, marker;

/* Locations of the map */
var locations = [
	{
		locationname: 'Lahalebo Restaurants',
		lat: 30.7884573,
		lng: 30.9978712,
    },
	{
		locationname: 'Martin Juice',
		lat: 30.7964486,
		lng: 31.0008008,
    },
	{
		locationname: 'Desoky And Soda',
		lat: 30.7937944,
		lng: 31.0012675,
    },
	{
		locationname: 'Stereo Restaurant And Cafe',
		lat: 30.7934105,
		lng: 31.0017993,
    },
	{
		locationname: 'Spectra Restaurant & Cafe',
		lat: 30.7947187,
		lng: 30.9964809,
    },
];

var viewModel = function () {

	var currentInfoWindow = null; 
	var x = this;
	x.selectLocation = ko.observableArray([]);

	/* Put Location Markers */
	locations.forEach(function (loc) {
		var marker = new google.maps.Marker({
			locationname: loc.locationname,
			position: {
				lat: loc.lat,
				lng: loc.lng
			},
			map: map
		});

		x.selectLocation.push(marker);

		/* Put Location Infowindow */
		var infowindow = new google.maps.InfoWindow({
			content: '<p>Marker Location: ' + marker.locationname + '</p>'
		});

		google.maps.event.addListener(marker, 'click', function () {
			if (currentInfoWindow != null) {
				currentInfoWindow.close();
			}
			infowindow.open(map, marker);
			currentInfoWindow = infowindow;
		});

	});

};



/* Ininalize the Map */
function initMap() {

	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 30.7974773,
			lng: 31.0005147
		},
		zoom: 15
	});


	infowindow = new google.maps.InfoWindow();
	ko.applyBindings(new viewModel());

}

/* Handle Error of Map Loading */
var mapFail = function () {
	let el = document.getElementById('map').innerHTML = `
  <div class="row column">
    <div class="large alert callout">
      <h3>Whoops!</h3>
      <p>It seems something has gone terribly wrong... :(</p>
    </div>
  </div>
  `;
};
