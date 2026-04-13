const posts = [
  {
    name: "Vincent van Gogh",
    username: "vincey1853",
    location: "Zundert, Netherlands",
    avatar: "images/avatar-vangogh.jpg",
    post: "images/post-vangogh.jpg",
    comment: "just took a few mushrooms lol",
    likes: 21,
  },
  {
    name: "Gustave Courbet",
    username: "gus1819",
    location: "Ornans, France",
    avatar: "images/avatar-courbet.jpg",
    post: "images/post-courbet.jpg",
    comment: "i'm feelin a bit stressed tbh",
    likes: 4,
  },
  {
    name: "Joseph Ducreux",
    username: "jd1735",
    location: "Paris, France",
    avatar: "images/avatar-ducreux.jpg",
    post: "images/post-ducreux.jpg",
    comment:
      "gm friends! which coin are YOU stacking up today?? post below and WAGMI!",
    likes: 152,
  },
];

const feedElement = document.getElementById("feed");

posts.forEach((post, i) => {
  const postHtml = `
        <section class="post">
        <div class="post-header container">
            <img class="pfp" src="${post.avatar}" alt="Profile image.">
            <div class="header-text">
                <p class="author bold">${post.name}</p>
                <p class="post-location">${post.location}</p>
            </div>
         </div>
         <div class="post-media fw-cont">
            <img id="${"post-img-" + i}" class="post-img" src="${post.post}" alt="">

         </div>
         <div class="caption container">
            <div class="interactions">
                <button id="${"like-" + i}" class="like button" alt="Heart outline icon."></button>
                <button class="comment button" alt="Message bubble outline icon."></button>
                <button class="share button" alt="Airplane outline icon."></button>
            </div>
            <div class="caption-text">
                <p id="${"likes-" + i}" class="likes bold">${post.likes + " likes"}</p>
                <p class="caption-comment"><span class="bold">${post.username + " "}</span>${post.comment}</p>
            </div>
        </div>
         </section>`;
  feedElement.innerHTML += postHtml;

  document.querySelectorAll(".like").forEach((like) =>
    like.addEventListener("click", (event) => {
      likePost(like);
    }),
  );

  document.querySelectorAll(".post-img").forEach((image) =>
    image.addEventListener("dblclick", (event) => {
      likePost(image);
    }),
  );
});

function likePost(currElement) {
  const postNum = currElement.id.at(-1);
  const post = posts[postNum];
  const likeElement = document.getElementById(
    `${"like-" + postNum}`,
  );
  post.likes += likeElement.classList.contains("like")
    ? 1
    : -1;
  document.getElementById(
    `${"likes-" + postNum}`,
  ).textContent = `${post.likes + " likes"}`;
  likeElement.classList.toggle("like");
  likeElement.classList.toggle("liked");
}
