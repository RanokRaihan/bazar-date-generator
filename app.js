const dateInput = document.getElementById("start-date");
const targetTable = document.querySelector(".target-table");
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
  const [y, m, d] = startDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const startDateObject = new Date(date);
  const currentMonth = startDateObject.getMonth();

  targetTable.innerHTML = `
    <tr>
      <th>তারিখ</th>
      <th>বার</th>
    </tr>
  `;

  while (startDateObject.getMonth() === currentMonth) {
    targetTable.innerHTML += `
      <tr>
        <td>${startDateObject.toLocaleDateString("bn-BD")}</td>
        <td>${weekDays[startDateObject.getDay()]}</td>
      </tr>
    `;
    startDateObject.setDate(startDateObject.getDate() + 3);
  }
};

const dateChangeHandler = (e) => {
  renderTable(e.target.value);
};

function setInitialStartDate() {
  const today = new Date();
  let startYear = today.getFullYear();
  let startMonth = today.getMonth();
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
}

setInitialStartDate();

dateInput.addEventListener("change", dateChangeHandler);
