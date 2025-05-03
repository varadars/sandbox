document.addEventListener("DOMContentLoaded", function () {
  // Get member ID from URL parameters
  const urlParams = new URLSearchParams(
    window.location.search
  );
  const memberId = urlParams.get("id");

  if (!memberId) {
    window.location.href = "index.html";
    return;
  }

  // Load member and display content
  loadMember(memberId);

  // Setup event listeners
  setupEventListeners(memberId);
});

function loadMember(memberId) {
  // Load member data from localStorage
  const members = JSON.parse(
    localStorage.getItem("habitTrackerMembers") || "[]"
  );
  const member = members.find((m) => m.id === memberId);

  if (!member) {
    alert("Member not found!");
    window.location.href = "index.html";
    return;
  }

  // Update back link to point to the member's group
  document.getElementById(
    "back-link"
  ).href = `group.html?id=${member.groupId}`;

  // Update member profile information
  displayMemberProfile(member);

  // Load and display habit history
  loadHabitHistory(memberId);

  // Update page title
  document.title = `${member.name} - Habit Tracker`;
}

function displayMemberProfile(member) {
  const memberProfile = document.getElementById(
    "member-profile"
  );
  const loginButton =
    document.getElementById("login-button");

  memberProfile.innerHTML = `
        <img src="${
          member.image || "/api/placeholder/80/80"
        }" alt="${member.name}" class="profile-image">
        <div class="profile-info">
            <h1>${member.name}</h1>
            <p>${member.profession}</p>
            <p><strong>${member.points} points</strong></p>
        </div>
    `;

  loginButton.innerHTML = `
        <img src="${
          member.image || "/api/placeholder/50/50"
        }" alt="Login" title="Login to track habits">
    `;
}

function loadHabitHistory(memberId) {
  // Load habits data from localStorage
  const habits = JSON.parse(
    localStorage.getItem("habitTrackerHabits") || "[]"
  );
  const memberHabits = habits.filter(
    (habit) => habit.memberId === memberId
  );

  // Collect all completion history entries for this member
  let allHistory = [];
  memberHabits.forEach((habit) => {
    if (
      habit.completionHistory &&
      habit.completionHistory.length > 0
    ) {
      habit.completionHistory.forEach((entry) => {
        allHistory.push({
          habitName: habit.name,
          date: entry.date,
          points: entry.points,
        });
      });
    }
  });

  // Sort by date (newest first)
  allHistory.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Display paginated history
  displayPaginatedHistory(allHistory);
}

// Global variables for pagination
let currentPage = 1;
const entriesPerPage = 10;
let totalPages = 1;
let historyData = [];

function displayPaginatedHistory(history) {
  historyData = history;
  totalPages = Math.ceil(history.length / entriesPerPage);

  // Update pagination UI
  document.getElementById(
    "page-info"
  ).textContent = `Page ${currentPage} of ${
    totalPages || 1
  }`;
  document.getElementById("prev-page").disabled =
    currentPage === 1;
  document.getElementById("next-page").disabled =
    currentPage === totalPages || totalPages === 0;

  // Display current page data
  const historyBody =
    document.getElementById("history-body");
  historyBody.innerHTML = "";

  if (history.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="3" style="text-align: center;">No habit history available.</td>`;
    historyBody.appendChild(row);
    return;
  }

  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(
    startIndex + entriesPerPage,
    history.length
  );

  for (let i = startIndex; i < endIndex; i++) {
    const entry = history[i];
    const row = document.createElement("tr");

    const date = new Date(entry.date);
    const formattedDate =
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    row.innerHTML = `
            <td>${entry.habitName}</td>
            <td>${formattedDate}</td>
            <td>${entry.points} pts</td>
        `;

    historyBody.appendChild(row);
  }
}

function setupEventListeners(memberId) {
  const loginButton = document.querySelector(
    ".login-button img"
  );
  const loginModal = document.getElementById("login-modal");
  const closeBtn = document.querySelector(".modal .close");
  const loginForm = document.getElementById("login-form");
  const prevPageBtn = document.getElementById("prev-page");
  const nextPageBtn = document.getElementById("next-page");

  // Login button
  loginButton.addEventListener("click", () => {
    loginModal.style.display = "block";
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    loginModal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.style.display = "none";
    }
  });

  // Handle login form submission
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const password =
      document.getElementById("password").value;
    const members = JSON.parse(
      localStorage.getItem("habitTrackerMembers") || "[]"
    );
    const member = members.find((m) => m.id === memberId);
    console.log(member.password);

    if (member && member.password === password) {
      // Redirect to user's habit tracking page
      window.location.href = `track.html?id=${memberId}`;
    } else {
      // Display error message
      document.getElementById("login-error").textContent =
        "Incorrect password";
    }
  });

  // Pagination controls
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayPaginatedHistory(historyData);
    }
  });

  nextPageBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayPaginatedHistory(historyData);
    }
  });
}
