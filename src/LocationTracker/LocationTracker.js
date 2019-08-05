//=======================================DATA PARSING=======================================
var parsedData = [];
var parsedNameList = new Set();

rawData.forEach(function (data) {
    var dateTime = new Date(data.captured_time_minute);
    var day = parseInt(dateTime.getDate()) - FIRST_DAY + 1;
    var hour = dateTime.getHours();
    var min = dateTime.getMinutes();
    var timeString = parseTimeString(min, hour);
    var shownTime = "Day " + day + ", " + timeString;

    var area = -1;
    for (var i = 0; i < AREA_COORDINATES.length; i++) {
        if (data.location === AREA_COORDINATES[i].location) {
            area = i;
        }
    }

    if (area >= 0 && day > 0) {
        parsedData.push({
            "time": shownTime,
            "day": day,
            "hour": hour,
            "min": min,
            "id": data.tag,
            "name": data.person,
            "area": area,
            "location": data.location
        });
        parsedNameList.add(data.person.toLowerCase());
    }
});

parsedData.sort((a, b) => {
    if (a.day !== b.day) {
        return a.day - b.day;
    } else if (a.hour !== b.hour) {
        return a.hour - b.hour;
    } else {
        return a.min - b.min;
    }
});

//=======================================POINTS INITIALISATION=======================================
var pointList = [];
for (var i = 0; i < AREA_COORDINATES.length; i++) {
    var point = L.latLng(AREA_COORDINATES[i].lat, AREA_COORDINATES[i].long);
    pointList.push(point);
}
var selectedMarker;
var counter = 1;

//=======================================TRACKER FUNCTIONS=======================================
function iterateRecords() {
    var queryResult = [];
    var areaCount = [];
    for (var i = 0; i < 8; i++) {
        areaCount.push({
            "number": i,
            "count": 0
        });
    }
    var attendeeName;
    var attendeeId;
    parsedData.forEach(function (data) {
        if (data.id == search.value
            || data.name.toLowerCase() == search.value.toLowerCase()) {
            queryResult.push({
                "time": data.time,
                "area": data.area,
                "location": data.location
            })
            attendeeName = data.name.toLowerCase();
            attendeeId = data.id;
            areaCount[data.area].count++;
        }
    });
    if (queryResult.length == 0) {
        alert("Name/ID not found.");
        return;
    }
    $('tbody').html("");
    addHeader();
    mymap.closePopup(selectedMarker);
    selectedMarker = null;
    counter = 1;
    queryResult.forEach(function (data) {
        addRow(data);
    });

    $("#attendeeName").html("Name: <b>" + attendeeName + "</b>");
    $("#attendeeID").html("ID: <b>" + attendeeId + "</b>");
    var noArea = 0;

    areaCount.sort(function (a, b) {
        return b.count - a.count;
    });

    var frequent = AREA_COORDINATES[areaCount[0].number].location;
    for (var i = 0; i < AREA_COORDINATES.length; i++) {
        if (areaCount[i].count > 0) {
            noArea++;
        }
        if (i != 0 && areaCount[i].count == areaCount[0].count) {
            frequent = frequent + ", " + AREA_COORDINATES[areaCount[i].number].location;
        }
    }
    $(".play").css('visibility', 'visible');
    $("#summaryHeader").html("<b>Summary</>");
    $("#noArea").html("Number of visited areas: <b>" + noArea + "</b>");
    $("#mostVisited").html("Most frequently visited area: <b>" + frequent + "</b>");

    var play = document.getElementById("play");
    var isPlaying = false;
    var table = document.getElementById("table");
    var recordsTable = document.getElementById("recordsTable");

    for (var i = 1; i < table.rows.length; i++) {
        var marker;
        table.rows[i].onmouseenter = function () {
            if (!isPlaying) {
                if (!selectedMarker || counter - 1 != this.rowIndex) {
                    var rowIndex = this.rowIndex - 1;
                    marker = L.marker(pointList[queryResult[rowIndex].area]).addTo(mymap);
                }
                table.rows[this.rowIndex].style.background = "#D3D3D3";
                // var rowIndex = this.rowIndex - 1;
                // marker = L.marker(pointList[queryResult[rowIndex] area]).addTo(mymap);
            }
        }
        table.rows[i].onmouseleave = function () {
            if (!isPlaying) {
                mymap.closePopup(marker);
                if (!selectedMarker || counter - 1 != this.rowIndex) {
                    table.rows[this.rowIndex].style.background = "#ffffff";
                }
            }
        }
        table.rows[i].onclick = function () {
            if (!isPlaying) {
                mymap.closePopup(selectedMarker);
                table.rows[counter - 1].style.background = "#ffffff";
                counter = this.rowIndex + 1;
                selectedMarker = L.marker(pointList[queryResult[counter - 1].area]).addTo(mymap);
                table.rows[counter - 1].style.background = "#D3D3D3"
            }
        }
    }

    play.onclick = function () {
        if (isPlaying) {
            play.src = "../icon/tracker_play.svg";
        } else {
            var startPos = (counter - 2) * table.rows[1].offsetHeight;
            recordsTable.scrollTo(0, startPos)
            play.src = "../icon/tracker_stop.svg";
        }
        isPlaying = !isPlaying;
        var interval = setInterval(function () {
            var rowIndex = counter - 1;
            if (counter < table.rows.length && isPlaying) {
                if (counter > 1) {
                    table.rows[rowIndex].style.background = "#ffffff";
                    recordsTable.scrollBy(0, table.rows[1].offsetHeight);
                }
                mymap.closePopup(selectedMarker);
                selectedMarker = L.marker(pointList[queryResult[rowIndex].area]).addTo(mymap);
                table.rows[counter].style.background = "#D3D3D3";
                counter++;
            } else {
                if (counter == table.rows.length) {
                    mymap.closePopup(selectedMarker);
                    table.rows[rowIndex].style.background = "#ffffff"
                    recordsTable.scrollTo(0, 0);
                    counter = 1;
                }
                clearInterval(interval);
                isPlaying = false;
                play.src = "../icon/tracker_play.svg";
            }
        }, 300);
    }

}

function addRow(data) {
    if (!document.getElementsByTagName) return;
    var tabBody = document.getElementsByTagName("tbody").item(0);
    var row = document.createElement("tr");
    row.className = "bodyrow";
    var cell1 = document.createElement("td");
    var cell2 = document.createElement("td");
    var textnode1 = document.createTextNode(data.time);
    var textnode2 = document.createTextNode(data.location);
    cell1.appendChild(textnode1);
    cell2.appendChild(textnode2);
    row.appendChild(cell1);
    row.appendChild(cell2);
    tabBody.appendChild(row);
}

function addHeader() {
    if (!document.getElementsByTagName) return;
    var tabBody = document.getElementsByTagName("tbody").item(0);
    var row = document.createElement("tr");
    var cell1 = document.createElement("th");
    var cell2 = document.createElement("th");
    var textnode1 = document.createTextNode("Time");
    var textnode2 = document.createTextNode("Area");
    cell1.appendChild(textnode1);
    cell2.appendChild(textnode2);
    row.appendChild(cell1);
    row.appendChild(cell2);
    row.id = "stickyHeader";
    tabBody.appendChild(row);
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    iterateRecords();
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

autocomplete(document.getElementById("searchID"), Array.from(parsedNameList));

var search = document.getElementById("searchID");
search.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        iterateRecords();
    }
});