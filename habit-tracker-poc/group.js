document.addEventListener("DOMContentLoaded", function () {
  // Get group ID from URL parameters
  const urlParams = new URLSearchParams(
    window.location.search
  );
  const groupId = urlParams.get("id");

  if (!groupId) {
    window.location.href = "index.html";
    return;
  }

  // Load group and display content
  loadGroup(groupId);

  // Setup event listeners
  setupEventListeners(groupId);
});

function loadGroup(groupId) {
  // Load group data from localStorage
  const groups = JSON.parse(
    localStorage.getItem("habitTrackerGroups") || "[]"
  );
  const group = groups.find((g) => g.id === groupId);

  if (!group) {
    alert("Group not found!");
    window.location.href = "index.html";
    return;
  }

  // Update group name in the header
  document.getElementById("group-name").textContent =
    group.name;

  // Load and display members
  loadMembers(groupId);

  // Update page title
  document.title = `${group.name} - Habit Tracker`;
}

function loadMembers(groupId) {
  const members = JSON.parse(
    localStorage.getItem("habitTrackerMembers") || "[]"
  ).filter((member) => member.groupId === groupId);

  // Sort members by points (descending) for leaderboard
  const sortedMembers = [...members].sort(
    (a, b) => b.points - a.points
  );

  // Display leaderboard
  displayLeaderboard(sortedMembers);

  // Display member cards
  displayMemberCards(members);
}

function displayLeaderboard(members) {
  const leaderboardBody = document.getElementById(
    "leaderboard-body"
  );
  leaderboardBody.innerHTML = "";

  members.forEach((member, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${member.name}</td>
            <td>${member.points} pts</td>
        `;

    leaderboardBody.appendChild(row);
  });
}

function displayMemberCards(members) {
  const membersContainer = document.getElementById(
    "members-container"
  );
  membersContainer.innerHTML = "";

  members.forEach((member) => {
    const memberCard = document.createElement("div");
    memberCard.classList.add("member-card");
    memberCard.dataset.id = member.id;

    memberCard.innerHTML = `
            <div class="member-image-container">
                <img class="member-image" src="${
                  member.image || "/api/placeholder/250/180"
                }" alt="${member.name}">
            </div>
            <div class="member-info">
                <h3 class="member-name">${member.name}</h3>
                <p class="member-profession">${
                  member.profession
                }</p>
                <p class="member-points">${
                  member.points
                } points</p>
            </div>
        `;

    memberCard.addEventListener("click", () => {
      window.location.href = `member.html?id=${member.id}`;
    });

    membersContainer.appendChild(memberCard);
  });
}

function setupEventListeners(groupId) {
  const addMemberBtn = document.getElementById(
    "add-member-btn"
  );
  const addMemberModal = document.getElementById(
    "add-member-modal"
  );
  const closeBtn = document.querySelector(".modal .close");
  const addMemberForm = document.getElementById(
    "add-member-form"
  );

  // Open modal
  addMemberBtn.addEventListener("click", () => {
    addMemberModal.style.display = "block";
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    addMemberModal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === addMemberModal) {
      addMemberModal.style.display = "none";
    }
  });

  // Handle form submission
  addMemberForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const memberName =
      document.getElementById("member-name").value;
    const memberProfession = document.getElementById(
      "member-profession"
    ).value;
    const memberImage =
      document.getElementById("member-image").value ||
      "/api/placeholder/250/180";
    const memberPassword = document.getElementById(
      "member-password"
    ).value;

    // Get existing members
    const members = JSON.parse(
      localStorage.getItem("habitTrackerMembers") || "[]"
    );

    // Create new member
    const newMember = {
      id: "member" + (members.length + 1),
      groupId: groupId,
      name: memberName,
      profession: memberProfession,
      image: memberImage,
      points: 0,
      password: memberPassword,
    };

    // Add new member to storage
    members.push(newMember);
    localStorage.setItem(
      "habitTrackerMembers",
      JSON.stringify(members)
    );

    // Update group member count
    updateGroupMemberCount(groupId);

    // Close modal and refresh members display
    addMemberModal.style.display = "none";
    addMemberForm.reset();
    loadMembers(groupId);
  });
}

function updateGroupMemberCount(groupId) {
  const groups = JSON.parse(
    localStorage.getItem("habitTrackerGroups") || "[]"
  );
  const members = JSON.parse(
    localStorage.getItem("habitTrackerMembers") || "[]"
  );

  // Count members in this group
  const memberCount = members.filter(
    (member) => member.groupId === groupId
  ).length;

  // Update group data
  const updatedGroups = groups.map((group) => {
    if (group.id === groupId) {
      return {
        ...group,
        membersCount: memberCount,
      };
    }
    return group;
  });

  localStorage.setItem(
    "habitTrackerGroups",
    JSON.stringify(updatedGroups)
  );
}
