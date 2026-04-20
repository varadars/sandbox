const currColor = document.getElementById("color-picker");
const currMode = document.getElementById("mode-picker");

document
  .querySelector(".get-color-scheme")
  .addEventListener("click", (event) => {
    getColorScheme(currColor.value, currMode.value);
  });

document
  .querySelector("#color-picker")
  .addEventListener("change", (event) => {
    getColorScheme(currColor.value, currMode.value);
  });

document.addEventListener("keypress", (event) => {
  if (event.code === "Space" || event.key === " ") {
    const options = currMode.options;
    const randomIndex = Math.floor(
      Math.random() * options.length,
    );
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");

    currColor.value = randomColor;
    currMode.value = options[randomIndex].value;

    getColorScheme(randomColor, options[randomIndex].value);
  }
});

document.addEventListener("click", (e) => {
  if (e.target.dataset.hex) {
    const copiedMessage = document.getElementById("copied");
    navigator.clipboard.writeText(e.target.dataset.hex);
    copiedMessage.style.display = "block";
    setTimeout(() => {
      copiedMessage.style.display = "none";
    }, 500);
  }
});

getColorScheme(currColor.value, currMode.value);

function getColorScheme(hexCode, mode = "analogic") {
  hexCode = hexCode.substring(1);
  fetch(
    `https://www.thecolorapi.com/scheme?hex=${hexCode}&mode=${mode}`,
  )
    .then((res) => res.json())
    .then((data) => {
      renderColors(data.colors);
    });
}

function renderColors(colorArray) {
  const colorsDiv = document.getElementById("colors");
  colorsDiv.innerHTML = "";
  colorArray.forEach((color) => {
    const colorDiv = document.createElement("div");
    colorDiv.classList.add("color");
    colorDiv.style.backgroundColor = color.hex.value;
    colorDiv.style.color = color.contrast.value;
    colorDiv.dataset.hex = color.hex.value;

    colorDiv.innerHTML = `
            <h2 class="hex-code" data-hex=${color.hex.value}>${color.hex.value}</h2>
            <p class="name">${color.name.value}</p>
            `;

    colorsDiv.appendChild(colorDiv);
  });
}
