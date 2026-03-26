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
const specialChars = [
  "~",
  "`",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "-",
  "+",
  "=",
  "{",
  "[",
  "}",
  "]",
  ",",
  "|",
  ":",
  ";",
  "<",
  ">",
  ".",
  "?",
  "/",
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
  "~",
  "`",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "-",
  "+",
  "=",
  "{",
  "[",
  "}",
  "]",
  ",",
  "|",
  ":",
  ";",
  "<",
  ">",
  ".",
  "?",
  "/",
];

const results = document.querySelectorAll(".result-text");
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

const lowNum = localStorage.getItem("lowNum") ?? 3;
const uppNum = localStorage.getItem("uppNum") ?? 3;
const specNum = localStorage.getItem("specNum") ?? 3;
const numNum = localStorage.getItem("numNum") ?? 3;
const passLength = localStorage.getItem("passLength") ?? 15;
let theme = localStorage.getItem("theme") ?? "dark";
setTheme();

themeToggle.addEventListener("click", (event) => {
  theme = theme === "dark" ? "light" : "dark";
  setTheme();
});

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

function getNewPassword() {
  let password = "";
  const passwordChars = [];

  const getRandom = (arr, amt) => {
    for (let i = 0; i < amt; i++) {
      passwordChars.push(
        arr[Math.floor(Math.random() * arr.length)],
      );
    }
  };

  getRandom(specialChars, specNum);
  getRandom(numeric, numNum);
  getRandom(uppercase, uppNum);
  getRandom(uppercase, lowNum);
  getRandom(characters, passLength - passwordChars.length);

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
  themeToggle.textContent = theme;
  localStorage.setItem("theme", theme);
}
