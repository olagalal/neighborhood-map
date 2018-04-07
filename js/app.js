function initMap() {

	var map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 30.7974773,
			lng: 31.0005147
		},
		zoom: 13
	});


	var infowindow = new google.maps.InfoWindow();
	ko.applyBindings(new viewModel());

	/*var marker = new google.maps.Marker({
		position:,
		map: map,
		title: 
	});
	
	marker.addListener('click', function () {
		infowindow.open(map, marker);
	});
	
	*/
}

function HandleError() {
	alert('Invalid Map');
}