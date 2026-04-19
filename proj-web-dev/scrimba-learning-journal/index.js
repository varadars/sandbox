import { entries } from "./entries.js";

entries.sort(
  (a, b) =>
    new Date(b.date_created) - new Date(a.date_created),
);

document.addEventListener("click", (e) => {
  if (e.target.dataset.entry) {
    const params = new URLSearchParams();
    params.append("id", e.target.dataset.entry);

    const url = `post.html?${params.toString()}`;
    window.open(url, "_blank", "width=600,height=400");
  }
});

function renderHeroContent() {
  document.getElementById("hero-post").innerHTML = entries
    .filter((x) => x.hero === "hero")
    .map((entry) => {
      return `
        <div id="hero-entry" class="entry" data-entry="${entry.id}">
            <img src="${entry.title_img_src}" alt="${entry.title_img_alt}" id="hero-img" class="post-img" data-entry="${entry.id}">
            <div id="hero-caption" class="caption">
                <p class="date" data-entry="${entry.id}">${new Intl.DateTimeFormat("en-US").format(entry.date_created)}</p>
                <h1 class="title" data-entry="${entry.id}">${entry.title}</h1>
                <p class="description" data-entry="${entry.id}">${entry.description}</p>
            </div>
        </div>
        `;
    })
    .join("");
}

export function renderMainContent(
  mainPostElement,
  mainList,
  postCount,
) {
  mainPostElement.innerHTML = mainList
    .slice(0, postCount ?? mainList.length)
    .map((entry) => {
      return `
        <div class="entry" data-entry="${entry.id}">
            <img src="${entry.title_img_src}" alt="${entry.title_img_alt}" class="post-img" data-entry="${entry.id}">
            <div class="caption">
                <p class="date" data-entry="${entry.id}">${new Intl.DateTimeFormat("en-US").format(entry.date_created)}</p>
                <h1 class="title" data-entry="${entry.id}">${entry.title}</h1>
                <p class="description" data-entry="${entry.id}">${entry.description}</p>
            </div>
        </div>
        `;
    })
    .join("");
}

document.getElementById("hero-post") && renderHeroContent();
renderMainContent(
  document.getElementById("main-content"),
  entries.filter((x) => x.hero !== "hero"),
);
