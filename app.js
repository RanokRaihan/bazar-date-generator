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
  const startDateObject = new Date(e.target.value);
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
      <td>${startDateObject.toLocaleDateString("Bn-BD")}</td>
      <td>${weekDays[startDateObject.getDay()]}</td>
    </tr>
 `;
    startDateObject.setDate(startDateObject.getDate() + 3);
  }
};

dateInput.addEventListener("change", dateChangeHandler);
