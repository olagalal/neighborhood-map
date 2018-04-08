'use strict';

/* Global Varibales */
var map, infowindow, marker;

/* Locations of the map */
var locations = [
	{
		locationname: 'Khan el-Khalili',
		lat: 30.0477,
		lng: 31.26230,
		wikiID: 'Khan_el-Khalili',
    },
	{
		locationname: 'Egyptian Museum',
		lat: 30.047503,
		lng: 31.233702,
		wikiID: 'Egyptian_Museum',
    },
	{
		locationname: 'Al-Hakim Mosque',
		lat: 30.0546,
		lng: 31.2642,
		wikiID: 'Al-Hakim_Mosque',
    },
	{
		locationname: 'Mosque of Muhammad Ali',
		lat: 30.0287,
		lng: 31.2599,
		wikiID: 'Mosque_of_Muhammad_Ali',
    },
	{
		locationname: 'Tahrir Square',
		lat: 30.0444,
		lng: 31.2357,
		wikiID: 'Tahrir_Square',
    }, {
		locationname: 'Cairo Tower',
		lat: 30.045916,
		lng: 31.224291,
		wikiID: 'Cairo_Tower',
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
			wikiID: loc.wikiID,
			position: {
				lat: loc.lat,
				lng: loc.lng
			},
			map: map
		});

		/* Array of Location as Markers */
		selectLocation.push(marker);

		/* Wikipedia API*/

		var wikiSource = 'https://en.wikipedia.org/wiki/' + loc.wikiID;

		var wikiURL = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + loc.wikiID;
		$.ajax({
			type: 'GET',
			dataType: 'jsonp',
			data: {},
			url: wikiURL
		}).done(function (response) {
			var extract = response.query.pages[Object.keys(response.query.pages)[0]].extract;
			infowindow.setContent('<div>' + '<h4>' + loc.locationname + '</h4>' + extract + '<br>(Source: ' + '<a href=' + wikiSource + '>Wikipedia)</a>' + '</div>');

			//Set Content if failure of AJAX request
		}).fail(function (jqXHR, textStatus, errorThrown) {
			infowindow.setContent('<div>' + 'No Service/ Connection Detected (Please try again later)' + '</div>');
		});

		var infowindow = new google.maps.InfoWindow();

		/* Put Location Infowindow Action Listner */
		google.maps.event.addListener(marker, 'click', function () {
			if (currentInfoWindow != null) {
				currentInfoWindow.close();
			}
			infowindow.open(map, marker);
			currentInfoWindow = infowindow;

			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function () {
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
	$("#names li").click(function (loc) {
		var currentLocation = selectLocation()[this.id];

		//Animate its marker
		currentLocation.setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function () {
			currentLocation.setAnimation(null);
		}, 1000);

		/* Show InfoWindown */
		var wikiSource = 'https://en.wikipedia.org/wiki/' + currentLocation.wikiID;

		var wikiURL = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + currentLocation.wikiID;
		$.ajax({
			type: 'GET',
			dataType: 'jsonp',
			data: {},
			url: wikiURL
		}).done(function (response) {
			var extract = response.query.pages[Object.keys(response.query.pages)[0]].extract;
			infowindow.setContent('<div>' + '<h4>' + currentLocation.locationname + '</h4>' + extract + '<br>(Source: ' + '<a href=' + wikiSource + '>Wikipedia)</a>' + '</div>');

			//Set Content if failure of AJAX request
		}).fail(function (jqXHR, textStatus, errorThrown) {
			infowindow.setContent('<div>' + 'No Service/ Connection Detected (Please try again later)' + '</div>');
		});

		var infowindow = new google.maps.InfoWindow();

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
			lat: 30.046345,
			lng: 31.24171
		},
		zoom: 14
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