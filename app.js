// Theme management
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const body = document.body;

// Initialize theme from localStorage or system preference
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const theme = savedTheme || (systemPrefersDark ? "dark" : "light");
  setTheme(theme);
}

// Set theme and update UI
function setTheme(theme) {
  body.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "light" : "dark"} mode`
  );
  localStorage.setItem("theme", theme);
}

// Toggle theme
function toggleTheme() {
  const currentTheme = body.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  setTheme(newTheme);
}

// Date generation functionality
const dateInput = document.getElementById("start-date");
const targetTable = document.querySelector(".target-table");
const tableInfo = document.getElementById("table-info");
const weekDays = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

const renderTable = (startDate) => {
  if (!startDate) {
    targetTable.innerHTML = `
      <caption class="table-caption">
        Please select a start date to generate the bazar schedule
      </caption>
      <thead>
        <tr>
          <th scope="col">তারিখ (Date)</th>
          <th scope="col">বার (Day)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="2" style="padding: 2rem; color: var(--text-muted); font-style: italic;">
            No dates to display
          </td>
        </tr>
      </tbody>
    `;
    updateTableInfo(0);
    return;
  }

  const [y, m, d] = startDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const startDateObject = new Date(date);
  const currentMonth = startDateObject.getMonth();
  const monthName = startDateObject.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  let dateCount = 0;
  let tableRows = "";

  // Create table header
  targetTable.innerHTML = `
    <caption class="table-caption">
      Bazar schedule for ${monthName} starting from ${startDateObject.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )}
    </caption>
    <thead>
      <tr>
        <th scope="col">তারিখ (Date)</th>
        <th scope="col">বার (Day)</th>
      </tr>
    </thead>
    <tbody id="table-body">
    </tbody>
  `;

  const tableBody = document.getElementById("table-body");

  // Generate dates every 3 days within the same month
  while (startDateObject.getMonth() === currentMonth) {
    const bengaliDate = startDateObject.toLocaleDateString("bn-BD");
    const dayName = weekDays[startDateObject.getDay()];
    const englishDate = startDateObject.toLocaleDateString("en-US");

    tableRows += `
      <tr>
        <td>
          <div class="date-cell">
            <strong>${bengaliDate}</strong>
            
          </div>
        </td>
        <td>
          <span class="day-cell">${dayName}</span>
        </td>
      </tr>
    `;

    dateCount++;
    startDateObject.setDate(startDateObject.getDate() + 3);
  }

  tableBody.innerHTML = tableRows;
  updateTableInfo(dateCount, monthName);
};

const updateTableInfo = (count, month = "") => {
  if (count === 0) {
    tableInfo.textContent = "Select a start date to view the bazar schedule.";
  } else {
    tableInfo.textContent = `Generated ${count} bazar date${
      count !== 1 ? "s" : ""
    } for ${month}. Each date is 3 days apart.`;
  }
};

const dateChangeHandler = (e) => {
  const selectedDate = e.target.value;
  if (selectedDate) {
    renderTable(selectedDate);
    // Announce to screen readers
    const announcement = `Bazar schedule updated for ${new Date(
      selectedDate
    ).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;
    announceToScreenReader(announcement);
  } else {
    renderTable(null);
  }
};

// Screen reader announcements
function announceToScreenReader(message) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "visually-hidden";
  announcement.textContent = message;

  document.body.appendChild(announcement);
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

function setInitialStartDate() {
  const today = new Date();
  let startYear = today.getFullYear();
  let startMonth = today.getMonth();

  // If we're past the 20th of the month, start from next month
  if (today.getDate() >= 20) {
    startMonth += 1;
    if (startMonth > 11) {
      startMonth = 0;
      startYear += 1;
    }
  }

  const initialStartDate = new Date(startYear, startMonth, 2);
  const formattedStartDate = initialStartDate.toISOString().slice(0, 10);

  dateInput.value = formattedStartDate;
  renderTable(formattedStartDate);

  // Set min date to today to prevent past dates
  const todayFormatted = today.toISOString().slice(0, 10);
  dateInput.setAttribute("min", todayFormatted);
}

// Keyboard navigation enhancement
function handleKeyboardNavigation(e) {
  if (e.key === "Enter" || e.key === " ") {
    if (e.target === themeToggle) {
      e.preventDefault();
      toggleTheme();
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  setInitialStartDate();

  // Event listeners
  themeToggle.addEventListener("click", toggleTheme);
  themeToggle.addEventListener("keydown", handleKeyboardNavigation);
  dateInput.addEventListener("change", dateChangeHandler);

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });

  // Enhanced accessibility: announce initial state
  setTimeout(() => {
    const initialAnnouncement =
      "Bazar Date Generator loaded. Use the date input to select your start date.";
    announceToScreenReader(initialAnnouncement);
  }, 1000);
});

// Service Worker registration for offline functionality (optional enhancement)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // This would be for a future PWA enhancement
    console.log("App ready for potential PWA features");
  });
}
