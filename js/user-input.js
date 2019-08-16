//Fill up based on event details
var FIRST_DAY = 19;
var NO_DAYS = 3;
var START_HOUR = 8;
var END_HOUR = 18;
var EVENT_NAME = "SAMPLE EVENT";
var FLOOR_PLAN = "img/assets/map.png"

var DWELL_TIME = false;
//Change to the coordinates where the RFID antennas are placed.
var AREA_COORDINATES = [
    { "location":"Area A", "lat": 1.333433, "long": 103.957275 },
    { "location":"Area B", "lat": 1.332510, "long": 103.957304 },
    { "location":"Area C", "lat": 1.332510, "long": 103.958572 },
    { "location":"Area D", "lat": 1.332510, "long": 103.959694 },
    { "location":"Area E", "lat": 1.331767, "long": 103.957284 },
    { "location":"Area F", "lat": 1.331767, "long": 103.958585 },
    { "location":"Area G", "lat": 1.331767, "long": 103.959662 },
    { "location":"Area H", "lat": 1.332161, "long": 103.960463 },
]

//Map display settings
var CENTER_COORDINATES = [1.332461, 103.958706];
var MIN_ZOOM = 17.9;
var MAX_ZOOM = 22;
var INITIAL_ZOOM = 18.4;

//Heatmap Intensity for default zoom
var INTENSITY = [
    6,        //<10 minutes interval
    120,      //<1 hour interval
    600,      //<10 hour interval
    1200      //>10 hour interval
]

//Floor plan boundaries
var point1 = L.latLng(1.334227, 103.955138),
    point3 = L.latLng(1.331125, 103.955138),
    point2 = L.latLng(1.334227, 103.961874);

//Adjustment booleans
var FINDING_COORDINATES = false;
var FINDING_CENTER = false;
var ADJUSTING_FLOORPLAN = true;