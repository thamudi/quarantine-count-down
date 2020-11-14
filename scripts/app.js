'use strict';
// ------------------------
// --- Global Variables ---
// ------------------------
const countDownSectionId = document.getElementById('quarantine-countdown-section');
const quarantineFormSectionId = document.getElementById('quarantine-form-section');
const quarantineDaysFormId = document.getElementById('quarantine-days-form');
const quarantineCountDaysFormId = document.getElementById('quarantine-count-days-form');
const quarantineFromToId = document.getElementById('quarantine-from-to-form');
const resetCountDownButtonId = document.getElementById('countdown-form');
const countDownContainer = document.getElementById('count-down-container');
const countContainer = document.getElementById('count-container');
const countDownEndParId = document.getElementById('target-countdown-end');

const localStorage = window.localStorage; // shorthanded global variable for the local storage window variable

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
        // Check local storage state type and render the blocks accordingly 
        checkLocalStorageStateType();
    } else {
        // Hides the countdown section
        toggleQuarantineCountDownSection('none');
        // Shows the main form section
        toggleQuarantineFormSection('block');
    }
}

function clearLocalStorage(event) { // clears the local storage and then re-check the state of local storage
    event.preventDefault(); // prevent the default behavior of the form
    localStorage.clear(); // clear the localStorage
    checkLocalStorageState(); // To reset the HTML page state
}

function setLocalStorageQuarantineValues(dates, countdown, countType) { // Save the desired values into the local storage
    localStorage.setItem('endDate', dates.endDateDayMonthText);
    localStorage.setItem('startDate', dates.startDateDayMonthText);
    localStorage.setItem('days', countdown.days);
    localStorage.setItem('hours', countdown.hours);
    localStorage.setItem('minutes', countdown.minutes);
    localStorage.setItem('seconds', countdown.seconds);
    localStorage.setItem('stateType', countType);

}

function checkLocalStorageStateType() { // check if the running state is count or countdown
    if (localStorage.stateType === 'countdown') {
        // Hide the Count Block
        toggleCountContainer('none');
        // Show the countdown block
        toggleCountdownContainer('block');
        // Render the Date paragraph
        renderCountdownDateSection();
        // Render the countdown script
        renderCountDownSection();
        // Render the date of today
        renderCurrentDate();
    } else if (localStorage.stateType === 'count') {
        // Hide the countdown block
        toggleCountdownContainer('none');
        // Show the count
        toggleCountContainer('block');
        // Render the count Date 
        renderCountDateSection();
        // Render the count script
        renderCountSection();
    }
}

// ------------------------
// --- Form functions -----
// ------------------------
function quarantineDaysFormHandler(event) { // Handles user input from the quarantine days form
    event.preventDefault(); // prevents the default behavior of the form
    const days = Math.abs(parseInt(event.target.days.value)); // parse the form input to int and prevent negative values
    setNewQuarantine(days, 'countdown'); // Creates a new quarantine timer properties
    checkLocalStorageState(); // Checks the localStorage state and updates the rendered HTML page
}

function quarantineCountFormHandler(event) { // Handles user input from the quarantine days form
    event.preventDefault(); // prevents the default behavior of the form
    setNewQuarantine(0, 'count'); // Creates a new quarantine timer properties
    checkLocalStorageState(); // Checks the localStorage state and updates the rendered HTML page
}

