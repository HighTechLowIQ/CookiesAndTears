var oneMilReached = false;
var tenMilReached = false;
var speedrunTimer;

function checkSpeedruns() {
	if (!oneMilReached) {
		oneMilReached = checkSpeedrun("OneMil", 1000000);
	}

	if (!tenMilReached) {
		tenMilReached = checkSpeedrun("TenMil", 10000000);
	}

	if (oneMilReached && tenMilReached) {
		clearInterval(speedrunTimer);
	}
}

function checkSpeedrun(name, target) {
	const timeDiv = document.querySelector('#' + name + 'Time');
	if (!timeDiv) {
		if (Game.cookiesEarned >= target) {
			var speedrunTime = new Date() - Game.startDate;
			var timeString = getTimeString(speedrunTime);
			setHeaderTime(name, timeString);
			return true;
		}
	} else {
		return true;
	}
	return false;
}

function getTimeString(milliseconds) {
  var minutes = Math.floor(milliseconds / 60000);
  var seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  var timeString = seconds == 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  return timeString;
}

function setHeaderTime(name, timeString) {
	const topBar = document.querySelector('#topBar');
  let timeDiv = document.createElement('div');
  timeDiv.id = name + "Time";
  timeDiv.style.color = "yellow";
  timeDiv.textContent = name + ": " + timeString;
  topBar.appendChild(timeDiv);
}

function resetHeaderTimes() {
	removeHeaderTime('OneMilTime');
	removeHeaderTime('TenMilTime');
	oneMilReached = false;
  tenMilReached = false;
  addSpeedrunTimer();
}

function removeHeaderTime(id) {
	const header = document.querySelector('#' + id);
	if (header) {
    header.remove();
  }
}

function setupSpeedrunMonitor() {
	// Monitor the Wipe save function, and clear the timers on a wipe
	var oldFunction = Game.HardReset;
	Game.HardReset = function(bypass) {
    if (bypass == 2) {
    	resetHeaderTimes();
    }
    oldFunction(bypass);
  };

  addSpeedrunTimer();
}

function addSpeedrunTimer() {
	clearInterval(speedrunTimer);
	speedrunTimer = setInterval(function() {
    checkSpeedruns();
  }, 250);
}

setupSpeedrunMonitor();
