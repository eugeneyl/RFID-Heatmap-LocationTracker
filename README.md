# RFID-Heatmap

## Introduction
This project has 2 main components to provide data visualisation to clients using the data collected using
the RFID sensor and corresponding RFID tags:
* <b>Heatmap</b> - Track the number of people that passed by a specific area over a period of time.
* <b>Location Tracker</b> - Track the location of an individual during the whole event.

## Getting Started
1. Open either `index.html` (heatmap is set to be index.html for hosting purposes) or `location-tracker.html`.
2. You can toggle between the 2 modes by clicking on the button at the bottom left of the map.

## To adapt for other events
1. Add the floorplan of the event in `img/assets` folder. 
2. Replace the `rawData` array in `js/data/dataset.js` to the data of the event. The format of each activity of the event should be:

_No Dwell Time:_
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

_With Dwell Time:_ 
``` json
{
    "category":"Centre Stage",
    "duration":4,
    "end":"2019-07-17T16:31:54.000+08:00",
    "name":"John Doe",
    "session":1,
    "start":"2019-07-17T16:27:57.000+08:00"
}
```
3. Edit the `js/user-input.js` file based on the details of the event:
    * `FIRST_DAY`: Numerical date of the first day of the event.
    * `NO_DAYS`: Number of days of the event.
    * `START_HOUR`: Starting time of the event for each day.
    * `END_HOUR`: Ending time of the event for each day.
    * `EVENT_NAME`: Name of the event.
    * `FLOOR_PLAN`: The name of the file of the floor plan uploaded in the step 1.
    * `DWELL_TIME`: Whether dwell time data is used or unprocessed data is used. 
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
        * `MIN_ZOOM` only applies for location tracker
        * If you change the `INITIAL_ZOOM`, you will need to recalibrate the intensity of the heatmap in Heatmap.js 
        as the current intensity level only work for the default `INITIAL_ZOOM = 18.4`
    * `INTENSITY`: Adjust the value to the minimum value required for the heatmap to indicate as red for each of the
    specified time intervals (10 min, 1hr, 10 hr and max duration of event). As mentioned earlier, this setting only
    works for default `INITIAL_ZOOM = 18.4`.
    * Map Boundaries: To adjust the floor plan to fit better:
        1. Set `ADJUSTING_FLOORPLAN` to true.
        2. At each end of the floor plan, you will see a draggable icon. Adjust the floor plan accordingly.
        3. Once done, click on any point of the map and an alert showing you the coordinates of 3 points will appear.
        4. Replace the coordinates of `point1`, `point2` and `point3` accordingly and refresh the page.
        5. Once done, set `FINDING_COORDINATES` to `false`.



