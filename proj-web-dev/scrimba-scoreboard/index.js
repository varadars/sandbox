const buttons = document.querySelectorAll(".button");
const homeScore = document.getElementById("home-score");
const guestScore = document.getElementById("guest-score");
const store = localStorage;

//load from localStorage

homeScore.textContent =
  localStorage.getItem("homeScore") ?? 0;
guestScore.textContent =
  localStorage.getItem("guestScore") ?? 0;

buttons.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    console.log();
    switch (btn.parentElement.id) {
      case "home-buttons":
        homeScore.textContent =
          Number(homeScore.textContent) +
          Number(btn.textContent);
        break;
      case "guest-buttons":
        guestScore.textContent =
          Number(guestScore.textContent) +
          Number(btn.textContent);
        break;
    }

    setLocalStorage();
    setWinner();
  });
});

document
  .getElementById("new-game")
  .addEventListener("click", (event) => {
    homeScore.textContent = 0;
    guestScore.textContent = 0;
    setWinner();
    setLocalStorage();
  });

function setWinner() {
  const homeScoreVal = Number(homeScore.textContent);
  const guestScoreVal = Number(guestScore.textContent);
  let winner =
    homeScoreVal >= guestScoreVal ? homeScore : guestScore;
  let loser =
    homeScoreVal >= guestScoreVal ? guestScore : homeScore;

  if (homeScoreVal === guestScoreVal) {
    winner.parentElement.classList.remove("winning");
  } else {
    winner.parentElement.classList.add("winning");
  }

  loser.parentElement.classList.remove("winning");
  console.log(winner.parentElement.classList);
  console.log(loser.parentElement.classList);
}

function setLocalStorage() {
  localStorage.setItem(
    "homeScore",
    Number(homeScore.textContent),
  );
  localStorage.setItem(
    "guestScore",
    Number(guestScore.textContent),
  );
}
