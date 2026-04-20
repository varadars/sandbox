const apiKey = "ad5f5144";
const searchPage = document.getElementById(
  "search-results",
);
const watchlist = document.getElementById("watchlist");
const favorites = document.getElementById("favorites");
const searchWatchlist = document.getElementById(
  "search-watchlist",
);

let currentSearchResult = [];

document.addEventListener("click", async (e) => {
  if (e.target.dataset.page) {
    document
      .querySelectorAll(".tab")
      .forEach((tab) => tab.classList.remove("selected"));
    document
      .querySelectorAll(".page")
      .forEach((page) => page.classList.add("hidden"));
    e.target.classList.add("selected");
    document
      .getElementById(e.target.dataset.page)
      .classList.remove("hidden");
  } else if (e.target.dataset.movie) {
    const url = `https://www.imdb.com/title/${e.target.dataset.movie}/`;
    window.open(url, "_blank");
  } else if (e.target.dataset.add) {
    addToFavoritesOrWatchlist(
      e.target.dataset.add,
      "watchlist",
      watchlist,
    );
    e.target.disabled = true;
  } else if (e.target.dataset.fav) {
    addToFavoritesOrWatchlist(
      e.target.dataset.fav,
      "favorites",
      favorites,
    );
    e.target.disabled = true;
  } else if (e.target.dataset.remove) {
    removeFromFavoritesOrWatchlist(
      e.target.dataset.remove,
      "watchlist",
      watchlist,
    );
  } else if (e.target.dataset.unfav) {
    removeFromFavoritesOrWatchlist(
      e.target.dataset.unfav,
      "favorites",
      favorites,
    );
  }
});

document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    movieSearch(searchWatchlist.value);
  }
});

movieSearch(searchWatchlist.value);
addToFavoritesOrWatchlist(null, "watchlist", watchlist);
addToFavoritesOrWatchlist(null, "favorites", favorites);

async function movieSearch(keyword) {
  const res = await fetch(
    `http://www.omdbapi.com/?s=${keyword}&apikey=${apiKey}`,
  );
  const data = await res.json();
  const detailedData = await getDetailedMovies(data.Search);
  currentSearchResult = detailedData;
  renderMovies(searchPage, detailedData);
}

async function getMovie(imdbID) {
  const res = await fetch(
    `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`,
  );
  const movie = await res.json();
  return movie;
}

async function addToFavoritesOrWatchlist(
  movie,
  localStorageKey,
  element,
) {
  let list =
    JSON.parse(localStorage.getItem(localStorageKey)) ?? [];

  if (movie) {
    const movieToAdd = await getMovie(movie);

    if (!list.find((x) => x.imdbID === movieToAdd.imdbID)) {
      list.push(movieToAdd);
    }
  }

  localStorage.setItem(
    localStorageKey,
    JSON.stringify(list),
  );
  renderMovies(element, list);
}

async function removeFromFavoritesOrWatchlist(
  movieId,
  localStorageKey,
  element,
) {
  let list =
    JSON.parse(localStorage.getItem(localStorageKey)) ?? [];

  const filteredArray = list.filter(
    (x) => x.imdbID !== movieId,
  );

  localStorage.setItem(
    localStorageKey,
    JSON.stringify(filteredArray),
  );

  renderMovies(element, filteredArray);
  renderMovies(searchPage, currentSearchResult);
}

async function getDetailedMovies(searchResult) {
  const updatedArray = [];
  for (let movie of searchResult) {
    const movieWithMoreData = await getMovie(movie.imdbID);

    let imageWorked = true;
    try {
      const tryImage = await fetch(
        movieWithMoreData.Poster,
      );
      if (!tryImage.ok)
        throw new Error(`Status: ${tryImage.status}`);
    } catch (e) {
      imageWorked = false;
    }

    if (
      movieWithMoreData.Ratings &&
      movieWithMoreData.Runtime != "N/A" &&
      imageWorked
    ) {
      updatedArray.push(movieWithMoreData);
    }
  }
  return updatedArray;
}

function renderMovies(element, searchResult) {
  element.innerHTML = searchResult
    .map((movie) => {
      //figure out which buttons to return
      let buttonEl = "";
      if (element === watchlist) {
        buttonEl = `<button class="list-btn" data-remove="${movie.imdbID}">remove from watchlist</button>`;
      } else if (element === favorites) {
        buttonEl = `<button class="list-btn" data-unfav="${movie.imdbID}">remove from favorites</button>`;
      } else {
        let addWatchlistDisabled = "";
        let addFavoritesDisabled = "";
        let watchlistFromStorage = JSON.parse(
          localStorage.getItem("watchlist"),
        );
        let favoritesFromStorage = JSON.parse(
          localStorage.getItem("favorites"),
        );

        if (
          watchlistFromStorage &&
          watchlistFromStorage.find(
            (x) => x.imdbID === movie.imdbID,
          )
        ) {
          addWatchlistDisabled = "disabled";
        }

        if (
          favoritesFromStorage &&
          favoritesFromStorage.find(
            (x) => x.imdbID === movie.imdbID,
          )
        ) {
          addFavoritesDisabled = "disabled";
        }

        buttonEl = `<button class="add-to-watchlist" data-add="${movie.imdbID}" ${addWatchlistDisabled}>add to watchlist</button>
        <button class="add-to-favorites" data-fav="${movie.imdbID}" ${addFavoritesDisabled}>add to favorites</button>`;
      }

      return `<div class="movie">
                        <img src="${movie.Poster ?? ""}" data-movie="${movie.imdbID}" alt="" class="poster">
                        <div class="content">
                            <div class="heading">
                                <h3 class="title">${movie.Title}</h3>
                                <i class="star"></i>
                                <p class="rating">${movie.Ratings[0]?.Value ?? ""}</p>
                            </div>
                            <div class="subheading">
                                <p class="duration">${movie.Runtime}</p>
                                <p class="genre">${movie.Genre}</p>
                                ${buttonEl}
                            </div>
                            <div class="description">${movie.Plot}</div>
                        </div>
                    </div>`;
    })
    .join("");
}
