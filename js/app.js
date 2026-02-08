let counter = 0;
let pname = document.querySelector(".name");
let pcount = document.querySelector(".counter");
let pcps = document.querySelector(".cps");
let ptotalClicks = document.getElementById("totalClicks");
let pplaytime = document.getElementById("playtime");
let plastReward = document.getElementById("lastReward");
let ptopNamePoints = document.getElementById("topNamePoints");
let ptopNameClicks = document.getElementById("topNameClicks");
let pavgReward = document.getElementById("avgReward");

let names = {
  Kevin: 50,
  Kirill: 1, // base weight
  John: 60,
  Mike: 34,
  Alex: 90,
  David: 45,
  James: 12,
  Rick: 5,
  Morty: 5,
  Summer: 5,
  Beth: 5,
  Jerry: 19,
  Beyonce: 5,
  Taylor: 1,
  Katy: 25,
  Ariana: 5,
  Selena: 5,
  Demi: 5,
  Adolf: 10,
  Anna: 20,
  Olga: 30,
  Elza: 15,
  Orwell: 9,
  Cesar: 1,
  Max: 10,
  Matheew: 16,
  Diarea: 4,
  Peter: 30,
  Ilary: 1, // My crush btw
  Billy: 40,
  Leona: 18,
  Arthur: 20,
  Keith: 15,
  Jeff: 34,
  John_Kaisen: 2,
  Timoty: 50,
  Hunter: 67, // Holy tuff
  Robert: 40,
  Chris: 25,
  Charlotte: 30,
  Bart: 10,
  Charles: 15,
  Ren: 35,
  Megumi: 20,
  Wayne: 50,
  Yuta: 10,
  Yuji: 23,  
};

// Points per click by name (fallback uses weight-based scaling).
const nameRewards = {
  Cesar: 3000,
  Kirill: 1000, // special case: plus CPS bonus handled in getNameReward
};

const REWARD_SCALE = 60; // higher = more points for rare names

let nameCollection = {};
let namePoints = {};
let totalClicks = 0;
let startTime = Date.now();
let cps = 0;
let upgrade1Cost = 50;
let upgrade2Cost = 1000;
let upgrade3Cost = 5000;
let upgrade4Cost = 25000;
let upgrade5Cost = 125000;
let lastReward = 0;

// Kirill chance upgrade
let kirillChanceMultiplier = 1;
let kirillUpgradeCost = 500;

// Load game state from localStorage
function loadGame() {
  const saved = localStorage.getItem('nameClickerGame');
  if (saved) {
    const data = JSON.parse(saved);
    counter = data.counter || 0;
    cps = data.cps || 0;
    upgrade1Cost = data.upgrade1Cost || 50;
    upgrade2Cost = data.upgrade2Cost || 1000;
    upgrade3Cost = data.upgrade3Cost || 5000;
    upgrade4Cost = data.upgrade4Cost || 25000;
    upgrade5Cost = data.upgrade5Cost || 125000;
    kirillChanceMultiplier = data.kirillChanceMultiplier || 1;
    kirillUpgradeCost = data.kirillUpgradeCost || 500;
    nameCollection = data.nameCollection || {};
    namePoints = data.namePoints || {};
    totalClicks = data.totalClicks || 0;
    startTime = data.startTime || Date.now();
    lastReward = data.lastReward || 0;
  }
  window.nameCollection = nameCollection;
  window.namePoints = namePoints;
  updateUI();
}

// Save game state to localStorage
function saveGame() {
  const data = {
    counter,
    cps,
    upgrade1Cost,
    upgrade2Cost,
    upgrade3Cost,
    upgrade4Cost,
    upgrade5Cost,
    kirillChanceMultiplier,
    nameCollection,
    namePoints,
    kirillUpgradeCost,
    totalClicks,
    startTime,
    lastReward
  };
  localStorage.setItem('nameClickerGame', JSON.stringify(data));
}

