const calendarDays = document.getElementById("calendar-days");
const monthSelect = document.getElementById("month-select");
const yearSelect = document.getElementById("year-select");
const modal = document.getElementById("reminder-modal");
const reminderDateText = document.getElementById("reminder-date");
const reminderTitle = document.getElementById("reminder-title");
const reminderTime = document.getElementById("reminder-time");

let currentDate = new Date();
let selectedDate = "";
let events = JSON.parse(localStorage.getItem("calendar-events")) || [];

function populateDropdowns() {
  const monthNames = [...Array(12).keys()].map(m => new Date(0, m).toLocaleString('default', { month: 'long' }));
  monthNames.forEach((month, i) => {
    const option = new Option(month, i);
    monthSelect.appendChild(option);
  });
  for (let y = 1990; y <= 2050; y++) {
    const option = new Option(y, y);
    yearSelect.appendChild(option);
  }

  monthSelect.value = currentDate.getMonth();
  yearSelect.value = currentDate.getFullYear();
}

function renderCalendar() {
  const year = +yearSelect.value;
  const month = +monthSelect.value;
  const today = new Date();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  calendarDays.innerHTML = "";
  for (let i = 0; i < firstDay; i++) {
    calendarDays.innerHTML += `<div></div>`;
  }

  for (let d = 1; d <= totalDays; d++) {
    const thisDate = new Date(year, month, d);
    const dateStr = thisDate.toISOString().split("T")[0];
    const isToday = thisDate.toDateString() === today.toDateString();
    let html = `<div class="${isToday ? "today" : ""}" onclick="openModal('${dateStr}')"><strong>${d}</strong>`;

    const dayEvents = events.filter(ev => ev.date === dateStr);
    dayEvents.forEach(ev => {
      html += `<div class="event">${ev.time} - ${ev.title}</div>`;
    });

    html += "</div>";
    calendarDays.innerHTML += html;
  }
}

function openModal(dateStr) {
  selectedDate = dateStr;
  reminderDateText.textContent = `Date: ${dateStr}`;
  reminderTitle.value = "";
  reminderTime.value = "";
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function saveReminder() {
  const title = reminderTitle.value;
  const time = reminderTime.value;
  if (!title || !time) return alert("Please enter both title and time.");

  events.push({ date: selectedDate, title, time });
  localStorage.setItem("calendar-events", JSON.stringify(events));
  renderCalendar();
  closeModal();
}

monthSelect.addEventListener("change", renderCalendar);
yearSelect.addEventListener("change", renderCalendar);

populateDropdowns();
renderCalendar();
