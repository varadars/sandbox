const uppercase = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
const lowercase = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const numeric = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];
const characters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

const results = document.querySelectorAll(".result-text");
const root = document.documentElement;
const themeToggles =
  document.querySelectorAll(".theme-toggle");

let theme = localStorage.getItem("theme") ?? "dark";
setTheme();

themeToggles.forEach((themeToggle) =>
  themeToggle.addEventListener("click", (event) => {
    console.log("boop");
    theme = theme === "dark" ? "light" : "dark";
    setTheme();
  }),
);

document
  .querySelectorAll(".result-text")
  .forEach((password) =>
    password.addEventListener("click", (event) => {
      navigator.clipboard.writeText(password.textContent);
      const popup = document.getElementById("popup");
      popup.textContent = "Copied!";
      setTimeout(() => (popup.textContent = ""), 500);
    }),
  );

document
  .getElementById("generate")
  .addEventListener("click", (event) => {
    results.forEach((result) => {
      result.textContent = getNewPassword();
    });
  });

document
  .getElementById("menu-button")
  .addEventListener("click", (event) => {
    document.getElementById("menu").style.zIndex = 2;
  });

document.querySelectorAll(".slider").forEach((slider) => {
  const output = slider.parentElement.querySelector("p");
  slider.oninput = function () {
    output.innerHTML = this.value;
    localStorage.setItem(slider.id, this.value);
  };
  console.log(slider.id);
});

document.getElementById("spec-vals").oninput = function () {
  localStorage.setItem("spec-vals", this.value);
};

document
  .getElementById("close-button")
  .addEventListener("click", (event) => {
    document.getElementById("menu").style.zIndex = -1;
  });

function getNewPassword() {
  let passLength =
    localStorage.getItem("pass-length") ?? 15;
  let password = "";
  const specialCharacters =
    localStorage.getItem("spec-vals") ?? "!().*^".split("");
  const passwordChars = [];

  const getRandom = (arr, amt) => {
    for (let i = 0; i < amt; i++) {
      passwordChars.push(
        arr[Math.floor(Math.random() * arr.length)],
      );
    }
  };
  console.log("helo".split(""));
  getRandom(
    specialCharacters,
    localStorage.getItem("spec-num") ?? 3,
  );
  getRandom(numeric, localStorage.getItem("num-num") ?? 3);
  getRandom(
    uppercase,
    localStorage.getItem("low-num") ?? 3,
  );
  getRandom(
    uppercase,
    localStorage.getItem("upp-num") ?? 3,
  );
  getRandom(
    characters.concat(specialCharacters),
    passLength - passwordChars.length,
  );

  for (let i = 0; i < passLength; i++) {
    let chosen =
      passwordChars[
        Math.floor(Math.random() * passwordChars.length)
      ];
    passwordChars.splice(passwordChars.indexOf(chosen), 1);
    password += chosen;
  }
  return password;
}

function setTheme() {
  root.style.setProperty("color-scheme", theme);
  themeToggles.forEach(
    (themeToggle) => (themeToggle.textContent = theme),
  );
  localStorage.setItem("theme", theme);
}
