console.log("app.js loaded");
const cards = document.querySelectorAll(".card");
const xpDisplay = document.getElementById("xp");

let totalXP = Number(localStorage.getItem("totalXP")) || 0;
let doneIds = JSON.parse(localStorage.getItem("doneIds")) || [];

function save() {
  localStorage.setItem("totalXP", totalXP);
  localStorage.setItem("doneIds", JSON.stringify(doneIds));
}

xpDisplay.textContent = totalXP;

cards.forEach(function (card) {
  const id = card.dataset.id;

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
    save();
  });
});


