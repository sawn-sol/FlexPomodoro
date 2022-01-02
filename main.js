let startButton = document.getElementById('start');
let resetButton = document.getElementById('reset');
// let modeBtn = document.getElementById('modeBtn');
let subtitle = document.getElementById('subtitle');

let minutes = document.getElementById('minutes');
let seconds = document.getElementById('seconds');
let audio = new Audio('Assets/alarm.wav');
audio.loop = false;

let startTimer = null;
let startMinutes = null;
let startSeconds = null;
let focMins, focSecs;
let resetTimer;
let isStartButton = true;

let focusMode = true;
let focusColor;
let breakColor;
let root = document.querySelector(':root');

function timer() {
    let mins = parseInt(minutes.value);
    let secs = parseInt(seconds.value); 
    if(secs != 0){
        seconds.value = parseInt(seconds.value) - 1;
    }
    if (parseInt(seconds.value) < 10) {
        seconds.value = '0' + parseInt(seconds.value);
        secs =  parseInt(seconds.value);
    } 
    if(mins != 0 && secs == 0){
        seconds.value = 59;
        minutes.value = parseInt(mins) - 1;
        if (parseInt(mins) < 10) {
            minutes.value = '0' + parseInt(minutes.value);
        }
    } 
    if (mins == 0 && secs == 0) {
        stopTimer();
        if(focusMode) {
            enableBreakMode();
            startButton.innerHTML = '<i id="pause_button" class="fas fa-pause"></i>Stop';
            subtitle.textContent = 'Time to Rest';
            minutes.value = '05';
            seconds.value = '00'; 
            isStartButton = false;
            startInterval();
        } else {
            enableFocusMode();
            startButton.innerHTML = '<i id="pause_button" class="fas fa-pause"></i>Stop';
            subtitle.textContent = 'Time to Focus!';
            if (focMins == null) {
                focMins = '00';
            }    
            minutes.value = focMins;
            if (focSecs == null) {
                focSecs = '00';
                return;
            }  
            minutes.value = focSecs;
            isStartButton = true;
            startInterval();
        }
        audio.play(); 
        // resetTimer = setTimeout(function () {
        //     minutes.value = startMinutes;
        //     seconds.value = startSeconds;
        // },5000);

        
    } 
    document.title = `${minutes.value}:${seconds.value} - Focus!`;
} 

function stopTimer() {
    startButton.innerHTML = '<i id="pause_button" class="fas fa-play"></i>Start';
    // startMinutes = minutes.value;
    // startSeconds = seconds.value;
    isStartButton = true;
    minutes.style.opacity = 0.9;
    seconds.style.opacity = 0.9;
    document.title = 'FlexPomodoro';
    clearInterval(startTimer);
}

