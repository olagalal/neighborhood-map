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

/* View Model */
var viewModel = function () {

	var currentInfoWindow = null;
	var x = this;
	var selectLocation = ko.observableArray([]);
	x.filterVar = ko.observable("");

	var list = document.getElementById('names');
	var index = 0;

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

		/* Array of Location as Markers */
		selectLocation.push(marker);

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
			
			marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1200);
			
		});

		/* Add Locations as List */
		var listElement = document.createElement('li');
		listElement.appendChild(document.createTextNode(loc.locationname));
		list.appendChild(listElement);
		/* Add Attribute id to each li */
		var att = document.createAttribute("id");
		att.value = index;
		index++;
		listElement.setAttributeNode(att);

	});
	
	/* Event Listener of click on location on the list */
	$("#names li").click(function(){
		var currentLocation = selectLocation()[this.id];
		//alert(selectLocation()[this.id].locationname);
		
		//Animate its marker
		currentLocation.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    currentLocation.setAnimation(null);
                }, 1000);
		
		//Show InfoWindow
		var infowindow = new google.maps.InfoWindow({
			content: '<p>Marker Location: ' + currentLocation.locationname + '</p>'
		});
		
		if (currentInfoWindow != null) {
				currentInfoWindow.close();
			}
				
		currentInfoWindow = infowindow;

		infowindow.open(map, currentLocation);
		
	});


	/* Event of Filter the locations */
	x.filteredLocation = function (input) {

		//Clear previous list
		while (list.firstChild) {
			list.removeChild(list.firstChild);
		}

		//Show Filtered only
		for (var i = 0; i < selectLocation().length; i++) {
			//List
			if (selectLocation()[i].locationname.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
				var listElement = document.createElement('li');
				listElement.appendChild(document.createTextNode(selectLocation()[i].locationname));
				list.appendChild(listElement);


			} else {
				selectLocation()[i].setMap(null);
			}
		}
	};

	/* View All Locations */
	x.allLocation = function () {
		//Clear previous list
		while (list.firstChild) {
			list.removeChild(list.firstChild);
		}

		//All list
		locations.forEach(function (loc) {
			var listElement = document.createElement('li');
			listElement.appendChild(document.createTextNode(loc.locationname));
			list.appendChild(listElement);

		})

		for (var i = 0; i < selectLocation().length; i++) {
			selectLocation()[i].setMap(map);
		}
	};

	/* Filter Button Action */
	x.toFilter = function () {

		var filterInput = x.filterVar();
		infowindow.close;

		if (filterInput.length == 0) {
			x.allLocation();
		} else {
			x.filteredLocation(filterInput);
		}
		infowindow.close();

	};

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
