var bounds = L.latLngBounds(point2, point3);

var mymap = L.map('mapid', {
    zoom: INITIAL_ZOOM,
});

mymap.panTo(L.latLng(CENTER_COORDINATES));

if (mode === "locationTracker") {
    L.tileLayer('', {
        maxZoom: MAX_ZOOM,
        minZoom: MIN_ZOOM,
    }).addTo(mymap);
} else {
    L.tileLayer('', {
        maxZoom: MAX_ZOOM,
        minZoom: INITIAL_ZOOM,
    }).addTo(mymap);
}

var overlay = L.imageOverlay.rotated(FLOOR_PLAN, point1, point2, point3, {
    opacity: 1,
    interactive: true,
    attribution: EVENT_NAME + " Floorplan"
}).addTo(mymap);