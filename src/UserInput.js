//Fill up based on event details
var FIRST_DAY = 19;
var NO_DAYS = 3;
var START_HOUR = 8;
var END_HOUR = 18;
var EVENT_NAME = "Tyre Expo 2019";
var FLOOR_PLAN = "Map.svg"

//Change to the coordinates where the RFID antennas are placed.
var AREA_COORDINATES = [
    { "location":"Alley 1", "lat": 1.333277, "long": 103.956274 },
    { "location":"Alley 2", "lat": 1.332569, "long": 103.956542 },
    { "location":"Alley 3", "lat": 1.331904, "long": 103.956542 },
    { "location":"Alley 4", "lat": 1.331877, "long": 103.957272 },
    { "location":"Alley 5", "lat": 1.331893, "long": 103.958575 },
    { "location":"Alley 6", "lat": 1.332569, "long": 103.958441 },
    { "location":"Alley 7", "lat": 1.333239, "long": 103.958151 },
    { "location":"Alley 8", "lat": 1.332869, "long": 103.957331 },
]

//Map display settings
var CENTER_COORDINATES = [1.332469, 103.957427];
var MIN_ZOOM = 18.4;
var MAX_ZOOM = 22;
var INITIAL_ZOOM = 18.4;

//Floor plan boundaries
var point1 = L.latLng(1.334227, 103.955138),
    point3 = L.latLng(1.331125, 103.955138),
    point2 = L.latLng(1.334227, 103.961874);

//Adjustment booleans
var FINDING_COORDINATES = false;
var FINDING_CENTER = false;
var ADJUSTING_FLOORPLAN = false;