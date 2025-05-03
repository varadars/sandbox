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

  // Load member and habits
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

  // Update back link to point to the member's profile
  document.getElementById(
    "back-link"
  ).href = `member.html?id=${memberId}`;

  // Update member profile information
  displayMemberProfile(member);

  // Load and display habits
  loadHabits(memberId);

  // Update page title
  document.title = `${member.name}'s Habits - Habit Tracker`;
}

function displayMemberProfile(member) {
  const memberProfile = document.getElementById(
    "member-profile"
  );

  memberProfile.innerHTML = `
        <img src="${
          member.image || "/api/placeholder/60/60"
        }" alt="${member.name}" class="profile-image">
        <div class="profile-info">
            <h1>${member.name}</h1>
            <p><strong>${member.points} points</strong></p>
        </div>
    `;
}

function loadHabits(memberId) {
  // Load habits data from localStorage
  const habits = JSON.parse(
    localStorage.getItem("habitTrackerHabits") || "[]"
  );
  const memberHabits = habits.filter(
    (habit) => habit.memberId === memberId
  );

  // Separate habits into "need to complete" and "upcoming"
  const needToComplete = [];
  const upcoming = [];

  memberHabits.forEach((habit) => {
    const dueStatus = getHabitDueStatus(habit);

    if (dueStatus.isDue) {
      needToComplete.push({ ...habit, dueStatus });
    } else {
      upcoming.push({ ...habit, dueStatus });
    }
  });

  // Display habits in their respective containers
  displayHabits(needToComplete, "need-to-complete", true);
  displayHabits(upcoming, "upcoming-habits", false);
}

function getHabitDueStatus(habit) {
  const lastCompleted = habit.lastCompleted
    ? new Date(habit.lastCompleted)
    : null;
  const now = new Date();

  if (!lastCompleted) {
    return {
      isDue: true,
      message: "Never completed",
      nextDue: "Now",
    };
  }

  let nextDueDate = new Date(lastCompleted);

  switch (habit.frequency) {
    case "daily":
      nextDueDate.setDate(nextDueDate.getDate() + 1);
      break;
    case "weekly":
      nextDueDate.setDate(nextDueDate.getDate() + 7);
      break;
    case "monthly":
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      break;
  }

  const isDue = nextDueDate <= now;
  const dayDiff = Math.ceil(
    (nextDueDate - now) / (1000 * 60 * 60 * 24)
  );

  let message = "";

  if (isDue) {
    if (dayDiff < -1) {
      message = `Overdue by ${Math.abs(dayDiff)} days`;
    } else if (dayDiff === -1) {
      message = "Overdue by 1 day";
    } else {
      message = "Due today";
    }
  } else {
    if (dayDiff === 1) {
      message = "Due tomorrow";
    } else {
      message = `Due in ${dayDiff} days`;
    }
  }

  return {
    isDue,
    message,
    nextDue: nextDueDate.toLocaleDateString(),
  };
}

function displayHabits(habits, containerId, isDueSection) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (habits.length === 0) {
    container.innerHTML = `
            <div class="no-habits">
                ${
                  isDueSection
                    ? "No habits to complete right now. Great job!"
                    : "No upcoming habits."
                }
            </div>
        `;
    return;
  }

  habits.forEach((habit) => {
    const habitCard = document.createElement("div");
    habitCard.classList.add("habit-card");

    habitCard.innerHTML = `
            <div class="habit-header">
                <h3 class="habit-name">${habit.name}</h3>
                <span class="habit-points">${
                  habit.points
                } pts</span>
            </div>
            <div class="habit-info">
                <p>Frequency: ${
                  habit.frequency.charAt(0).toUpperCase() +
                  habit.frequency.slice(1)
                }</p>
                <p>Last completed: ${
                  habit.lastCompleted
                    ? new Date(
                        habit.lastCompleted
                      ).toLocaleDateString()
                    : "Never"
                }</p>
                <p class="habit-status ${
                  habit.dueStatus.isDue
                    ? "status-due"
                    : "status-upcoming"
                }">
                    ${habit.dueStatus.message}
                </p>
            </div>
            ${
              habit.dueStatus.isDue
                ? `<button class="complete-button" data-habit-id="${habit.id}">Complete Now</button>`
                : ""
            }
        `;

    container.appendChild(habitCard);
  });

  // Add event listeners to complete buttons
  if (isDueSection) {
    const completeButtons = container.querySelectorAll(
      ".complete-button"
    );
    completeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        completeHabit(button.dataset.habitId);
      });
    });
  }
}

function completeHabit(habitId) {
  // Get habits from localStorage
  const habits = JSON.parse(
    localStorage.getItem("habitTrackerHabits") || "[]"
  );
  const habitIndex = habits.findIndex(
    (h) => h.id === habitId
  );

  if (habitIndex === -1) return;

  const habit = habits[habitIndex];
  const now = new Date();

  // Update habit data
  habit.lastCompleted = now.toISOString();

  // Add to completion history
  if (!habit.completionHistory) {
    habit.completionHistory = [];
  }

  habit.completionHistory.push({
    date: now.toISOString(),
    points: habit.points,
  });

  // Update member points
  updateMemberPoints(habit.memberId, habit.points);

  // Save updated habits
  habits[habitIndex] = habit;
  localStorage.setItem(
    "habitTrackerHabits",
    JSON.stringify(habits)
  );

  // Reload habits display
  loadHabits(habit.memberId);
}

function updateMemberPoints(memberId, pointsToAdd) {
  const members = JSON.parse(
    localStorage.getItem("habitTrackerMembers") || "[]"
  );
  const memberIndex = members.findIndex(
    (m) => m.id === memberId
  );

  if (memberIndex === -1) return;

  // Add points to member
  members[memberIndex].points += pointsToAdd;

  // Save updated members
  localStorage.setItem(
    "habitTrackerMembers",
    JSON.stringify(members)
  );

  // Update profile display
  displayMemberProfile(members[memberIndex]);
}

function setupEventListeners(memberId) {
  const addHabitBtn =
    document.getElementById("add-habit-btn");
  const addHabitModal = document.getElementById(
    "add-habit-modal"
  );
  const closeBtn = document.querySelector(".modal .close");
  const addHabitForm = document.getElementById(
    "add-habit-form"
  );

  // Open modal
  addHabitBtn.addEventListener("click", () => {
    addHabitModal.style.display = "block";
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    addHabitModal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === addHabitModal) {
      addHabitModal.style.display = "none";
    }
  });

  // Handle form submission
  addHabitForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const habitName =
      document.getElementById("habit-name").value;
    const habitFrequency = document.getElementById(
      "habit-frequency"
    ).value;
    const habitPoints = parseInt(
      document.getElementById("habit-points").value,
      10
    );

    if (
      !habitName ||
      !habitFrequency ||
      isNaN(habitPoints)
    ) {
      alert("Please fill out all fields correctly.");
      return;
    }

    const habits = JSON.parse(
      localStorage.getItem("habitTrackerHabits") || "[]"
    );

    const newHabit = {
      id: Date.now().toString(),
      memberId: memberId,
      name: habitName,
      frequency: habitFrequency,
      points: habitPoints,
      lastCompleted: null,
      completionHistory: [],
    };

    habits.push(newHabit);
    localStorage.setItem(
      "habitTrackerHabits",
      JSON.stringify(habits)
    );

    // Close modal and reset form
    addHabitModal.style.display = "none";
    addHabitForm.reset();

    // Reload habits
    loadHabits(memberId);
  });
}
