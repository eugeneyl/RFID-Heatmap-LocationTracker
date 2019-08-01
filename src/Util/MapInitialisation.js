var bounds = L.latLngBounds(point2, point3);

var mymap = L.map('mapid', {
    zoom: INITIAL_ZOOM,
});

mymap.panTo(L.latLng(CENTER_COORDINATES));

L.tileLayer('', {
    'attribution': ' ',
    maxZoom: MAX_ZOOM,
    minZoom: INITIAL_ZOOM,
}).addTo(mymap);

var overlay = L.imageOverlay.rotated("../icon/" + FLOOR_PLAN, point1, point2, point3, {
    opacity: 1,
    interactive: true,
    attribution: EVENT_NAME + "Floorplan"
}).addTo(mymap);