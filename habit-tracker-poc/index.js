// Initialize local storage with sample data if empty
document.addEventListener("DOMContentLoaded", function () {
  if (!localStorage.getItem("habitTrackerGroups")) {
    // Create some sample groups
    const sampleGroups = [
      {
        id: "group1",
        name: "Web Development Team",
        image:
          "https://cdn6.f-cdn.com/files/download/82615852/web-dev-ty.jpg",
        membersCount: 18,
      },
      {
        id: "group2",
        name: "Fitness Challenge",
        image: "/api/placeholder/250/150",
        membersCount: 15,
      },
      {
        id: "group3",
        name: "Reading Club",
        image: "/api/placeholder/250/150",
        membersCount: 16,
      },
    ];

    localStorage.setItem(
      "habitTrackerGroups",
      JSON.stringify(sampleGroups)
    );

    // Initialize sample members and habits for each group
    initializeSampleData();
  }

  // Load and display groups
  displayGroups();

  // Set up event listeners
  setupEventListeners();
});

function initializeSampleData() {
  // Sample members for Group 1
  const group1Members = [
    {
      id: "member1",
      groupId: "group1",
      name: "John Smith",
      profession: "Frontend Developer",
      image: "/api/placeholder/100/100",
      points: 120,
      password: "1234", // Simple password for demo purposes
    },
    {
      id: "member2",
      groupId: "group1",
      name: "Sarah Johnson",
      profession: "UX Designer",
      image: "/api/placeholder/100/100",
      points: 95,
      password: "1234",
    },
    {
      id: "member3",
      groupId: "group1",
      name: "Michael Lee",
      profession: "Backend Developer",
      image: "/api/placeholder/100/100",
      points: 150,
      password: "1234",
    },
  ];

  localStorage.setItem(
    "habitTrackerMembers",
    JSON.stringify(group1Members)
  );

  // Sample habits for members
  const sampleHabits = [
    {
      id: "habit1",
      memberId: "member1",
      name: "Code Review",
      points: 10,
      frequency: "daily", // daily, weekly, monthly
      lastCompleted: new Date(
        Date.now() - 86400000
      ).toISOString(), // yesterday
      completionHistory: [
        {
          date: new Date(
            Date.now() - 86400000
          ).toISOString(),
          points: 10,
        },
        {
          date: new Date(
            Date.now() - 172800000
          ).toISOString(),
          points: 10,
        },
        {
          date: new Date(
            Date.now() - 259200000
          ).toISOString(),
          points: 10,
        },
      ],
    },
    {
      id: "habit2",
      memberId: "member1",
      name: "Learn New Technology",
      points: 20,
      frequency: "weekly",
      lastCompleted: new Date(
        Date.now() - 345600000
      ).toISOString(), // 4 days ago
      completionHistory: [
        {
          date: new Date(
            Date.now() - 345600000
          ).toISOString(),
          points: 20,
        },
        {
          date: new Date(
            Date.now() - 950400000
          ).toISOString(),
          points: 20,
        },
      ],
    },
    {
      id: "habit3",
      memberId: "member2",
      name: "Design Review",
      points: 15,
      frequency: "daily",
      lastCompleted: new Date(
        Date.now() - 172800000
      ).toISOString(), // 2 days ago
      completionHistory: [
        {
          date: new Date(
            Date.now() - 172800000
          ).toISOString(),
          points: 15,
        },
        {
          date: new Date(
            Date.now() - 259200000
          ).toISOString(),
          points: 15,
        },
      ],
    },
  ];

  localStorage.setItem(
    "habitTrackerHabits",
    JSON.stringify(sampleHabits)
  );
}

function displayGroups() {
  const groupsContainer = document.getElementById(
    "groups-container"
  );
  const groups = JSON.parse(
    localStorage.getItem("habitTrackerGroups") || "[]"
  );

  groupsContainer.innerHTML = "";

  groups.forEach((group) => {
    const groupCard = document.createElement("div");
    groupCard.classList.add("group-card");
    groupCard.dataset.id = group.id;

    groupCard.innerHTML = `
            <div class="group-image">
                ${
                  group.image
                    ? `<img src="${group.image}" alt="${group.name}">`
                    : `<div>${group.name[0]}</div>`
                }
            </div>
            <div class="group-info">
                <h2 class="group-name">${group.name}</h2>
                <p class="group-members">${
                  group.membersCount
                } members</p>
            </div>
        `;

    groupCard.addEventListener("click", () => {
      window.location.href = `group.html?id=${group.id}`;
    });

    groupsContainer.appendChild(groupCard);
  });
}

function setupEventListeners() {
  const addGroupBtn =
    document.getElementById("add-group-btn");
  const addGroupModal = document.getElementById(
    "add-group-modal"
  );
  const closeBtn = document.querySelector(".close");
  const addGroupForm = document.getElementById(
    "add-group-form"
  );

  // Open modal
  addGroupBtn.addEventListener("click", () => {
    addGroupModal.style.display = "block";
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    addGroupModal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === addGroupModal) {
      addGroupModal.style.display = "none";
    }
  });

  // Handle form submission
  addGroupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const groupName =
      document.getElementById("group-name").value;
    const groupImage =
      document.getElementById("group-image").value ||
      `/api/placeholder/250/150`;

    const groups = JSON.parse(
      localStorage.getItem("habitTrackerGroups") || "[]"
    );
    const newGroup = {
      id: "group" + (groups.length + 1),
      name: groupName,
      image: groupImage,
      membersCount: 0,
    };

    groups.push(newGroup);
    localStorage.setItem(
      "habitTrackerGroups",
      JSON.stringify(groups)
    );

    // Close modal and refresh groups
    addGroupModal.style.display = "none";
    addGroupForm.reset();
    displayGroups();
  });
}
