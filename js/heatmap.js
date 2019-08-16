//=======================================DATA PARSING=======================================
var parsedData = [];
if (DWELL_TIME) {
    rawData.forEach(function (data) {
        var area = -1;
        for (var i = 0; i < AREA_COORDINATES.length; i++) {
            if (data.category === AREA_COORDINATES[i].location) {
                area = i;
            }
        }
    
        if (area >= 0) {
            parsedData.push({
                "startTime": new Date(data.start),
                "endTime": new Date(data.end),
                "area": area,
                "name": data.name
                // "id": data.tag
            })
        }
    })    
} else {
    rawData.forEach(function (data) {
        var area = -1;
        for (var i = 0; i < AREA_COORDINATES.length; i++) {
            if (data.location === AREA_COORDINATES[i].location) {
                area = i;
            }
        }
    
        if (area >= 0) {
            parsedData.push({
                "startTime": new Date(data.captured_time_minute),
                "area": area,
                "name": data.tag
            })
        }
    })
}


//=======================================HEATMAP INITIALISATION=======================================
var dataSet = [];
var areaSet = [];

for (var i = 0; i < AREA_COORDINATES.length; i++) {
    areaSet.push({
        "area": i,
        "set": new Set(),
    });
}

parsedData.forEach(function (data) {
    var testTotal = parseMinute(data.startTime);
    if (testTotal <= 0 && testTotal >= 0) {
        areaSet[data.area].set.add(data.name);
    }
});

areaSet.forEach(function (data) {
    for (var i = 0; i < data.set.size; i++) {
        dataSet.push([AREA_COORDINATES[data.area].lat, AREA_COORDINATES[data.area].long, 0.1]);
    }
});

var heat = L.heatLayer(dataSet, { radius: 95, maxZoom: 21 }).addTo(mymap);
var popupList = [];
for (var i = 0; i < AREA_COORDINATES.length; i++) {
    var popup = L.popup({
        autoClose: false,
        closeOnEscapeKey: false,
        closeOnClick: false,
        closeButton: false
    }
    );
    popup.setLatLng(L.latLng([AREA_COORDINATES[i].lat, AREA_COORDINATES[i].long]))
        .setContent("<b>" + areaSet[i].set.size + "</b>")
        .openOn(mymap);
    popupList.push(popup);
}

//=======================================UI INITIALISATION=======================================
var startTime = parseDateTime(parseInt(0));
var endTime = parseDateTime(parseInt(0));
var MINUTE_PER_DAY = (END_HOUR - START_HOUR) * 60 + 1;
var TOTAL_MINUTE = MINUTE_PER_DAY * NO_DAYS - 1;

var intStartDay = document.getElementById("intStartDay");
var intStartTime = document.getElementById("intStartTime");
var intEndDay = document.getElementById("intEndDay");
var intEndTime = document.getElementById("intEndTime");
var interval = document.getElementById("interval");
var specDay = document.getElementById("specDay");
var specTime = document.getElementById("specTime");
intStartDay.max = NO_DAYS;
intEndDay.max = NO_DAYS;
specDay.max = NO_DAYS;
update([0, 0]);

$(".eventTitle").html(EVENT_NAME + "  |  Day 1");

$(function () {
    $("#intervalSlider").slider({
        range: true,
        min: 0,
        max: TOTAL_MINUTE,
        values: [0, 0],
        change: function (event, ui) {
            update(ui.values);
            if (hasInterval) {
                $("#specificSlider").slider("value", ui.values[0]);
            }
        },
        slide: function (event, ui) {
            update(ui.values);
            if (hasInterval) {
                $("#specificSlider").slider("value", ui.values[0]);
            }
        }
    });
});

$(function () {
    $("#specificSlider").slider({
        min: 0,
        max: TOTAL_MINUTE,
        value: 0,
        change: function (event, ui) {
            if (!hasInterval) {
                $("#intervalSlider").slider("values", [ui.value, ui.value]);
            }
        },
        slide: function (event, ui) {
            if (!hasInterval) {
                $("#intervalSlider").slider("values", [ui.value, ui.value]);
            }
        },
    });
});

// var slider = document.getElementById("slider");
var hasInterval = false;
$("#intervalControls").hide();
$("#intervalSlider").hide();
var intervalToggle = document.getElementById("intervalToggle");
intervalToggle.onclick = function () {
    if (hasInterval) {
        $("#intervalControls").hide();
        $("#specificControls").show();
        $("#intervalSlider").hide();
        $("#specificSlider").show();
        resetInterval(0);
    } else {
        $("#specificControls").hide();
        $("#intervalControls").show();
        $("#specificSlider").hide();
        $("#intervalSlider").show();
        resetInterval(60);
    }
    hasInterval = !hasInterval;
};

var play = document.getElementById("toggleIcon");
var isPlaying = false;
var speed = 60;
function autoRun() {
    if (isPlaying) {
        var endValue = stepUp(parseInt(1));
        if (endValue == TOTAL_MINUTE) {
            isPlaying = false;
            play.src = "img/assets/play.svg";
            play.title = "Play"
            popupList.forEach(function (element) {
                mymap.openPopup(element);
            });
        }
    }
}
var playInterval = setInterval(autoRun, speed);

play.onclick = function () {
    isPlaying = !isPlaying;
    if (isPlaying) {
        play.src = "img/assets/pause.svg";
        play.title = "Pause";
        popupList.forEach(function (element) {
            mymap.closePopup(element);
        });
    } else {
        play.src = "img/assets/play.svg";
        play.title = "Play"
        popupList.forEach(function (element) {
            mymap.openPopup(element);
        });
    }
};

