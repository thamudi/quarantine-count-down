'use strict';
// ------------------------
// --- Global Variables ---
// ------------------------
const countDownSectionId = document.getElementById('quarantine-countdown-section');
const quarantineFormSectionId = document.getElementById('quarantine-form-section');
const quarantineDaysFormId = document.getElementById('quarantine-form');
const resetCountDownButtonId = document.getElementById('countdown-form');
const countDownEndParId = document.getElementById('target-countdown-end');

const localStorage = window.localStorage; // shorthanded global variable for the local storage window variable

let rendered = false; // Flag used to check the state of the rendered countdown section

// --------------------------------------------------------------------------------------
// --- helper functions -----------------------------------------------------------------
// --------------------------------------------------------------------------------------

// ------------------------------
// --- LocalStorage Functions ---
// ------------------------------
function checkLocalStorageState() { // checks if local storage is empty or not
    if (localStorage.length > 0) {
        // Hide the Quarantine days form section
        toggleQuarantineFormSection('none');
        // Hide the Quarantine End message Paragraph
        toggleQuarantineEndMessage('none');
        // Show the countdown Section
        toggleQuarantineCountDownSection('block');
        // Render the Date paragraph
        renderDateSection();
        // Render the countdown script
        renderCountDownSection();
        // Switch the the rendered Flag to true for the count down to work
        rendered = true;
    } else {
        // Hides the countdown section
        toggleQuarantineCountDownSection('none');
        // Shows the main form section
        toggleQuarantineFormSection('block');
        // Reset the rendered Flag
        rendered = false;
    }
}

function clearLocalStorage(event) { // clears the local storage and then re-check the state of local storage
    event.preventDefault(); // prevent the default behavior of the form
    localStorage.clear(); // clear the localStorage
    checkLocalStorageState(); // To reset the HTML page state
}

function setLocalStorageQuarantineValues(dates, countdown) { // Save the desired values into the local storage
    localStorage.setItem('endDate', dates.endDateDayMonthText);
    localStorage.setItem('startDate', dates.startDateDayMonthText);
    localStorage.setItem('days', countdown.days);
    localStorage.setItem('hours', countdown.hours);
    localStorage.setItem('minutes', countdown.minutes);
    localStorage.setItem('seconds', countdown.seconds);
    // console.log(dates);
    // console.log(countdown);
}

// ------------------------
// --- Form functions -----
// ------------------------
function quarantineFormHandler(event) { // Handles user input from the quarantine days form
    event.preventDefault(); // prevents the default behavior of the form
    const days = Math.abs(parseInt(event.target.days.value)); // parse the form input to int and prevent negative values
    setNewQuarantine(days); // Creates a new quarantine timer properties
    checkLocalStorageState(); // Checks the localStorage state and updates the rendered HTML page
}

// --------------------------
// --- Render functions -----
// --------------------------

function toggleQuarantineFormSection(display) { // controls the visibility of the quarantine-form-section
    quarantineFormSectionId.style.display = display;
}

function toggleQuarantineCountDownSection(display) { // controls the visibility of the quarantine-countdown-section
    countDownSectionId.style.display = display;
}

function toggleQuarantineEndMessage(display) { // controls the visibility of the quarantine End message 
    countDownEndParId.style.display = display;
}

function renderDateSection() { // Renders the Quarantine date section

    const countDownParaId = document.getElementById('countdown-date');
    const target = document.getElementById('target-countdown-date');

    let template = countDownParaId.innerHTML;
    let rendered = Mustache.render(template, localStorage);
    target.innerHTML = rendered;

}

function renderCountDownSection() { // Renders the Quarantine countdown section

    const countDownParaId = document.getElementById('countdown');
    const target = document.getElementById('target-countdown');

    let template = countDownParaId.innerHTML;
    let rendered = Mustache.render(template, localStorage);
    target.innerHTML = rendered;
}

// ------------------------------
// --- Quarantine functions -----
// ------------------------------
function setNewQuarantine(days) { // Creates a new Quarantine Day and Countdown

    const date = new QuarantineDate(days); // Create a new Quarantine Date
    date.calculateEndDate(); // Calculate the end date for the Quarantine
    const countdown = new CountDown(days); // Create a new countdown
    setLocalStorageQuarantineValues(date, countdown); // save the created objects properties into the local storage

}

