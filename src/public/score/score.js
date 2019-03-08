function Scoreboard() {
    application.innerHTML = "";

    const scoreContainer = document.createElement("div");
    scoreContainer.className = "score-items";

    const scoreHeader = document.createElement("h1");
    scoreHeader.textContent = "Scoresheet";
    const container2 = document.createElement("div");

    const scoreTable = document.createElement("table");
    scoreTable.id = "scoreboard";

    const buttomContainer = document.createElement("div");
    buttomContainer.className = "score-nav__bottom";

    const prevScore = document.createElement("a");
    prevScore.textContent = "Prev 10";
    prevScore.href = "#";

    const nextScore = document.createElement("a");
    nextScore.textContent = "Next 10";
    nextScore.href = "#";

    buttomContainer.appendChild(prevScore);
    buttomContainer.appendChild(nextScore);

    const back_button = document.createElement("button");
    back_button.className = "score-button__backward";
    back_button.textContent = "Back";

    scoreContainer.appendChild(scoreHeader);
    container2.appendChild(scoreTable);
    container2.appendChild(buttomContainer);
    scoreContainer.appendChild(container2);
    scoreContainer.appendChild(back_button);
    application.appendChild(scoreContainer);
    getNext(0);
}