console.log("app.js loaded");
const cards = document.querySelectorAll(".card");
const xpDisplay = document.getElementById("xp");

let totalXP = Number(localStorage.getItem("totalXP")) || 0;
let doneIds = JSON.parse(localStorage.getItem("doneIds")) || [];
let monthXP = Number(localStorage.getItem("monthXP")) || 0;
let stats = JSON.parse(localStorage.getItem("stats")) || { completions:  {} };

const habitNames = {
  exercise: "Exercise",
  coding: "Study",
  jobs: "Jobs",
  reading: "Reading",
};

const MAX_LEVEL = 100;

function xpToNext(level) {
  return 100 + level * 4;
}



const titles = [
  {minLevel: 50, name: "Master"},
  {minLevel: 25, name: "Veteran"},
  {minLevel: 10, name: "Adept"},
  {minLevel: 5, name: "Apprentice"},
  {minLevel: 1, name: "Novice"}

];

const today = new Date().toDateString();
const lastDate = localStorage.getItem("lastDate");

if (lastDate !== today) {
  doneIds = [];
  localStorage.setItem("lastDate", today);
  save();

}


function save() {
  localStorage.setItem("totalXP", totalXP);
  localStorage.setItem("monthXP", monthXP);
  localStorage.setItem("doneIds", JSON.stringify(doneIds));
  localStorage.setItem("stats", JSON.stringify(stats));
  
}

xpDisplay.textContent = totalXP;

const now = new Date();
const monthKey = now.getFullYear() + "-" + (now.getMonth() + 1);
const lastMonth = localStorage.getItem("lastMonth");

if (lastMonth !== monthKey) {
  monthXP = 0;
  localStorage.setItem("lastMonth", monthKey);
  save();
}

function getLevelInfo(totalXP) {
  let level = 1;
  let xpLeft = totalXP;

  while (level < MAX_LEVEL && xpLeft >= xpToNext(level)) {
    xpLeft = xpLeft - xpToNext(level);
    level = level + 1;
  }

  return {level: level, xpIntoLevel: xpLeft, xpNeeded: xpToNext(level)};

}

function renderStats() {
  const list = document.getElementById("stats-list");
  list.innerHTML = "";

  for (const id in habitNames) {
    const li = document.createElement("li");
    li.textContent = habitNames[id] + ": " + (stats.completions[id] || 0) + " times";
    list.appendChild(li);
  }
}


function updateDisplay() {
  const info = getLevelInfo(totalXP);
  const percent = (info.xpIntoLevel / info.xpNeeded) * 100;

  document.getElementById("title").textContent = getTitle(info.level);
  document.getElementById("level").textContent = info.level;
  document.getElementById("xp-fill").style.width = percent + "%";
  document.getElementById("month-xp").textContent = monthXP;

  if (info.level >= MAX_LEVEL) {
    document.getElementById("xp-progress").textContent = "MAX LEVEL";
    document.getElementById("xp-fill").style.width = "100%";
  } else {
    document.getElementById("xp-progress").textContent = info.xpIntoLevel + " / " + info.xpNeeded + " XP to next level";
  }

  renderStats();
}

updateDisplay();

cards.forEach(function (card) {
  const id = card.dataset.id;

  const days = card.dataset.days.split(",");
  const todayNumber = new Date().getDay();

  if (!days.includes(String(todayNumber))) {
    card.classList.add("rest");
  }

  if (doneIds.includes(id)) {
    card.classList.add("done");
  }

  card.addEventListener("click", function () {
    card.classList.toggle("done");
    const cardXP = Number(card.dataset.xp);

    if (card.classList.contains("done")) {
      totalXP = totalXP + cardXP;
      monthXP = monthXP + cardXP;
      stats.completions[id] = (stats.completions[id] || 0) + 1;
      doneIds.push(id);
    } else {
      totalXP = totalXP - cardXP;
      monthXP = monthXP - cardXP;
      stats.completions[id] = Math.max((stats.completions[id] || 0) -1, 0);
      doneIds = doneIds.filter(function (savedId) {
        return savedId !== id;
      });
    }

    xpDisplay.textContent = totalXP;
    updateDisplay();
    save();
  });
});

const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

function showTab(name) {
  tabPanels.forEach(function (panel) {
    panel.classList.toggle("active", panel.id === name);
  });
  tabButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.tab === name);
  });
}

tabButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showTab(button.dataset.tab);
  });
});

showTab("habits");

function getTitle(level) {
  for (const t of titles){
    if (level >= t.minLevel) {
      return t.name;
    }
  }
}