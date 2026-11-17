console.log("app.js loaded");
const xpDisplay = document.getElementById("xp");

let totalXP = Number(localStorage.getItem("totalXP")) || 0;
let doneIds = JSON.parse(localStorage.getItem("doneIds")) || [];
let monthXP = Number(localStorage.getItem("monthXP")) || 0;
let stats = JSON.parse(localStorage.getItem("stats")) || { completions:  {} };



const habits = [
  { id: "exercise", name: "Exercise", desc: "Walk or run 5 miles", xp: 50, days: [1, 2, 3, 4, 5], color: "#ff4d5a" },
  { id: "coding", name: "Coding", desc: "Study coding exercises", xp: 30, days: [0, 1, 2, 3, 4, 5, 6], color: "#5c86ff" },
  { id: "jobs", name: "Jobs", desc: "Apply for jobs", xp: 20, days: [1, 2, 3, 4, 5], color: "#ffb020" },
  { id: "reading", name: "Reading", desc: "Read one chapter of a book", xp: 10, days: [0, 1, 2, 3, 4, 5, 6], color: "#2ee07f" },
];


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
  let totalCompletions = 0;

  habits.forEach(function (habit) {
    const count = stats.completions[habit.id] || 0;
    totalCompletions = totalCompletions + count;

    const li = document.createElement("li");
    if (count === 1) {
      li.textContent = habit.name + ": " + count + " time";
    } else {
      li.textContent = habit.name + ": " + count + " times";
    }
    list.appendChild(li);
  });

  document.getElementById("total-completions").textContent = totalCompletions;
}


function updateDisplay() {
  const info = getLevelInfo(totalXP);
  const percent = (info.xpIntoLevel / info.xpNeeded) * 100;

  document.getElementById("title").textContent = getTitle(info.level);
  document.getElementById("level").textContent = info.level;
  document.getElementById("xp-fill").style.width = percent + "%";
  document.getElementById("month-xp").textContent = monthXP;
  
   const activeToday = habits.filter(function (habit) {
    return habit.days.includes(new Date().getDay());
  });
  const clearedToday = activeToday.filter(function (habit) {
    return doneIds.includes(habit.id);
  });
    const todayText = document.getElementById("today-progress");
  const perfect = clearedToday.length === activeToday.length;
  todayText.classList.toggle("perfect", perfect);

  if (perfect) {
    todayText.textContent = "Perfect day! All " + activeToday.length + " habits cleared";
  } else {
    todayText.textContent = clearedToday.length + " of " + activeToday.length + " habits cleared today";
  }


  if (info.level >= MAX_LEVEL) {
    document.getElementById("xp-progress").textContent = "MAX LEVEL";
    document.getElementById("xp-fill").style.width = "100%";
  } else {
    document.getElementById("xp-progress").textContent = info.xpIntoLevel + " / " + info.xpNeeded + " XP to next level";
  }

  renderStats();
}

updateDisplay();

const habitList = document.getElementById("habit-list");

function renderHabits() {
  habitList.innerHTML = "";
  const todayNumber = new Date().getDay();

  habits.forEach(function (habit) {
    const card = document.createElement("div");
    card.className = "card";
    card.style.setProperty("--c", habit.color);

    const title = document.createElement("h2");
    title.textContent = habit.name;
    const desc = document.createElement("p");
    desc.textContent = habit.desc;
    card.appendChild(title);
    card.appendChild(desc);
    const badge = document.createElement("span");
    badge.className = "xp-badge";
    badge.textContent = habit.xp + "XP";
    card.appendChild(badge);



    if (!habit.days.includes(todayNumber)) {
      card.classList.add("rest");
    }

    if (doneIds.includes(habit.id)) {
      card.classList.add("done");
    }

    card.addEventListener("click", function () {
      card.classList.toggle("done");

      if (card.classList.contains("done")) {
        totalXP = totalXP + habit.xp;
        monthXP = monthXP + habit.xp;
        stats.completions[habit.id] = (stats.completions[habit.id] || 0) + 1;
        doneIds.push(habit.id);
      } else {
        totalXP = totalXP - habit.xp;
        monthXP = monthXP - habit.xp;
        stats.completions[habit.id] = Math.max((stats.completions[habit.id] || 0) - 1, 0);
        doneIds = doneIds.filter(function (savedId) {
          return savedId !== habit.id;
        });
      }

      xpDisplay.textContent = totalXP;
      updateDisplay();
      save();
    });

    habitList.appendChild(card);
  });
}

renderHabits();

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