var speed = document.getElementById("speed");
var currentMultiplier = 1;
speed.onclick = function () {
    if (currentMultiplier < 2) {
        currentMultiplier += 0.5;
        speed -= 15;
    } else {
        currentMultiplier = 0.5;
        speed = 75;
    }

    clearInterval(playInterval);
    playInterval = setInterval(autoRun, speed);
    $("#speed").html(currentMultiplier + "x");
}

var stepForward = document.getElementById("stepForward");
var stepBackward = document.getElementById("stepBackward");
stepForward.onclick = function () {
    stepUp(parseInt(1));
}
stepBackward.onclick = function () {
    stepDown(parseInt(1));
}

var prevDay = document.getElementById("prevDay");
var nextDay = document.getElementById("nextDay");
prevDay.onclick = function () {
    stepDown(MINUTE_PER_DAY);
}
nextDay.onclick = function () {
    stepUp(MINUTE_PER_DAY);
}
prevDay.onmouseenter = function () {
    prevDay.src = "img/assets/hoverprev.svg";
}
prevDay.onmouseleave = function () {
    prevDay.src = "img/assets/prev.svg";
}
nextDay.onmouseenter = function () {
    nextDay.src = "img/assets/hovernext.svg";
}
nextDay.onmouseleave = function () {
    nextDay.src = "img/assets/next.svg";
}

intStartDay.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        changeStartTime();
    }
});

intStartTime.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        changeStartTime();
    }
});

intEndDay.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        changeEndTime();
    }
});

intEndTime.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        changeEndTime();
    }
});

interval.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        changeInterval();
    }
});

specDay.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        changeSpecTime();
    }
});

specTime.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        changeSpecTime();
    }
});

//=======================================UPDATE FUNCTION=======================================   
function update(values) {
    var startTime = parseDateTime(parseInt(values[0]));
    var endTime = parseDateTime(parseInt(values[1]));
    var intensity = 1 / (values[1] - values[0] + 1);

    intStartDay.value = startTime.day;
    intStartTime.value = parseTimeString(startTime.min, startTime.hour);
    intEndDay.value = endTime.day;
    intEndTime.value = parseTimeString(endTime.min, endTime.hour);
    interval.value = parseInt(values[1]) - parseInt(values[0]);
    specDay.value = startTime.day;
    specTime.value = parseTimeString(startTime.min, startTime.hour);

    dataSet = [];
    areaSet = [];

    for (var i = 0; i < AREA_COORDINATES.length; i++) {
        areaSet.push({
            "area": i,
            "set": new Set(),
        });
    }

    if (DWELL_TIME) {
        parsedData.forEach(function (data) {
            var startTotal = parseMinute(data.startTime);
            var endTotal = parseMinute(data.endTime);
            if (startTotal <= values[1] && endTotal >= values[0]) {
                areaSet[data.area].set.add(data.name);
            }
        });
    } else {
        parsedData.forEach(function (data) {
            var testTotal = parseMinute(data.startTime);
            if (testTotal <= values[1] && testTotal >= values[0]) {
                areaSet[data.area].set.add(data.name);
            }
        });
    }
    parsedData.forEach(function (data) {
        var testTotal = parseMinute(data.startTime);
        if (testTotal <= values[1] && testTotal >= values[0]) {
            areaSet[data.area].set.add(data.name);
        }
    });

    function highString (max) {
        return "(>" + max + ")";
    }

    function mediumString (max) {
        let lowBound = Math.floor(0.4 * max);
        let highBound = Math.ceil(0.6 * max);
        return "(" +  lowBound + "-" + highBound + ")";
    }
    if (interval.value <= 10) {
        $("#mediumInterval").html(mediumString(INTENSITY[0]));
        $("#highInterval").html(highString(INTENSITY[0]));
    } else if (interval.value <= 60) {
        $("#mediumInterval").html(mediumString(INTENSITY[1]));
        $("#highInterval").html(highString(INTENSITY[1]));
    } else if (interval.value <= 600) {
        $("#mediumInterval").html(mediumString(INTENSITY[2]));
        $("#highInterval").html(highString(INTENSITY[2]));
    } else {
        $("#mediumInterval").html(mediumString(INTENSITY[3]));
        $("#highInterval").html(highString(INTENSITY[3]));
    }

    areaSet.forEach(function (data) {
        for (var i = 0; i < data.set.size; i++) {
            if (interval.value <= 10) {
                dataSet.push([AREA_COORDINATES[data.area].lat, AREA_COORDINATES[data.area].long, 6 / INTENSITY[0]]);
            } else if (interval.value <= 60) {
                dataSet.push([AREA_COORDINATES[data.area].lat, AREA_COORDINATES[data.area].long, 6 / INTENSITY[1]]);
            } else if (interval.value <= 600) {
                dataSet.push([AREA_COORDINATES[data.area].lat, AREA_COORDINATES[data.area].long, 6 / INTENSITY[2]]);
            } else {
                dataSet.push([AREA_COORDINATES[data.area].lat, AREA_COORDINATES[data.area].long, 6 / INTENSITY[3]]);
            }
        }
    });

    heat.setLatLngs(dataSet);
    for (var i = 0; i < popupList.length; i++) {
        popupList[i].setContent("<b>" + areaSet[i].set.size + "</b>");
    }
    if (startTime.day == endTime.day) {
        $(".eventTitle").html(EVENT_NAME + "  |  Day " + startTime.day);
    } else {
        $(".eventTitle").html(EVENT_NAME + "  |  Day " + startTime.day + " - "
            + endTime.day);
    }
}
