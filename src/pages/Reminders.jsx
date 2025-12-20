import { useEffect, useState } from "react";

function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("reminders")) || [];
    setReminders(stored);
  }, []);

  const saveReminders = (data) => {
    setReminders(data);
    localStorage.setItem("reminders", JSON.stringify(data));
  };

  const isOverdue = (r) => {
    const now = new Date();
    const reminderTime = new Date(`${r.date}T${r.time}`);
    return reminderTime < now;
  };

  return (
    <div className="reminders-page">
      <div className="reminders-header">
        <h1>Reminders</h1>
        <button
          className="matrix-add-btn"
          onClick={() => setShowModal(true)}
        >
          + New Reminder
        </button>
      </div>

      <ul className="reminder-list">
        {reminders.length === 0 && <p>No reminders</p>}

        {reminders.map((r) => (
          <li
            key={r.id}
            className={`reminder-item ${isOverdue(r) ? "overdue" : ""}`}
          >
            <div className="reminder-left">
              <p className="reminder-title">{r.title}</p>
              <span className="reminder-meta">
                📅 {r.date} ⏰ {r.time}
              </span>
            </div>

            <span
              className="delete"
              onClick={() =>
                saveReminders(reminders.filter(x => x.id !== r.id))
              }
            >
              Delete
            </span>
          </li>
        ))}
      </ul>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>New Reminder</h2>

            <div className="form-row">
              <label>Title</label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, title: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Date</label>
              <input
                type="date"
                value={newReminder.date}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, date: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Time</label>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, time: e.target.value })
                }
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={() => {
                  saveReminders([
                    ...reminders,
                    { ...newReminder, id: Date.now() },
                  ]);
                  setNewReminder({ title: "", date: "", time: "" });
                  setShowModal(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reminders;
