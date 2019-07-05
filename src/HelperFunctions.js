/**
 * List of helper functions for heatmap.js
 */

function stepUp(steps) {
    var increment = parseInt(steps);
    var values = $( "#slider" ).slider( "values" );
    if (increment + values[1] <= 1742) {
        $( "#slider" ).slider("values", [values[0]+increment, values[1]+increment]);
        return $("#slider").slider("values",1);
    } else {
        $( "#slider" ).slider("values", [values[0]+increment, 1742]);
        return 1742;
    }
}

function stepDown(steps) {
    var decrement = parseInt(steps);
    var values = $( "#slider" ).slider( "values" );
    if (values[0] - decrement >= 0) {
        $( "#slider" ).slider("values", [values[0]-decrement, values[1]-decrement]);
        return $("#slider").slider("values",0);
    } else {
        $( "#slider" ).slider("values", [0, values[1]-decrement]);
        return 0;
    }

}

/**
 * Convert total minutes to an object with day, date, hour and minute.
 */
function parseDateTime(totalMinutes) {
    var dayMinute = totalMinutes % 601;
    var dateTime = {
        day: Math.floor(totalMinutes / 601) + 1,
        date: Math.floor(totalMinutes / 601) + 19,
        hour: Math.floor(dayMinute / 60) + 8,
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
    var totalMinutes = (date-19)*601 + (hour-8)*60 + min;
    return totalMinutes;
}

