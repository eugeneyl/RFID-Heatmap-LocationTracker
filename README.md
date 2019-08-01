# RFID-Heatmap

## Introduction
This project has 2 main components to provide data visualisation to clients using the data collected using
the RFID sensor and corresponding RFID tags:
* <b>Heatmap</b> - Track the number of people that passed by a specific area over a period of time.
* <b>Location Tracker</b> - Track the location of an individual during the whole event.

## Getting Started
1. Open either `./src/Heatmap.html` or `./src/LocationTracker.html`.
2. You can toggle between the 2 modes by clicking on the button at the bottom left of the map.

## To adapt for other events
1. Add the floorplan of the event in `.icon/` folder. 
2. Replace the `rawData` array in `./src/Dataset/Dataset.js` to the data of the event. The format of each activity of the event should be:
``` json
{
    "captured_time":"2019-03-18T17:49:15.000+08:00",
    "captured_time_minute":"2019-03-18T17:49:00",
    "created_at":"2019-03-19T08:02:50.817+08:00",
    "location":"Alley 7",
    "person":"John Doe",
    "tag":"123345"
}
```
3. Edit the `./src/UserInput.js` file based on the details of the event:
    * `FIRST_DAY`: Numerical date of the first day of the event.
    * `NO_DAYS`: Number of days of the event.
    * `START_HOUR`: Starting time of the event for each day.
    * `END_HOUR`: Ending time of the event for each day.
    * `EVENT_NAME`: Name of the event.
    * `FLOOR_PLAN`: The name of the file of the floor plan uploaded in the step 1.
    * `AREA_COORDINATES`: The name and coordinates (wrt. floor plan) of each of the RFID sensor of the event.
        * For the coordinates of the RFID sensor: 
            1. Set `FINDING_COORDINATES` to `true`.
            2. Open either one of the modes (Heatmap or Location Tracker).
            3. Click on the area where the RFID sensor are located on the floor plan. An alert will appear with the lat and long of the point.
            4. Once done, set `FINDING_COORDINATES` to `false`.
    * `CENTER_COORDINATES`: Center of the floorplan on the map.
        * For the center coordinates of the map:
            1. Set `FINDING_CENTER` to `true`.
            2. Open either one of the modes (Heatmap or Location Tracker).
            3. Adjust the map to the correct viewpoint.
            4. Click on any point on the map. An alert will appear with the coordinates of the center.
            5. Once done, set `FINDING_COORDINATES` to `false`.
    * Zoom: Adjust the `MIN_ZOOM`, `MAX_ZOOM` and `INITIAL_ZOOM` values to change the zoom settings of the map.
    * Map Boundaries: To adjust the floor plan to fit better:
        1. Set `ADJUSTING_FLOORPLAN` to true.
        2. At each end of the floor plan, you will see a draggable icon. Adjust the floor plan accordingly.
        3. Once done, click on any point of the map and an alert showing you the coordinates of 3 points will appear.
        4. Replace the coordinates of `point1`, `point2` and `point3` accordingly and refresh the page.
        5. Once done, set `FINDING_COORDINATES` to `false`.

## Other notes
* To change the intensity of the heatmap depending on the number of people in the event, you can edit it in `./src/Heatmap/Heatmap.js` line 301-328:
```javascript
    //Update the legend base on the number of people.
    if (interval.value <= 10) {
        $("#mediumInterval").html("(2-5)");
        $("#highInterval").html("(>6)");
    } else if (interval.value <= 60) {
        $("#mediumInterval").html("(50-150)");
        $("#highInterval").html("(>200)");
    } else if (interval.value <= 600) {
        $("#mediumInterval").html("(200-450)");
        $("#highInterval").html("(>600)");
    } else {
        $("#mediumInterval").html("(400-800)");
        $("#highInterval").html("(>1200)");
    }

    areaSet.forEach(function (data) {
        for (var i = 0; i < data.set.size; i++) {
            if (interval.value <= 10) {
                //change the last entry of the array
                dataSet.push([AREA_COORDINATES[data.area].lat, AREA_COORDINATES[data.area].long, 1]);
            } else if (interval.value <= 60) {
                dataSet.push([AREA_COORDINATES[data.area].lat, AREA_COORDINATES[data.area].long, 0.03]);
            } else if (interval.value <= 600) {
                dataSet.push([AREA_COORDINATES[data.area].lat, AREA_COORDINATES[data.area].long, 0.01])
            } else {
                dataSet.push([AREA_COORDINATES[data.area].lat, AREA_COORDINATES[data.area].long, 0.005]);
            }
        }
    });
```



