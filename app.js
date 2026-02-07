let counter = 0;
let pname = document.querySelector(".name");
let pcount = document.querySelector(".counter");
let pcps = document.querySelector(".cps");
let ptotalClicks = document.getElementById("totalClicks");
let pplaytime = document.getElementById("playtime");

let names = {
  Kevin: 50,
  Kirill: 3, // base weight
  Robert: 20,
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
};

let nameCollection = {};
let totalClicks = 0;
let startTime = Date.now();
let cps = 0;
let upgrade1Cost = 50;
let upgrade2Cost = 1000;
let upgrade3Cost = 5000;

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
    kirillChanceMultiplier = data.kirillChanceMultiplier || 1;
    kirillUpgradeCost = data.kirillUpgradeCost || 500;
    nameCollection = data.nameCollection || {};
    totalClicks = data.totalClicks || 0;
    startTime = data.startTime || Date.now();
  }
  window.nameCollection = nameCollection;
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
    kirillChanceMultiplier,
    nameCollection,
    kirillUpgradeCost,
    totalClicks,
    startTime
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

  // Kirill reward stays same
  if (chosen === "Kirill") {
    counter += 1000 + 2 * cps;
  } else {
    counter++;
  }
  totalClicks++;

  pcount.textContent = counter;
  trackNameDiscovery(chosen);
  pname.textContent = chosen;
  updateUI();
  saveGame();
  playClickSound();
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

function trackNameDiscovery(name) {
  if (!nameCollection[name]) {
    nameCollection[name] = 0;
  }
  nameCollection[name]++;
  window.nameCollection = nameCollection;
}

function updateUI() {
  pcount.textContent = counter;
  pcps.textContent = "CPS: " + cps;
  if (ptotalClicks) {
    ptotalClicks.textContent = "Total: " + totalClicks;
  }
  updateButtonStates();
}

function updateButtonStates() {
  document.getElementById('upgrade1').disabled = !canAfford(upgrade1Cost);
  document.getElementById('upgrade2').disabled = !canAfford(upgrade2Cost);
  document.getElementById('upgrade3').disabled = !canAfford(upgrade3Cost);
  document.getElementById('upgradeKirill').disabled = !canAfford(kirillUpgradeCost);
  updateUpgradeTexts();
}

function updateUpgradeTexts() {
  document.getElementById('upgrade1').innerHTML = 
    `<span class="upgrade-name">Basic Click</span><span class="upgrade-desc"> +3 CPS</span><span class="upgrade-cost"> Cost: ${upgrade1Cost}</span>`;
  document.getElementById('upgrade2').innerHTML = 
    `<span class="upgrade-name">Click Pro</span><span class="upgrade-desc"> +10 CPS</span><span class="upgrade-cost">Cost: ${upgrade2Cost}</span>`;
  document.getElementById('upgrade3').innerHTML = 
    `<span class="upgrade-name">Click Master</span><span class="upgrade-desc"> +100 CPS</span><span class="upgrade-cost">Cost: ${upgrade3Cost}</span>`;
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
    kirillChanceMultiplier = 1;
    kirillUpgradeCost = 500;
    startTime = Date.now();
    nameCollection = {};
    window.nameCollection = nameCollection;
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
document.getElementById('upgradeKirill').addEventListener('click', upgradeKirill);
document.getElementById('resetBtn').addEventListener('click', resetGame);

// Spacebar to click
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    getRandomWeighted();
  }
});

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

