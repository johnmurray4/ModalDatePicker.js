/*
 *  This is a reusable modal DatePicker component, created by John Murray on November 4, 2020.
 *  It requires a params object, that must include the properties 'modalTarget' and 'targetBtn'.
 *  These two properties are the Id's of a div and a button element that will display the date picker and activate it.
 *  The targetBtn will also display the selected Date.
 *  Other properties such as 'height', 'width', 'headerColor', and 'bodyColor' are optional, and can be used to add additional
 *  styling to the component based on your visual needs or preferences.
 *  
 *  References:
 *  https://www.thatsoftwaredude.com/content/6396/coding-a-calendar-in-javascript
 */

function makeDatePickerModal(params) {
    "use strict";

    // Check required parameters
    if (params.modalTarget === null) {
        console.log("ERROR: must provide modalTarget parameter (id of the div you want to display the modalDatePicker in.");
        return 0;
    }
    if (params.targetBtn === null) {
        console.log("ERROR: No provided targetBtn  to display selected date outside of modal.");
        return 0;
    }

    //  Handle optional parameters
    var btn = document.getElementById(params.targetBtn);
    var modal = document.getElementById(params.modalTarget);
    modal.classList.add('modal');
    var headerColor = params.headerColor ? params.headerColor : "#fff";
    var bodyColor = params.bodyColor ? params.bodyColor : "#fff";
    var height = params.height ? params.height : "200px";
    var width = params.width ? params.width : "200px";
    var font = params.font ? params.font : "Helvetica";
    var highlight = params.highlight ? params.highlight : 'lightgreen';

    //  Create HTML component
    var datepicker = document.createElement("div");
    datepicker.style.height = height;
    datepicker.style.width = width;
    datepicker.style.backgroundColor = bodyColor;
    datepicker.style.margin = "auto";
    modal.appendChild(datepicker);
    datepicker.class = "datePicker";
    datepicker.style.fontFamily = font;
    var close = document.createElement("span");
    close.classList.add("close");
    close.innerHTML = "&times;";
    datepicker.appendChild(close);
    var title = document.createElement("h2");
    var monthYr = document.createElement("div");
    //references external stylesheet
    monthYr.classList.add("monthYr");
    title.style.backgroundColor = headerColor;
    title.style.textAlign = 'center';
    title.classList.add('title');
    monthYr.style.textAlign = 'center';
    monthYr.style.backgroundColor = headerColor;
    monthYr.classList.add("month");
    //monthYr.classList.add("title");
    var days = document.createElement("div");
    days.class = "days";
    datepicker.appendChild(title);
    datepicker.appendChild(monthYr);
    datepicker.appendChild(days);
    var prev = document.createElement("span");
    prev.style.float = "left";
    prev.innerHTML = "&lt;";
    prev.style.fontWeight = 'bold';
    prev.classList.add('prev-next');
    var mth = document.createElement("span");
    mth.style.fontSize = "24px";
    mth.class = "mth";
    var next = document.createElement("span");
    next.style.float = "right";
    next.innerHTML = "&gt;";
    next.style.fontWeight = 'bold';
    next.classList.add('prev-next');
    monthYr.appendChild(prev);
    monthYr.appendChild(mth);
    monthYr.appendChild(next);

    //  Create table to show days
    const theDays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

    var selectedDate = new Date();
    var selectedMonth = selectedDate.getMonth();
    var selectedYear = selectedDate.getFullYear();
    if (btn) {
        var date = new Date(selectedDate);
        btn.innerHTML = date.toLocaleDateString();
    }

    const months = ["January", 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    //  Initialize calendar for current month
    title.innerHTML = selectedDate.toLocaleDateString();
    mth.innerHTML = months[selectedDate.getMonth()] + ' ' + selectedDate.getFullYear();

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
    };

    // When the user clicks on close button (x), close the modal
    close.onclick = function () {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    //  Setup Weekdays display
    var weekdays = document.createElement("div");
    weekdays.classList.add("weekdays");
    weekdays.classList.add('title');
    var weekdayList = document.createElement("ul");
    for (var i = 0; i <= 6; i++) {
        var wkday = document.createElement("li");
        wkday.innerHTML = theDays[i];
        weekdayList.appendChild(wkday);
    }
    datepicker.appendChild(weekdays);
    weekdays.appendChild(weekdayList);

    var offset = 0;
    var currentWeek = 1;

    // Returns number of days in month
    function daysInMonth(month, year) {
        let date = new Date(year, month+1, 0);
        return date.getDate();
    }

    //  Returns first day of week (0-6)
    function loadCalendarDays(month, year) {
        var date = new Date(year, month, 1);
        var dayofweek = date.getDay();       // find where to start calendar day of week
        return dayofweek + 1;
    }

    var firstWeekday = loadCalendarDays(selectedMonth, selectedYear);

    var days = [];
    var dayCount = 0;

    //   Populate days in month
    var dates = document.createElement('div');
    function populateDays() {
        offset = 0;
        currentWeek = 1;
        //  Setup dates (1-31) grid display
        dates.classList.add("dates");
        datepicker.appendChild(dates);
        var w1 = document.createElement("div");
        w1.classList.add("row");
        dates.appendChild(w1);
        var w2 = document.createElement("div");
        w2.classList.add("row");
        dates.appendChild(w2);
        var w3 = document.createElement("div");
        w3.classList.add("row");
        dates.appendChild(w3);
        var w4 = document.createElement("div");
        w4.classList.add("row");
        dates.appendChild(w4);
        var w5 = document.createElement("div");
        w5.classList.add("row");
        dates.appendChild(w5);
        var w6 = document.createElement("div");
        w6.classList.add("row");
        dates.appendChild(w6);

        //Fill out offset days from previous month
        for (var i = 1; i < firstWeekday; i++) {
            var row = w1;
            var empty = document.createElement('div');
            empty.classList.add("day");
            empty.innerHTML = " ";
            row.appendChild(empty);
            offset += 1;
        }

        var dayRow = w1;
        for (var i = 1; i <= daysInMonth(selectedMonth, selectedYear); i++) {
            var day = document.createElement("span");
            day.innerHTML = i;
            day.classList.add("day");
            days[dayCount] = day;
            dayCount += 1;
            dayRow.appendChild(day);
            offset += 1;
            if (offset % 7 === 0) {
                offset = 0;
                currentWeek += 1;
                if (currentWeek === 2) {
                    dayRow = w2;
                } else if (currentWeek === 3) {
                    dayRow = w3;
                } else if (currentWeek === 4) {
                    dayRow = w4;
                } else if (currentWeek === 5) {
                    dayRow = w5;
                } else if(currentWeek === 6) {
                    dayRow = w6;
                }
            }
        }
        
        days.forEach(day => {
        day.onclick = function () {
            selectDayEle(day);
        };
        if (day.innerHTML === selectedDate.getDate()) {
            day.click();
            console.log("click");
        }
    });

    } // end populateDays()
    populateDays();

    var selectedDayEle = null;
    //highlight 
    const selectDayEle = (day) => {
        if (selectedDayEle) {
            selectedDayEle.style.backgroundColor = bodyColor;
        }
        selectedDayEle = day;
        day.style.backgroundColor = highlight;
        
        selectedDate = new Date(selectedYear, selectedMonth, day.innerHTML);
        var dateString = selectedDate.toLocaleDateString();
        title.innerHTML = dateString;
        btn.innerHTML = dateString;
    };

    // When the user clicks on the prev or next month buttons, change the month and days displayed
    prev.onclick = function () {
        if (selectedMonth === 0) {
            selectedMonth = 11;
            selectedYear -= 1;
        } else {
            selectedMonth -= 1;
        }
        mth.innerHTML = months[selectedMonth] + ' ' + selectedYear;
        dates.innerHTML = '';
        firstWeekday =  loadCalendarDays(selectedMonth, selectedYear);
        populateDays();
    };
    next.onclick = function () {
        if (selectedMonth === 11) {
            selectedMonth = 0;
            selectedYear += 1;
        } else {
            selectedMonth += 1;
        }
        mth.innerHTML = months[selectedMonth] + ' ' + selectedYear;
        dates.innerHTML = '';
        firstWeekday =  loadCalendarDays(selectedMonth, selectedYear);
        populateDays();
    };
    
    //  PUBLIC METHOD
    datepicker.getSelectedDate = function () {
        return selectedDate.toLocaleDateString();
    }

    return datepicker;
}