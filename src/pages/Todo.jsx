import { useEffect, useState } from "react";

/* ================= HELPERS ================= */
function addFocusMinutes(minutes) {
  const today = new Date().toISOString().split("T")[0];
  const data = JSON.parse(localStorage.getItem("focusHours")) || {};
  data[today] = (data[today] || 0) + Number(minutes);
  localStorage.setItem("focusHours", JSON.stringify(data));
}

function removeFocusMinutes(minutes) {
  const today = new Date().toISOString().split("T")[0];
  const data = JSON.parse(localStorage.getItem("focusHours")) || {};
  data[today] = Math.max(0, (data[today] || 0) - Number(minutes));
  localStorage.setItem("focusHours", JSON.stringify(data));
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date().toISOString().split("T")[0];
  return task.dueDate < today;
}

function isToday(task) {
  if (!task.dueDate) return false;
  const today = new Date().toISOString().split("T")[0];
  return task.dueDate === today;
}

const todayStr = new Date().toISOString().split("T")[0];

/* ================= MAIN ================= */

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    duration: "",
    dueDate: "",
    quadrant: 1,
    completed: false,
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(stored);
  }, []);

  const saveTasks = (data) => {
    setTasks(data);
    localStorage.setItem("tasks", JSON.stringify(data));
  };

  /* ===== SEARCH + FILTER ===== */
  const visibleTasks = tasks
    // FIX: Keep the task visible if it is currently in the "removing" animation state
    .filter(t => !t.completed || t.removing)
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(t => {
      if (filter === "today") return isToday(t);
      if (filter === "overdue") return isOverdue(t);
      return true;
    });


  /* ===== VALIDATION ===== */
  const validateTask = (task) => {
    if (!task.title.trim()) return "Task name is required";
    if (!task.duration || Number(task.duration) <= 0)
      return "Focus minutes must be greater than 0";
    if (!task.dueDate) return "Due date is required";
    if (task.dueDate < todayStr) return "Due date cannot be in the past";
    return "";
  };

  return (
    <div className="todo-page">
      <h1 className="todo-title">To Do List</h1>

      <div className="todo-actions">
        <input
          className="todo-search"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="todo-filters">
          {["all", "today", "overdue"].map(f => (
            <button
              key={f}
              className={`todo-filter ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button
          className="matrix-add-btn"
          onClick={() => {
            setEditingTask(null);
            setError("");
            setShowModal(true);
          }}
        >
          + New Task
        </button>
      </div>

      <div className="matrix-grid">
        {renderBox(1, "Urgent & Important", tasks, visibleTasks, saveTasks, setEditingTask, setShowModal)}
        {renderBox(2, "Not Urgent & Important", tasks, visibleTasks, saveTasks, setEditingTask, setShowModal)}
        {renderBox(3, "Urgent & Not Important", tasks, visibleTasks, saveTasks, setEditingTask, setShowModal)}
        {renderBox(4, "Not Urgent & Not Important", tasks, visibleTasks, saveTasks, setEditingTask, setShowModal)}
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>{editingTask ? "Edit Task" : "New Task"}</h2>

            <div className="form-row">
              <label>Task Name *</label>
              <input
                type="text"
                value={editingTask ? editingTask.title : newTask.title}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, title: e.target.value })
                    : setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Focus Minutes *</label>
              <input
                type="number"
                min="1"
                value={editingTask ? editingTask.duration : newTask.duration}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, duration: e.target.value })
                    : setNewTask({ ...newTask, duration: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Due Date *</label>
              <input
                type="date"
                min={todayStr}
                value={editingTask ? editingTask.dueDate || "" : newTask.dueDate}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, dueDate: e.target.value })
                    : setNewTask({ ...newTask, dueDate: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Quadrant</label>
              <select
                value={editingTask ? editingTask.quadrant : newTask.quadrant}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, quadrant: Number(e.target.value) })
                    : setNewTask({ ...newTask, quadrant: Number(e.target.value) })
                }
              >
                <option value={1}>Urgent & Important</option>
                <option value={2}>Not Urgent & Important</option>
                <option value={3}>Urgent & Not Important</option>
                <option value={4}>Not Urgent & Not Important</option>
              </select>
            </div>

            {error && <p style={{ color: "#ff5252", fontSize: "14px" }}>{error}</p>}

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={() => {
                  const taskToSave = editingTask || newTask;
                  const err = validateTask(taskToSave);
                  if (err) {
                    setError(err);
                    return;
                  }

                  if (editingTask) {
                    saveTasks(tasks.map(t =>
                      t.id === editingTask.id ? editingTask : t
                    ));
                  } else {
                    saveTasks([...tasks, { ...newTask, id: Date.now() }]);
                    setNewTask({
                      title: "",
                      duration: "",
                      dueDate: "",
                      quadrant: 1,
                      completed: false,
                    });
                  }

                  setError("");
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

/* ================= MATRIX BOX ================= */

function renderBox(q, title, fullTasks, visibleTasks, saveTasks, setEditingTask, setShowModal) {
  const filtered = visibleTasks.filter(t => t.quadrant === q);

  const toggleDone = (id) => {
    const currentTask = fullTasks.find(t => t.id === id);
    if (!currentTask) return;
  
    const nowCompleted = !currentTask.completed;
  
    if (nowCompleted) {
      // 1. Trigger Animation: set removing to true first
      saveTasks(
        fullTasks.map(t =>
          t.id === id ? { ...t, removing: true } : t
        )
      );
      
      addFocusMinutes(currentTask.duration);
      window.dispatchEvent(new Event("focusUpdated"));

      // 2. Delay the actual "completion" filter so animation can play
      setTimeout(() => {
        saveTasks(
          fullTasks.map(t =>
            t.id === id ? { ...t, completed: true, removing: false } : t
          )
        );
      }, 500); // Matches your CSS transition time

    } else {
      removeFocusMinutes(currentTask.duration);
      saveTasks(
        fullTasks.map(t =>
          t.id === id ? { ...t, completed: false, removing: false } : t
        )
      );
      window.dispatchEvent(new Event("focusUpdated"));
    }
  };
  

  const deleteTask = (id) => {
    saveTasks(fullTasks.filter(t => t.id !== id));
  };

  const onDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const onDrop = (e) => {
    const taskId = Number(e.dataTransfer.getData("taskId"));
    saveTasks(fullTasks.map(t =>
      t.id === taskId ? { ...t, quadrant: q } : t
    ));
  };

  return (
    <div className="matrix-box" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      <h2>{title}</h2>

      <ul className="matrix-list">
        {filtered.length === 0 && <p>No tasks</p>}

        {filtered.map(task => (
          <li
            key={task.id}
            className={`matrix-task ${task.completed ? "done" : ""} ${task.removing ? "removing" : ""} ${isOverdue(task) ? "overdue" : ""}`}
            draggable={!task.removing}
            onDragStart={(e) => onDragStart(e, task)}
          >
            <div className="matrix-task-row">
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleDone(task.id)}
                />
                <span className="task-name">{task.title}</span>
              </div>

              <div className="task-actions">
                <span className="task-action edit" onClick={() => { setEditingTask(task); setShowModal(true); }}>
                  Edit
                </span>
                <span className="task-action delete" onClick={() => deleteTask(task.id)}>
                  Delete
                </span>
              </div>
            </div>

            <div className="task-meta">
              <span className={`due-date ${isOverdue(task) ? "overdue" : ""}`}>
                📅 {formatDate(task.dueDate)}
              </span>
              <span className="duration">⏳ {task.duration} min</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;