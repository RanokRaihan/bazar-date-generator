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
        <td>${startDateObject.toLocaleDateString()}</td>
        <td>${weekDays[startDateObject.getDay()]}</td>
      </tr>
    `;
    startDateObject.setDate(startDateObject.getDate() + 3);
  }
};

const dateChangeHandler = (e) => {
  renderTable(e.target.value);
};

dateInput.addEventListener("change", dateChangeHandler);