function getRandomWeighted() {
  // copy names to avoid mutating original weights
  let weightedNames = {...names};
  weightedNames.Kirill = Math.floor(weightedNames.Kirill * kirillChanceMultiplier);
  let total = Object.values(weightedNames).reduce((a,b) => a+b, 0);
  let roll = Math.random() * total;
  let sum = 0;
  let chosen = null;

  for (let key in weightedNames) {
    sum += weightedNames[key];
    if (roll < sum) {
      chosen = key;
      break;
    }
  }

  const reward = getNameReward(chosen, weightedNames[chosen]);
  counter += reward;
  totalClicks++;
  lastReward = reward;
  if (plastReward) {
    plastReward.textContent = `+${reward}`;
  }

  pcount.textContent = counter;
  trackNameDiscovery(chosen, reward);
  pname.textContent = chosen;
  updateUI();
  saveGame();
  playClickSound();
}

function getNameReward(name, weight) {
  if (name === "Kirill") {
    return nameRewards.Kirill + 2 * cps;
  }
  if (nameRewards[name] != null) {
    return nameRewards[name];
  }
  // Rarer names (lower weight) give more points.
  return Math.max(1, Math.round(REWARD_SCALE / Math.max(1, weight)));
}

function playClickSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = 600;
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

function canAfford(cost) {
  return counter >= cost;
}

function trackNameDiscovery(name, reward) {
  if (!nameCollection[name]) {
    nameCollection[name] = 0;
  }
  nameCollection[name]++;
  window.nameCollection = nameCollection;

  if (!namePoints[name]) {
    namePoints[name] = 0;
  }
  namePoints[name] += reward;
  window.namePoints = namePoints;
}

function updateUI() {
  pcount.textContent = counter;
  pcps.textContent = "CPS: " + cps;
  if (ptotalClicks) {
    ptotalClicks.textContent = "Total: " + totalClicks;
  }
  if (plastReward) {
    plastReward.textContent = `+${lastReward}`;
  }
  updateStats();
  updateButtonStates();
}

function updateStats() {
  if (!ptopNamePoints || !ptopNameClicks || !pavgReward) {
    return;
  }
  let topPointsName = "-";
  let topPointsValue = 0;
  for (let name in namePoints) {
    if (namePoints[name] > topPointsValue) {
      topPointsValue = namePoints[name];
      topPointsName = name;
    }
  }

  let topClicksName = "-";
  let topClicksValue = 0;
  for (let name in nameCollection) {
    if (nameCollection[name] > topClicksValue) {
      topClicksValue = nameCollection[name];
      topClicksName = name;
    }
  }

  const avg = totalClicks > 0 ? Math.round(counter / totalClicks) : 0;
  ptopNamePoints.textContent = `Top (points): ${topPointsName} (${topPointsValue})`;
  ptopNameClicks.textContent = `Top (clicks): ${topClicksName} (${topClicksValue})`;
  pavgReward.textContent = `Avg reward: ${avg}`;
}

function updateButtonStates() {
  document.getElementById('upgrade1').disabled = !canAfford(upgrade1Cost);
  document.getElementById('upgrade2').disabled = !canAfford(upgrade2Cost);
  document.getElementById('upgrade3').disabled = !canAfford(upgrade3Cost);
  document.getElementById('upgrade4').disabled = !canAfford(upgrade4Cost);
  document.getElementById('upgrade5').disabled = !canAfford(upgrade5Cost);
  document.getElementById('upgradeKirill').disabled = !canAfford(kirillUpgradeCost);
  updateUpgradeTexts();
}

function updateUpgradeTexts() {
  document.getElementById('upgrade1').innerHTML = 
    `<span class="upgrade-name">Basic Namer</span><span class="upgrade-desc"> +3 CPS</span><span class="upgrade-cost"> Cost: ${upgrade1Cost}</span>`;
  document.getElementById('upgrade2').innerHTML = 
    `<span class="upgrade-name">Pro Namer</span><span class="upgrade-desc"> +10 CPS</span><span class="upgrade-cost"> Cost: ${upgrade2Cost}</span>`;
  document.getElementById('upgrade3').innerHTML = 
    `<span class="upgrade-name">Name Expert</span><span class="upgrade-desc"> +100 CPS</span><span class="upgrade-cost"> Cost: ${upgrade3Cost}</span>`;
  document.getElementById('upgrade4').innerHTML = 
    `<span class="upgrade-name">Name Writer</span><span class="upgrade-desc"> +1000 CPS</span><span class="upgrade-cost"> Cost: ${upgrade4Cost}</span>`;
  document.getElementById('upgrade5').innerHTML = 
    `<span class="upgrade-name">Professianal Name Writer</span><span class="upgrade-desc"> +5000 CPS</span><span class="upgrade-cost"> Cost: ${upgrade5Cost}</span>`;
  document.getElementById('upgradeKirill').innerHTML = 
    `<span class="upgrade-name">Kirill Buff</span><span class="upgrade-desc"> x${kirillChanceMultiplier.toFixed(1)} Chance</span><span class="upgrade-cost">Cost: ${kirillUpgradeCost}</span>`;
}

