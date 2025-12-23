import { useEffect, useState } from "react";

function Habits() {
  const [habits, setHabits] = useState([]);
  const [search, setSearch] = useState("");
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [removingHabitId, setRemovingHabitId] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  /* LOAD */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("habits")) || [];
    setHabits(stored);
  }, []);

  const saveHabits = (data) => {
    setHabits(data);
    localStorage.setItem("habits", JSON.stringify(data));
  };

  /* TOGGLE CHECK */
  const toggleHabit = (id) => {
    const updated = habits.map((h) => {
      if (h.id !== id) return h;

      const dates = h.completedDates || [];
      const done = dates.includes(today);

      return {
        ...h,
        completedDates: done
          ? dates.filter((d) => d !== today)
          : [...dates, today],
      };
    });

    saveHabits(updated);
  };

  /* ADD / EDIT */
  const handleSaveHabit = () => {
    if (!newHabitName.trim()) return;

    if (editingHabitId) {
      saveHabits(
        habits.map((h) =>
          h.id === editingHabitId
            ? { ...h, name: newHabitName.trim() }
            : h
        )
      );
    } else {
      saveHabits([
        ...habits,
        {
          id: Date.now(),
          name: newHabitName.trim(),
          completedDates: [],
          deleted: false,
        },
      ]);
    }

    setNewHabitName("");
    setEditingHabitId(null);
    setShowHabitModal(false);
  };

  /* RESET */
  const resetToday = () => {
    saveHabits(
      habits.map((h) => ({
        ...h,
        completedDates: (h.completedDates || []).filter((d) => d !== today),
      }))
    );
  };

  /* SOFT DELETE WITH ANIMATION */
  const deleteHabit = (id) => {
    setRemovingHabitId(id);

    setTimeout(() => {
      saveHabits(
        habits.map((h) =>
          h.id === id ? { ...h, deleted: true } : h
        )
      );
      setRemovingHabitId(null);
    }, 250);
  };

  const filteredHabits = habits.filter(
    (h) =>
      !h.deleted &&
      h.name.toLowerCase().includes(search.toLowerCase())
  );

  const undoneHabits = filteredHabits.filter(
    (h) => !h.completedDates?.includes(today)
  );

  const doneHabits = filteredHabits.filter(
    (h) => h.completedDates?.includes(today)
  );

  const orderedHabits = [...undoneHabits, ...doneHabits];

  return (
    <>
      <div className="habits-card">
        {/* TOP */}
        <div className="habits-top">
          <div>
            <h2 className="habits-title">Habits</h2>
            <p className="habits-date">{new Date().toDateString()}</p>
          </div>

          <div className="habits-controls">
            <div className="search-input">
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <span className="new-btn" onClick={() => setShowHabitModal(true)}>
              + New
            </span>
          </div>
        </div>

        {/* LIST */}
        <ul className="habit-list">
          {orderedHabits.map((h) => {
            const doneToday = h.completedDates?.includes(today);

            return (
              <li
                key={h.id}
                className={`habit-item ${
                  removingHabitId === h.id ? "fade-out" : "fade-in"
                }`}
              >
                <div className="habit-left">
                  <div
                    className={`checkbox ${doneToday ? "checked" : ""}`}
                    onClick={() => toggleHabit(h.id)}
                  />
                  <span className={`habit-text ${doneToday ? "done" : ""}`}>
                    {h.name}
                  </span>
                </div>

                <div className="habit-right">
                  <span className="streak">{h.completedDates.length}</span>

                  <span
                    className="edit"
                    onClick={() => {
                      setEditingHabitId(h.id);
                      setNewHabitName(h.name);
                      setShowHabitModal(true);
                    }}
                  >
                    Edit
                  </span>

                  <span
                    className="delete"
                    onClick={() => deleteHabit(h.id)}
                  >
                    Delete
                  </span>
                </div>
              </li>
            );
          })}
        </ul>

        {/* FOOTER */}
        <div className="habits-footer">
          <span
            className="add-habit-btn"
            onClick={() => setShowHabitModal(true)}
          >
            Add habit
          </span>

          <span className="reset-btn" onClick={resetToday}>
            Reset today
          </span>
        </div>
      </div>

      {/* MODAL */}
      {showHabitModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowHabitModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingHabitId ? "Edit Habit" : "Add Habit"}</h2>

            <div className="form-row">
              <label>Habit Name</label>
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                className="btn ghost"
                onClick={() => setShowHabitModal(false)}
              >
                Cancel
              </button>
              <button className="btn" onClick={handleSaveHabit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Habits;
