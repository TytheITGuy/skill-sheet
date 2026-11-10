console.log("app.js loaded");
const cards = document.querySelectorAll(".card");
const xpDisplay = document.getElementById("xp");

let totalXP = Number(localStorage.getItem("totalXP")) || 0;
let doneIds = JSON.parse(localStorage.getItem("doneIds")) || [];

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
  localStorage.setItem("doneIds", JSON.stringify(doneIds));
}

xpDisplay.textContent = totalXP;


function getLevelInfo(totalXP) {
  let level = 1;
  let xpLeft = totalXP;

  while (level < MAX_LEVEL && xpLeft >= xpToNext(level)) {
    xpLeft = xpLeft - xpToNext(level);
    level = level + 1;
  }

  return {level: level, xpIntoLevel: xpLeft, xpNeeded: xpToNext(level)};

}




function updateDisplay() {
  const info = getLevelInfo(totalXP);
  const percent = (info.xpIntoLevel / info.xpNeeded) * 100

  document.getElementById("title").textContent = getTitle(info.level);
  document.getElementById("level").textContent = info.level;
  document.getElementById("xp-fill").style.width = percent + "%";
  document.getElementById("xp-progress").textContent = info.xpIntoLevel + " / " + info.xpNeeded + "XP to next level";

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
      doneIds.push(id);
    } else {
      totalXP = totalXP - cardXP;
      doneIds = doneIds.filter(function (savedId) {
        return savedId !== id;
      });
    }

    xpDisplay.textContent = totalXP;
    updateDisplay();
    save();
  });
});


function getTitle(level) {
  for (const t of titles){
    if (level >= t.minLevel) {
      return t.name;
    }
  }
}