// Upgrade 1: +3 CPS
function upgrade1() {
  if (counter >= upgrade1Cost) {
    counter -= upgrade1Cost;
    cps += 3;
    upgrade1Cost = Math.floor(upgrade1Cost * 1.5);
    updateUI();
    saveGame();
    playClickSound();
  }
}

// Upgrade 2: +10 CPS
function upgrade2() {
  if (counter >= upgrade2Cost) {
    counter -= upgrade2Cost;
    cps += 10;
    upgrade2Cost = Math.floor(upgrade2Cost * 1.5);
    updateUI();
    saveGame();
    playClickSound();
  }
}

// Upgrade 3: +100 CPS
function upgrade3() {
  if (counter >= upgrade3Cost) {
    counter -= upgrade3Cost;
    cps += 100;
    upgrade3Cost = Math.floor(upgrade3Cost * 1.5);
    updateUI();
    saveGame();
    playClickSound();
  }
}

// Upgrade 4: +1000 CPS
function upgrade4() {
  if (counter >= upgrade4Cost) {
    counter -= upgrade4Cost;
    cps += 1000;
    upgrade4Cost = Math.floor(upgrade4Cost * 1.5);
    updateUI();
    saveGame();
    playClickSound();
  }
}

// Upgrade 5: +5000 CPS
function upgrade5(){
  if (counter >= upgrade5Cost){
    counter -= upgrade5Cost;
    cps += 5000;
    upgrade5Cost = Math.floor(upgrade5Cost * 1.5);
    updateUI();
    saveGame();
    playClickSound();
  }
}

// Kirill chance upgrade
function upgradeKirill() {
  if (counter >= kirillUpgradeCost) {
    counter -= kirillUpgradeCost;
    kirillChanceMultiplier += 0.2; // increase Kirill chance
    kirillUpgradeCost = Math.floor(kirillUpgradeCost * 2);
    updateUI();
    saveGame();
    playClickSound();
  }
}

// Reset game
function resetGame() {
  if (confirm('Are you sure you want to reset? All progress will be lost.')) {
    counter = 0;
    totalClicks = 0;
    cps = 0;
    upgrade1Cost = 50;
    upgrade2Cost = 1000;
    upgrade3Cost = 5000;
    upgrade4Cost = 25000;
    upgrade5Cost = 125000;
    kirillChanceMultiplier = 1;
    kirillUpgradeCost = 500;
    startTime = Date.now();
    nameCollection = {};
    namePoints = {};
    lastReward = 0;
    window.nameCollection = nameCollection;
    window.namePoints = namePoints;
    pname.textContent = '-';
    updateUI();
    saveGame();
  }
}

// Event listeners
document.getElementById('clickBtn').addEventListener('click', getRandomWeighted);
document.getElementById('upgrade1').addEventListener('click', upgrade1);
document.getElementById('upgrade2').addEventListener('click', upgrade2);
document.getElementById('upgrade3').addEventListener('click', upgrade3);
document.getElementById('upgrade4').addEventListener('click', upgrade4);
document.getElementById('upgrade5').addEventListener('click', upgrade5);
document.getElementById('upgradeKirill').addEventListener('click', upgradeKirill);
document.getElementById('resetBtn').addEventListener('click', resetGame);

// CPS interval
setInterval(() => {
  counter += cps;
  pcount.textContent = counter;
  updateButtonStates();
  saveGame();
}, 1000);

// Update playtime
setInterval(() => {
  if (!pplaytime) {
    return;
  }
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  pplaytime.textContent = elapsed + 's';
}, 1000);

// Load game on startup
loadGame();

