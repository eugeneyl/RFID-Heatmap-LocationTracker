// For repositioning the image overlay
if (ADJUSTING_FLOORPLAN){
    var marker1 = L.marker(point1, {draggable: true} ).addTo(mymap),
        marker2 = L.marker(point2, {draggable: true} ).addTo(mymap),
        marker3 = L.marker(point3, {draggable: true} ).addTo(mymap);
    
    function repositionImage() {
        overlay.reposition(marker1.getLatLng(), marker2.getLatLng(), marker3.getLatLng());
    };
    marker1.on('drag dragend', repositionImage);
    marker2.on('drag dragend', repositionImage);
    marker3.on('drag dragend', repositionImage);

    function getPoints(e) {
        alert("point 1: " + marker1.getLatLng() + "  " +
              "point 2: " + marker2.getLatLng() + "  " +
              "point 3: " + marker3.getLatLng() + "  " );
    }
    mymap.on('click', getPoints);    
}


// For getting center coordinates
if (FINDING_CENTER) {
    function getCenter(e) {
        alert(mymap.getCenter());
    }
    mymap.on('click', getCenter);
}


// For getting specific coordinates
if (FINDING_COORDINATES) {
    function getPoint(e) {
        alert("lat: " + e.latlng.lat.toFixed(6) + "  " + "long: " + e.latlng.lng.toFixed(6));
    }
    mymap.on('click', getPoint);
}
