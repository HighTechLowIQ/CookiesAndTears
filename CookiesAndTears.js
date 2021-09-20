/**
 * Copyright 2021 HighTechLowIQ
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var cheatsOn = false;

var variables;
var cookieFunction;
var goldenCookieFunction;
var upgradeFunction;
var futureCookiesFunction;
var timerFunction;

var clickTimer; 
var upgradeTimer; 
var goldenCookieTimer;

function getCookiesInXSeconds(seconds) {
  return Math.floor(Game.cookies) + Math.floor(Game.cookiesPs * seconds);
}

function getToggleCheatsColor() {
  var toggleCheatsColor;
  if (cheatsOn) {
    toggleCheatsColor = "green";
  } else {
    toggleCheatsColor = "red";
  }
  return toggleCheatsColor; 
}

function getToggleCheatsText() {
  var toggleCheatsText;
  if (cheatsOn) {
    toggleCheatsText = "Disable Cheats";
  } else {
    toggleCheatsText = "Enable Cheats";
  }
  return toggleCheatsText; 
}

function clickCookie() {
  Game.ClickCookie();
}

function buyUpgrades() {  
  var upgradesAvailable = Game.UpgradesInStore;
  
  // Always buy upgrades - start at the last upgrade, and go down to the first. If you can afford an upgrade in 10 seconds, don't buy anything
  for (var i = upgradesAvailable.length - 1; i >= 0; i--) {
    var futureCookies = getCookiesInXSeconds(30);
    if (upgradesAvailable[i].canBuy()) {
      upgradesAvailable[i].buy();
    } else if (upgradesAvailable[i].getPrice() <= futureCookies) {
      console.log("Will have enough cookies for " + upgradesAvailable[i].name + " in 30 seconds.");
      return;
    }
	}

  var buildingsAvailable = Game.ObjectsById;

	// The last building is the best
  for (var i = buildingsAvailable.length - 1; i >= 0; i--) {
    if (buildingsAvailable[i].locked == 0) {
      // Continuously buy the building if we have enough money
      while (buildingsAvailable[i].price <= Game.cookies) {
        buildingsAvailable[i].buy();
      }
      
      // Check if we'll have enough for the next building in 10 seconds. If not, move on to the next building
    	var futureCookies = getCookiesInXSeconds(15);
      if (buildingsAvailable[i].price <= futureCookies) {
        console.log("Will have enough cookies for " + buildingsAvailable[i].name + " in 15 seconds.");
        return;
      }
    }
	}
}

function clickGoldenCookie() {
  Game.shimmers.forEach(
    function(shimmer) {
      if (shimmer.type == "golden") {
        console.log("Clicking Golden Cookie!");
      	shimmer.pop();
      }
  	}
  );
}
  
function startTimers() {
  // Click the cookie every 4ms
  clickTimer = setInterval(function() {
    clickCookie();
  }, 4);
    
  // Buy relevant upgrades every tenth of a second
  upgradeTimer = setInterval(function() {
    buyUpgrades();
  }, 100);
    
  // Click any golden cookies every half second
  goldenCookieTimer = setInterval(function() {
    clickGoldenCookie();
  }, 500);
}

function stopTimers() {
	clearInterval(clickTimer);
	clearInterval(upgradeTimer);
	clearInterval(goldenCookieTimer);
}

function toggleTimers() {
  if (cheatsOn) {
    startTimers();
  } else {
    stopTimers();
  }
}

function toggleCheats() {
	console.log("Toggling cheats from " + cheatsOn + " to " + !cheatsOn + ".");
  cheatsOn = !cheatsOn;

  const toggleCheats = document.querySelector('#toggleCheats');
  toggleCheats.style.color = getToggleCheatsColor();
  toggleCheats.textContent = getToggleCheatsText();
  
  toggleTimers();
}

function addButton() {
  const topBar = document.querySelector('#topBar');
  let toggleElement = document.createElement('div');
  toggleElement.id = "toggleCheats";
  toggleElement.style.color = "red";
  toggleElement.style.cursor = "pointer";
  toggleElement.textContent = getToggleCheatsText();
  toggleElement.onclick = toggleCheats;
  topBar.appendChild(toggleElement);
}

function runScript() {
  console.log("Running!");
  
  addButton();
}


runScript();