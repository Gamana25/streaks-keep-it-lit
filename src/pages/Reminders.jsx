import { useEffect, useState } from "react";
function formatCoolDate(dateStr) {
  if (!dateStr) return "--";

  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}
function formatTime12(timeStr) {
  if (!timeStr) return "Anytime";

  const [h, m] = timeStr.split(":");
  const date = new Date();
  date.setHours(h, m);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}


function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const [newReminder, setNewReminder] = useState({
    title: "",
    date: "",
    time: "",
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("reminders")) || [];
    setReminders(stored);
  }, []);

  const saveReminders = (data) => {
    setReminders(data);
    localStorage.setItem("reminders", JSON.stringify(data));
  };

  /* HIDE PAST REMINDERS */
  const visibleReminders = reminders.filter(
    (r) => !r.deleted && r.date >= today
  );

  /* DELETE → ARCHIVE */
  const deleteReminder = (id) => {
    saveReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, deleted: true } : r
      )
    );
  };

  /* EDIT */
  const editReminder = (r) => {
    setEditingId(r.id);
    setNewReminder({
      title: r.title,
      date: r.date,
      time: r.time,
    });
    setError("");
    setShowModal(true);
  };

  /* SAVE (ADD / EDIT) */
  const handleSave = () => {
    if (!newReminder.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!newReminder.date) {
      setError("Date is required");
      return;
    }

    if (editingId) {
      // EDIT MODE
      saveReminders(
        reminders.map((r) =>
          r.id === editingId
            ? { ...r, ...newReminder }
            : r
        )
      );
    } else {
      // ADD MODE
      saveReminders([
        ...reminders,
        {
          ...newReminder,
          id: Date.now(),
          deleted: false,
        },
      ]);
    }

    // RESET
    setNewReminder({ title: "", date: "", time: "" });
    setEditingId(null);
    setError("");
    setShowModal(false);
  };

  return (
    <div className="reminders-page">
      <div className="reminders-header">
        <h1>Reminders</h1>
        <button
          className="matrix-add-btn"
          onClick={() => {
            setEditingId(null);
            setNewReminder({ title: "", date: "", time: "" });
            setError("");
            setShowModal(true);
          }}
        >
          + New Reminder
        </button>
      </div>

      <ul className="reminder-list">
        {visibleReminders.length === 0 && <p>No upcoming reminders</p>}

        {visibleReminders.map((r) => (
          <li key={r.id} className="reminder-item">
            <div className="reminder-left">
              <p className="reminder-title">{r.title}</p>
              <span className="reminder-meta">
                <span className="reminder-date">
                  {formatCoolDate(r.date)}
                </span>

                <span className="reminder-time">
                  ⏰ {formatTime12(r.time)}
                </span>
              </span>


            </div>

            <div className="reminder-actions">
              <span className="edit_rem" onClick={() => editReminder(r)}>
                Edit
              </span>
              <span className="delete" onClick={() => deleteReminder(r.id)}>
                Delete
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? "Edit Reminder" : "New Reminder"}</h2>

            <div className="form-row">
              <label>Title *</label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, title: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Date *</label>
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

            {error && (
              <p style={{ color: "#ff5252", fontSize: "14px" }}>
                {error}
              </p>
            )}

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button className="save-btn" onClick={handleSave}>
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