const timeInputs = document.querySelectorAll('.time'); 
for (let i = 0; i < timeInputs.length; i++) {
    timeInputs[i].addEventListener('keypress', function (evt) {
        clearTimeout(resetTimer);
        stopTimer();

        // Check if the input is equal to a number 
        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
            evt.preventDefault();
        }
    });
    timeInputs[i].addEventListener('input', function () {
        clearTimeout(resetTimer);
        stopTimer(); 
        // if (this.value.length == 3 && this.value[0]) {
        //     this.value = this.value.slice(2,4);  
        // }
        if (this.value.length > 3) { 
            this.value = this.value.slice(1,3) + this.value[3];  
        }
        if(this.value < 10) {
            if (this.value[0] != '0'){
                this.value = '0' + this.value;
            } else if (this.value.length == 1) {
                this.value = '0' + this.value;
            }
        } else if (this.value[0] == '0') {
            this.value = this.value.slice(1);
        }
 
    });
    timeInputs[1].addEventListener('input', function () {
        if (this.value > 59) {
            if(isNaN(minutes.value) || minutes.value == '') {
                minutes.value = '00';        
            }      
            if (this.value[0] == "0") {
                this.value = this.value[1] + this.value[2];
            } else if (seconds.value == "60") {
                minutes.value = parseInt(minutes.value) + Math.floor(parseInt(seconds.value) / 60);
                this.value = parseInt(this.value) % 60;
            } else {
                if (this.value.length > 2) {
                    if (this.value[0] == "0") {
                        this.value = this.value[1] + this.value[2];
                    } else {
                        this.value = this.value[1] + this.value[2];
                    }  
                } else {
                    minutes.value = parseInt(minutes.value) + Math.floor(parseInt(seconds.value) / 60);
                    this.value = parseInt(this.value) % 60;
                }
                // this.value = this.value[1] + this.value[2];
            }
            
            if (minutes.value < 10 && minutes.value[0] != 0) {
                minutes.value = '0' + minutes.value;
            }
        
        } else if (parseInt(this.value) < 0) {
            if (seconds.value == -1) {
                if (minutes.value == null || minutes.value == '') {
                    minutes.value = '00';
                }
                if (parseInt(minutes.value) == 0 && parseInt(seconds.value) == -1) {
                    seconds.value ='00';
                    return;
                }
                minutes.value = parseInt(minutes.value) - 1; 
                if (minutes.value < 10) {
                    minutes.value = '0' + minutes.value;
                }
            }
            seconds.value = 60 + parseInt(this.value);
        } 
        if (this.value.length > 2) {
            if (this.value[0] == "0") {
                this.value = this.value[1] + this.value[2];
            } else {
                this.value = this.value[1] + this.value[2];
            }  
        }
    });
}

function startInterval() {
    startTimer = setInterval(function() {
        timer();
    }, 1000);
}

startButton.addEventListener('click', function() {
    if (isStartButton) {
        if(isNaN(parseInt(minutes.value))) {
            minutes.value = '0' + 0;
        }
        if(isNaN(parseInt(seconds.value))) {
            seconds.value = '0' + 0;
        }
        if (!(parseInt(minutes.value) == 0 && parseInt(seconds.value) == 0)) {
            stopTimer();
            if(focusMode) {
                startMinutes = minutes.value;
                startSeconds = seconds.value;
                focMins = startMinutes;
                focSecs = startSeconds;
                enableFocusMode();
            } else {
                startMinutes = minutes.value;
                startSeconds = seconds.value;
                enableBreakMode();
            }
            startButton.innerHTML = '<i id="pause_button" class="fas fa-pause"></i>Stop';
            isStartButton = false;
            minutes.style.opacity = 1;
            seconds.style.opacity = 1;
            document.title = `${minutes.value}:${seconds.value} - Focus!`;
            startInterval();
        }
    } else {
        startButton.textContent = 'Start';
        // startMinutes = minutes.value;
        // startSeconds = seconds.value;
        isStartButton = true;
        stopTimer();
    }
    
})

resetButton.addEventListener('click', function() {
    minutes.value = null;
    seconds.value = null;
    stopTimer();
})
 
function enableFocusMode() {
    root.style.setProperty('--main-color', 'red'); 
    mainColor = 'red'
    focusMode = true;
    // darkMode = localStorage.setItem('darkMode', 'dark')
}

function enableBreakMode() {
    root.style.setProperty('--main-color', 'green'); 
    mainColor = 'green';
    focusMode = false;
    // darkMode = localStorage.setItem('darkMode', 'white');
}  

function toggleMode() {
    if (focusMode) {
        enableBreakMode();
    } else {
        enableFocusMode();
    }
}
 
function toggleMenu() {
    let e =document.getElementById('sidebar');
    e.classList.toggle('show');

    Style = window.getComputedStyle(e);
    right = Style.getPropertyValue('right');

    if (right == '0px') {
        e.style.transition = 'all 0.5s ease';
    } else {
        e.style.transition = 'all 0.5s ease';
    }
}