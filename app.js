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

const dateChangeHandler = (e) => {
  const startDateInput = e.target.value; // "2025-10-16"
  const [y, m, d] = startDateInput.split("-").map(Number);
  const date = new Date(y, m - 1, d); // always local midnight of chosen day

  const startDateObject = new Date(date); // copy it
  console.log(e.target.value);
  console.log(startDateObject);
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

dateInput.addEventListener("change", dateChangeHandler);
