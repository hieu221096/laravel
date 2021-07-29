function initMap() {
  clearStorage(localStorage.getItem('click'));
  const myLatlng = { lat: 38.2682, lng: 140.8694 };
  let markers = [];
  var click = 0;
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const geocoder = new google.maps.Geocoder();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: myLatlng,
  });

   // Create the initial InfoWindow.
  let infoWindow = new google.maps.InfoWindow({
    content: '',
    position: myLatlng,
  });
  infoWindow.open(map);
   // Configure the click listener.
  map.addListener("click", (mapsMouseEvent) => {
    click = click + 1;
    // Close the current InfoWindow.
    infoWindow.close();
    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    //create maker 
    var marker = new google.maps.Marker({
        position: mapsMouseEvent.latLng,
        map: map,
        draggable:true,
        title: click.toString(),
    });
    markers.push(marker);
    //get lat long from marker
    const lat = marker.getPosition().lat();
    const lng = marker.getPosition().lng();
    //handle get address from lat long
    geocodeLatLng(geocoder, map, infoWindow, lat, lng, click);
    localStorage.setItem('click',click);
    //get lat long when dragable maker 
    google.maps.event.addListener(marker, 'dragend', function(evt){
      //handle event move maker
      var marker_rm = this.getTitle();
      const new_lat = this.getPosition().lat();
      const new_lng = this.getPosition().lng();
      geocodeLatLng(geocoder, map, infoWindow, new_lat, new_lng, marker_rm);
    });
    // direction
    document.getElementById("submit").addEventListener("click", () => {
      var rs = calculateAndDisplayRoute(directionsService, directionsRenderer, click, markers);
      if(rs == false){
        window.alert("No have any way");
      }
    });
    directionsRenderer.setMap(map);
  });
}
  
function calculateAndDisplayRoute(directionsService, directionsRenderer, click, markers) {
  const waypts = [];
  var errors = false;
  if(click > 2){
    for (var i = 2; i < click; i++) {
        waypts.push({
          location: localStorage.getItem('maker'+i+''),
          stopover: true,
        });
    }
  }
  directionsService.route(
    {
      origin: localStorage.getItem('maker1'),
      destination: localStorage.getItem('maker'+click+''),
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    },
    (response, status) => {
      if (status === "OK" && response) {
        directionsRenderer.setDirections(response);
        const route = response.routes[0];
        const summaryPanel = document.getElementById("directions-panel");
        summaryPanel.innerHTML = "";

        // For each route, display summary information.
        for (let i = 0; i < route.legs.length; i++) {
          const routeSegment = i + 1;
          summaryPanel.innerHTML +=
            "<h5><b>Trip : " + routeSegment + "</b></h5> From : ";
          summaryPanel.innerHTML += route.legs[i].start_address + "<br> To : ";
          summaryPanel.innerHTML += route.legs[i].end_address + "<br> Distance : ";
          summaryPanel.innerHTML += route.legs[i].distance.text + "<br><br>";
        }
        for (let i = 0; i < click; i++) {
          markers[i].setMap(null);
        }
        return true ;
      } else {
        return false ;
      }
    }
  );
}

function geocodeLatLng(geocoder, map, infowindow , lat , lng, click) {
  var address;

  const latlng = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };
  geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === "OK") {
      if (results[0]) {
        localStorage.setItem('maker'+click+'',results[0].formatted_address);
      }else{
        localStorage.setItem('maker'+click+'','');
      }
    }else{
      localStorage.setItem('maker'+click+'','');
    }
  });
}

function clearStorage(click){
  if(click > 0){
    for(var i = 1 ; i <= click ; i++){
      localStorage.removeItem('maker'+i+'');
    }
    localStorage.removeItem('click');
  }
}
