import { projects } from "./projects.js";

projects.sort(
  (a, b) =>
    new Date(b.date_created) - new Date(a.date_created),
);

document.getElementById("projects").innerHTML += projects
  .map((project) => {
    return `<li class="link">
                <div class="title-box">
                    <a href=${project.src}>${project.name} - ${new Intl.DateTimeFormat("en-US").format(project.date_created)}</a>
                </div>
                <div class="box no-border">
                    <iframe class="preview"  src="${project.src}" width = "500px" height = "500px">
                    </iframe>
                    <div class="caption">
                        <ul class="tags">
                            ${project.tags
                              .map((tag) => {
                                return `<li class="tag">${tag}</li>`;
                              })
                              .join("")}
                        </ul>
                        <p class="description">${project.description}</p>
                    </div>
                </div> 
            </li>`;
  })
  .join("");
