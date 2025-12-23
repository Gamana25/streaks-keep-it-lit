import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
function getNameFromEmail(email) {
  if (!email) return "User";

  const beforeAt = email.split("@")[0];          
  const lettersOnly = beforeAt.replace(/[^a-zA-Z]/g, ""); 

  if (!lettersOnly) return "User";

  return (
    lettersOnly.charAt(0).toUpperCase() +
    lettersOnly.slice(1).toLowerCase()
  );
}

function Dashboard() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [dateText, setDateText] = useState("");
  const [greeting, setGreeting] = useState("");
  const [username, setUsername] = useState("user");

  const [todoCount, setTodoCount] = useState(0);
  const [habitTotal, setHabitTotal] = useState(0);
  const [habitCompleted, setHabitCompleted] = useState(0);
  const [upcomingReminders, setUpcomingReminders] = useState(0);
  const [habitStreaks, setHabitStreaks] = useState([]);
  const [reminderList, setReminderList] = useState([]);

  /* ================= CHART RENDER ================= */

  const renderChart = () => {
    if (!chartRef.current) return;

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
      type: "line",
      data: {
        labels,
        datasets: [
          {
            data: values,
            borderColor: "#05c26a",
            backgroundColor: "rgba(5, 194, 106, 0.2)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
            pointBackgroundColor: "#05c26a",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: (v) => `${v}m`,
            },
          },
        },
      },
    });
  };

  /* ================= EFFECT ================= */

  useEffect(() => {
    const now = new Date();

    /* DATE + GREETING */
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

    /* USERNAME */
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUsername(getNameFromEmail(storedUser.email));


    /* TODOS */
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTodoCount(tasks.filter(t => !t.completed).length);

    /* HABITS */
    const habits = JSON.parse(localStorage.getItem("habits")) || [];
    setHabitTotal(habits.length);

    const today = new Date().toISOString().split("T")[0];
    setHabitCompleted(
      habits.filter(h => h.completedDates?.includes(today)).length
    );

    /* REMINDERS */
    const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
    const upcoming = reminders.filter(r => r.date);
    setUpcomingReminders(upcoming.length);
    setReminderList(upcoming.slice(0, 5));

    /* HABIT STREAKS */
    setHabitStreaks(
      habits.map(h => ({
        name: h.name,
        streak: h.completedDates?.length || 0,
      }))
    );

    /* INITIAL CHART */
    renderChart();

    /* LISTEN FOR TASK COMPLETE / UNDO */
    window.addEventListener("focusUpdated", renderChart);

    return () => {
      window.removeEventListener("focusUpdated", renderChart);
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  /* ================= JSX ================= */

  return (
    <section id="dashboard-section">
      <div className="date-div">
        <p className="date-sub">{dateText}</p>
        <p className="greet-apple">
          {greeting}, <span>{username}</span>
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
          <div className="chart-container">
            <p className="title-middle">Focus Minutes (Last 7 Days)</p>
            <canvas ref={chartRef} />
          </div>

          <div className="chart-container">
            <p className="title-middle">Habits Overview</p>
            <ul className="habit-streak-list">
              {habitStreaks.map((h, i) => (
                <li key={i} className="habit-streak-item">
                  <span>{h.name}</span>
                  <span>🔥 {h.streak}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="chart-container reminders-mini">
            <p className="title-middle">Upcoming Reminders</p>
            <ul className="reminder-mini-list">
              {reminderList.map(r => (
                <li key={r.id} className="reminder-mini-item">
                  <p>{r.title}</p>
                  <span>📅 {formatDate(r.date)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
