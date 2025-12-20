import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

function Dashboard() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [dateText, setDateText] = useState("");
  const [greeting, setGreeting] = useState("");

  const [todoCount, setTodoCount] = useState(0);
  const [habitTotal, setHabitTotal] = useState(0);
  const [habitCompleted, setHabitCompleted] = useState(0);
  const [upcomingReminders, setUpcomingReminders] = useState(0);
  const [habitStreaks, setHabitStreaks] = useState([]);

  useEffect(() => {
    const now = new Date();

    setDateText(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    );

    const hour = now.getHours();
    setGreeting(
      hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    );

    // TODOS
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTodoCount(tasks.length);

    // HABITS
    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    setHabitTotal(habits.length);

    const today = new Date().toISOString().split("T")[0];
    setHabitCompleted(
      habits.filter((h) => h.completedDates?.includes(today)).length
    );

    // REMINDERS
    const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    setUpcomingReminders(
      reminders.filter((r) => r.date && new Date(r.date) >= new Date()).length
    );

    // HABIT STREAKS
    setHabitStreaks(
      habits.map((h) => ({
        name: h.name,
        streak: h.completedDates?.length || 0,
      }))
    );

    // FOCUS HOURS
    const focusData = JSON.parse(localStorage.getItem("focusHours")) || {};
    const labels = [];
    const values = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];

      labels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
      values.push(focusData[key] || 0);
    }

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Focus Hours",
            data: values,
            backgroundColor: "#05c26a",
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, border: { display: false } },
          y: { grid: { display: false }, border: { display: false }, ticks: { display: false } },
        },
      }
      
      
    });
  }, []);

  return (
    <section id="dashboard-section">
      <div className="date-div">
        <p className="date-sub">{dateText}</p>
        <p className="greet-apple">
          {greeting}, <span>@user</span>
        </p>

        <div className="middle-part">
          <div className="box-1">
            <p className="title-middle">Daily Summary</p>
            <p className="middle-p">To do tasks: {todoCount}</p>
          </div>

          <div className="box-1">
            <p className="title-middle">Habits</p>
            <p className="middle-p">
              {habitCompleted}/{habitTotal} completed
            </p>
          </div>

          <div className="box-1">
            <p className="title-middle">Reminders</p>
            <p className="middle-p">Upcoming: {upcomingReminders}</p>
          </div>
        </div>

        <div className="charts-grid">
  {/* Focus Hours */}
  <div className="chart-container">
    <p className="title-middle">Focus Hours (This Week)</p>
    <canvas ref={chartRef} />
  </div>

  {/* Habits Overview */}
  <div className="chart-container">
    <p className="title-middle">Habits Overview</p>

    <ul className="habit-streak-list">
      {habitStreaks.length === 0 && (
        <li style={{ color: "#A6ADBA" }}>No habits yet</li>
      )}

      {habitStreaks.map((h, i) => (
        <li key={i} className="habit-streak-item">
          <span className="habit-streak-name">{h.name}</span>
          <span className="streak-badge">🔥 {h.streak}</span>
        </li>
      ))}
    </ul>
  </div>

  {/* Reminders Mini */}
  <div className="chart-container reminders-mini">
    <p className="title-middle">Reminders</p>
    <p className="middle-p">
      Upcoming reminders: <span>{upcomingReminders}</span>
    </p>
  </div>
</div>

      </div>
    </section>
  );
}

export default Dashboard;
