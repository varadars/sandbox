import { renderMainContent } from "./index.js";
import { entries } from "./entries.js";

const params = new URLSearchParams(window.location.search);
const pageId = params.get("id");

function renderPostContent() {
  document.getElementById("current-post").innerHTML =
    entries
      .filter((x) => x.id == pageId)
      .map((entry) => {
        return `
            <p class="date" >${new Intl.DateTimeFormat("en-US").format(entry.date_created)}</p>
            <h1 class="title" >${entry.title}</h1>
            <p class="description" >${entry.description}</p>
            <img class="current-post-img" src="${entry.title_img_src}" alt="${entry.title_img_alt}">
            <div class="post-content">${marked.parse(entry.post)}</div>`;
      });
}
renderPostContent();
renderMainContent(
  document.getElementById("main-content"),
  entries.filter((x) => x.id != pageId),
  3,
);
