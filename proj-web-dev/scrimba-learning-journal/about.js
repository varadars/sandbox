import { renderMainContent } from "./index.js";
import { entries } from "./entries.js";

renderMainContent(
  document.getElementById("main-content"),
  entries,
  3,
);