// -----------------------------
// --- Countdown functions -----
// -----------------------------
function countDown() {

    if (localStorage.seconds > 0) {
        localStorage.seconds -= 1;
        renderCountDownSection();
    } else {

        if (localStorage.minutes > 0) {
            localStorage.seconds = 60;
            localStorage.minutes -= 1;
            renderCountDownSection();
        } else {
            if (localStorage.hours > 0) {
                localStorage.minutes = 60;
                localStorage.hours -= 1;
                renderCountDownSection();
            } else {
                if (localStorage.days > 0) {
                    localStorage.hours = 24;
                    localStorage.days -= 1;
                    renderCountDownSection();
                } else {
                    clearInterval(); // clear the interval function
                    toggleQuarantineEndMessage('block'); // display the end quarantine message
                }
            }
        }

    }
}

// ------------------
// --- Checkers -----
// ------------------
function checkCountDownStatus() { // Checks the count down status if its rendered or not
    if (rendered) {
        countDown(); // the countdown function, doing its job
    }
}

// ---------------------
// --- Classes -----
// ---------------------

// --------------------------------
// --- Quarantine Dates Class -----
// --------------------------------
class QuarantineDate {
    
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    date = new Date();

    constructor(days) {
        // -------------------------------
        // --- Start Date properties ---
        // -------------------------------
        this.startDay = this.date.getDate();

        this.startDayText = this.daysArr[this.date.getDay()];

        this.startMonth = this.date.getMonth() + 1;
        this.startMonthText = this.months[this.date.getMonth()];
        this.startYear = this.date.getFullYear();

        this.daysInStartMonth = this.getDaysInMonth(this.startYear, this.month);

        this.startFormattedDate = this.startYear + '-' + this.startMonth + '-' + this.startDay;

        this.startDateMonthText = this.startYear + '-' + this.startMonthText + '-' + this.startDay;
        this.startDateDayText = this.startYear + '-' + this.startMonth + '-' + this.startDay + ' ' + this.startDayText;
        this.startDateDayMonthText = this.startYear + '-' + this.startMonthText + '-' + this.startDay + ' ' + this.startDayText;

        this.startDate = new Date(this.startFormattedDate);

        // --------------------------------------
        // --- Quarantine Date End properties ---
        // --------------------------------------
        this.endDay = this.startDay + days;
        this.endMonth = this.date.getMonth() + 1;
        this.endYear = this.date.getFullYear();
        
        this.endFormattedDate = this.endYear + '-' + this.endMonth + '-' + this.endDay;
        this.endDate = new Date(this.endFormattedDate);

        this.endDayText = this.daysArr[this.endDate.getDay()];
        this.endMonthText = this.months[this.endDate.getMonth()];

        this.endDateMonthText = this.endYear + '-' + this.endMonthText + '-' + this.endDay;
        this.endDateDayText = this.endYear + '-' + this.endMonth + '-' + this.endDay + ' ' + this.endDayText;
        this.endDateDayMonthText = this.endYear + '-' + this.endMonthText + '-' + this.endDay + ' ' + this.endDayText;
    }
    calculateEndDate() {

        if (this.endDay > this.daysInStartMonth) {
            this.endDay -= this.daysInStartMonth;
            this.endMonth += 1;
        }

        if (this.endMonth > 12) {
            this.endMonth -= 12;
            this.endYear + 1;
        }
    }
    getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }
}

// -------------------------
// --- CountDown Class -----
// -------------------------
class CountDown {
    constructor(days) {
        const time = new Date();
        this.days = days - 1;
        this.hours = 24 - time.getHours();
        this.minutes = 60 - time.getMinutes();
        this.seconds = 60 - time.getSeconds();
    }
}

// ----------------------
// --- event listener ---
// ----------------------
quarantineDaysFormId.addEventListener('submit', quarantineFormHandler);
resetCountDownButtonId.addEventListener('submit', clearLocalStorage);

// -------------------
// --- app js main ---
// -------------------
checkLocalStorageState(); // sets things in motion
setInterval(checkCountDownStatus, 1000);