function quarantineFormToHandler(event) { // Handles user input from the quarantine days form
    event.preventDefault(); // prevents the default behavior of the form
    const from = event.target.from.value;
    const to = event.target.to.value;
    setNewQuarantine(0, 'countdown', from, to); // Creates a new quarantine timer properties
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

function toggleCountdownContainer(display) { // controls the visibility of the quarantine countdown container
    countDownContainer.style.display = display;
}

function toggleCountContainer(display) { // controls the visibility of the quarantine count container
    countContainer.style.display = display;
}

function renderCountdownDateSection() { // Renders the Quarantine date section

    const countDownParaId = document.getElementById('countdown-date');
    let template = countDownParaId.innerHTML;
    let rendered = Mustache.render(template, localStorage);
    document.getElementById('target-countdown-date').innerHTML = rendered;

}

function renderCountDateSection() { // Renders the Quarantine date section

    const countDownParaId = document.getElementById('count-date');
    let template = countDownParaId.innerHTML;
    const date = new QuarantineDate();

    const day = {
        'today': date.startDayText,
        'day': date.startDay,
        'month': date.startMonthText,
        'year': date.startYear
    };

    let rendered = Mustache.render(template, day);
    document.getElementById('target-count-date').innerHTML = rendered;

}

function renderCountDownSection() { // Renders the Quarantine countdown section

    const countDownParaId = document.getElementById('countdown');
    let template = countDownParaId.innerHTML;
    let rendered = Mustache.render(template, localStorage);
    document.getElementById('target-countdown').innerHTML = rendered;
}

function renderCountSection() { // Renders the Quarantine countdown section

    const countDownParaId = document.getElementById('count');
    let template = countDownParaId.innerHTML;
    let rendered = Mustache.render(template, localStorage);
    document.getElementById('target-count').innerHTML = rendered;
}

function renderCurrentDate() {
    const countDownParaId = document.getElementById('date');
    let template = countDownParaId.innerHTML;
    const date = new QuarantineDate();

    const day = {
        'today': date.startDayText,
        'day': date.startDay,
        'month': date.startMonthText,
        'year': date.startYear
    };

    let rendered = Mustache.render(template, day);
    document.getElementById('target-date').innerHTML = rendered;
}

function renderFooter() {
        document.getElementById('footer').classList.add('add-height');
        setTimeout(()=>{
            document.getElementById('footer').classList.remove('add-height');
        }, 5000);
}

// ------------------------------
// --- Quarantine functions -----
// ------------------------------
function setNewQuarantine(days, type, from = null, to = null) { // Creates a new Quarantine Day and Countdown

    const date = new QuarantineDate(days, from, to); // Create a new Quarantine Date
    if (to) {
        days = date.calculateDaysDifference();
    }
    const countdown = new CountDown(days); // Create a new countdown
    countdown.checkCountUpDayStatus();
    setLocalStorageQuarantineValues(date, countdown, type); // save the created objects properties into the local storage

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
function countUp() {
    const seconds = parseInt(localStorage.seconds);
    const minutes = parseInt(localStorage.minutes);
    const hours = parseInt(localStorage.hours);
    const days = parseInt(localStorage.days);
    if (localStorage.seconds < 60) {
        localStorage.seconds = seconds + 1;
        renderCountSection();
    } else {

        if (localStorage.minutes < 60) {
            localStorage.seconds = 0;
            localStorage.minutes = minutes + 1;
            renderCountSection();
        } else {
            if (localStorage.hours < 60) {
                localStorage.minutes = 0;
                localStorage.hours = hours + 1;
                renderCountSection();
            } else {
                if (localStorage.days < 24) {
                    localStorage.hours = 0;
                    localStorage.days = days + 1;
                    renderCountSection();
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
    if (localStorage.length > 0) {
        if (localStorage.stateType === 'countdown') {
            countDown(); // the countdown function, doing its job
        }

        if (localStorage.stateType === 'count') {
            countUp(); // the count function, doing its job as well, poor guy
        }
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

    constructor(days = 0, from = null, to = null) {

        let date = new Date();
        if (from) {
            date = new Date(from);
        }
        // -------------------------------
        // --- Start Date properties ---
        // -------------------------------
        this.startDay = date.getDate();

        this.startDayText = this.daysArr[date.getDay()];

        this.startMonth = date.getMonth() + 1;
        this.startMonthText = this.months[date.getMonth()];
        this.startYear = date.getFullYear();

        this.daysInStartMonth = this.getDaysInMonth(this.startYear, this.startMonth);

        this.startFormattedDate = this.startYear + '-' + this.startMonth + '-' + this.startDay;

        this.startDateMonthText = this.startYear + '-' + this.startMonthText + '-' + this.startDay;
        this.startDateDayText = this.startYear + '-' + this.startMonth + '-' + this.startDay + ' ' + this.startDayText;
        this.startDateDayMonthText = this.startYear + '-' + this.startMonthText + '-' + this.startDay + ' ' + this.startDayText;

        this.startDate = new Date(this.startFormattedDate);

        // --------------------------------------
        // --- Quarantine Date End properties ---
        // --------------------------------------
        this.endDay = this.startDay + days;
        this.endMonth = date.getMonth() + 1;
        this.endYear = date.getFullYear();
        this.calculateEndDate();
        this.endFormattedDate = this.endYear + '-' + this.endMonth + '-' + this.endDay;
        this.endDate = new Date(this.endFormattedDate);

        if (to) {
            this.endDate = new Date(to);
            this.endDay = this.endDate.getDate();
            this.endMonth = date.getMonth() + 1;
            this.endYear = date.getFullYear();
            this.endFormattedDate = this.endYear + '-' + this.endMonth + '-' + this.endDay;
        }

        this.endDayText = this.daysArr[this.endDate.getDay()];
        this.endMonthText = this.months[this.endDate.getMonth()];

        this.endDateMonthText = this.endYear + '-' + this.endMonthText + '-' + this.endDay;
        this.endDateDayText = this.endYear + '-' + this.endMonth + '-' + this.endDay + ' ' + this.endDayText;
        this.endDateDayMonthText = this.endYear + '-' + this.endMonthText + '-' + this.endDay + ' ' + this.endDayText;
    }

    calculateEndDate() {
        while (this.endDay > this.daysInStartMonth) {

            this.endDay -= this.daysInStartMonth;
            this.endMonth += 1;
            
            this.daysInStartMonth = this.getDaysInMonth(this.endYear, this.endMonth);

            if (this.endMonth > 12) {
                this.endMonth -= 12;
                this.endYear += 1;
                this.daysInStartMonth = this.getDaysInMonth(this.endYear, this.endMonth);
            }
        }
    }

    getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    }

    calculateDaysDifference() {
        const today = new Date();
        const differenceInTime = this.endDate.getTime() - today.getTime();

        // To calculate the no. of days between two dates 
        let differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays === 0 ? differenceInDays += 1 : differenceInDays;
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

    checkCountUpDayStatus() {
        if (this.days < 0) {
            this.days = 0;
            this.hours = 0;
            this.minutes = 0;
            this.seconds = 0;
        }
    }
}

// ----------------------
// --- event listener ---
// ----------------------
quarantineDaysFormId.addEventListener('submit', quarantineDaysFormHandler);
quarantineCountDaysFormId.addEventListener('submit', quarantineCountFormHandler);
quarantineFromToId.addEventListener('submit', quarantineFormToHandler);
resetCountDownButtonId.addEventListener('submit', clearLocalStorage);
window.addEventListener('wheel', renderFooter)
// -------------------
// --- app js main ---
// -------------------
checkLocalStorageState(); // sets things in motion
setInterval(checkCountDownStatus, 1000);
