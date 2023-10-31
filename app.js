const dateInput = document.getElementById("start-date");

const dateChangeHandler = (e) => {
  console.log(e.target.value);
};

dateInput.addEventListener("change", dateChangeHandler);
