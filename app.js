const cards = document.querySelectorAll(".card");
const xpDisplay = document.getElementById("xp");
let totalXP = 0;

cards.forEach(function (card) {
    card.addEventListener("click", function () {
        console.log(card.classList);
        card.classList.toggle("done");

        const cardXP = Number(card.dataset.xp);

        if (card.classList.contains("done")){
            totalXP = totalXP + cardXP;
        } else {
            totalXP = totalXP - cardXP;
        }

        xpDisplay.textContent = totalXP;
    });
});



