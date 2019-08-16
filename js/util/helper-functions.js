/**
 * List of helper functions for heatmap.js
 */

function stepUp(steps) {
    var increment = parseInt(steps);
    var values = $( "#intervalSlider" ).slider( "values" );
    if (increment + values[1] <= TOTAL_MINUTE) {
        $( "#intervalSlider" ).slider("values", [values[0]+increment, values[1]+increment]);
        $("#specificSlider").slider("value", values[0]+increment);
        return $("#intervalSlider").slider("values",1);
    } else {
        $( "#intervalSlider" ).slider("values", [values[0]+increment, TOTAL_MINUTE]);
        $("#specificSlider").slider("value", values[0]+increment);
        return TOTAL_MINUTE;
    }
}

function stepDown(steps) {
    var decrement = parseInt(steps);
    var values = $( "#intervalSlider" ).slider( "values" );
    if (values[0] - decrement >= 0) {
        $( "#intervalSlider" ).slider("values", [values[0]-decrement, values[1]-decrement]);
        $("#specificSlider").slider("value", values[0]-decrement);
        return $("#intervalSlider").slider("values",0);
    } else {
        $( "#intervalSlider" ).slider("values", [0, values[1]-decrement]);
        $("#specificSlider").slider("value", 0);
        return 0;
    }

}

/**
 * Convert total minutes to an object with day, date, hour and minute.
 */
function parseDateTime(totalMinutes) {
    var dayMinute = totalMinutes % MINUTE_PER_DAY;
    var dateTime = {
        day: Math.floor(totalMinutes / MINUTE_PER_DAY) + 1,
        date: Math.floor(totalMinutes / MINUTE_PER_DAY) + FIRST_DAY,
        hour: Math.floor(dayMinute / 60) + START_HOUR,
        min: dayMinute % 60
    };
    return dateTime;
}

/**
 * Convert time to total number of minutes.
 */
function parseMinute (time) {
    var date = time.getDate();
    var hour = time.getHours();
    var min = time.getMinutes();
    var totalMinutes = (date-FIRST_DAY)*MINUTE_PER_DAY + (hour-START_HOUR)*60 + min;
    return totalMinutes;
}

function parseTimeString(min, hour) {
    var smin;
    var shour;
    if (min < 10) {
        smin = "0" + min;
    } else {
        smin = min.toString();
    }
    if (hour < 10) {
        shour = "0" + hour;
    } else {
        shour = hour.toString();
    }
    return shour+smin;
}

function changeStartTime() {
    let newDay = intStartDay.value;
    let newTime = parseInt(intStartTime.value);
    let newHour = Math.floor(newTime / 100);
    let newMin = newTime % 100;
    if (newDay <= NO_DAYS && newDay >= 1) {
        if (newHour <= END_HOUR && newHour >= START_HOUR) {
            if (newMin <= 59 && newMin >= 0) {
                var difference = $("#intervalSlider").slider("values",1) - $("#intervalSlider").slider("values",0);
                var newValue = (newDay - 1) * MINUTE_PER_DAY + (newHour - START_HOUR) * 60 + newMin;
                console.log(newValue + difference);
                $("#intervalSlider").slider("values",0, newValue);
                if (newValue + difference <= 1742) {
                    $("#intervalSlider").slider("values",1, newValue + difference);
                } else {
                    $("#intervalSlider").slider("values",1, 1742);
                }
            }
        }
    }
}

function changeEndTime() {
    let newDay = intEndDay.value;
    let newTime = parseInt(intEndTime.value);
    let newHour = Math.floor(newTime / 100);
    let newMin = newTime % 100;
    if (newDay <= NO_DAYS && newDay >= 1) {
        if (newHour <= END_HOUR && newHour >= START_HOUR) {
            if (newMin <= 59 && newMin >= 0) {
                var newValue = (newDay - 1) * MINUTE_PER_DAY + (newHour - START_HOUR) * 60 + newMin;
                if (newValue > $("#intervalSlider").slider("values",0) && newValue < TOTAL_MINUTE) {
                    $("#intervalSlider").slider("values",1, newValue);
                }
            }
        }
    }
}

function changeInterval() {
    let newInterval = parseInt(interval.value);
    let newEndValue = $("#intervalSlider").slider("values",0) + newInterval;
    if (newEndValue < TOTAL_MINUTE) {
        $("#intervalSlider").slider("values",1, newEndValue);
    } else {
        $("#intervalSlider").slider("values",1, TOTAL_MINUTE);
    }
}

function resetInterval(newInterval) {
    var newEndValue = $("#intervalSlider").slider("values",0) + parseInt(newInterval);
    $("#intervalSlider").slider("values",1, newEndValue);
}

function changeSpecTime() {
    let newDay = specDay.value;
    let newTime = parseInt(specTime.value);
    let newHour = Math.floor(newTime / 100);
    let newMin = newTime % 100;
    if (newDay <= NO_DAYS && newDay >= 1) {
        if (newHour <= END_HOUR && newHour >= START_HOUR) {
            if (newMin <= 59 && newMin >= 0) {
                var newValue = (newDay - 1) * MINUTE_PER_DAY + (newHour - START_HOUR) * 60 + newMin;
                $("#specificSlider").slider("value", newValue);
            }
        }
    }
}


