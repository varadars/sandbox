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

const results = document.querySelectorAll(".result-text");
const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", (event) => {
  const theme =
    root.style.getPropertyValue("color-scheme") == "dark"
      ? "light"
      : "dark";

  root.style.setProperty("color-scheme", theme);

  themeToggle.textContent = theme;
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
  const passwordLength = 15;
  const passwordChars = [];

  const getRandom = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];

  for (let i = 0; i < 2; i++) {
    passwordChars.push(
      getRandom(specialChars),
      getRandom(numeric),
      getRandom(uppercase),
    );
  }

  while (passwordChars.length < passwordLength) {
    passwordChars.push(getRandom(lowercase));
  }

  for (let i = 0; i < passwordLength; i++) {
    let chosen = getRandom(passwordChars);
    passwordChars.splice(passwordChars.indexOf(chosen), 1);
    password += chosen;
  }

  return password;
}
