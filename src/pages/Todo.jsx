import { useEffect, useState } from "react";

/* ================= HELPERS ================= */

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

/* ================= MAIN ================= */

function Todo() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

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

  return (
    <div className="todo-page">
      <h1 className="todo-title">To Do List</h1>

      <div className="todo-actions">
        <input className="todo-search" placeholder="Search tasks..." />

        <div className="todo-filters">
          <button className="todo-filter active">All</button>
          <button className="todo-filter">Today</button>
          <button className="todo-filter">Overdue</button>
        </div>

        <button
          className="matrix-add-btn"
          onClick={() => {
            setEditingTask(null);
            setShowModal(true);
          }}
        >
          + New Task
        </button>
      </div>

      <div className="matrix-grid">
        {renderBox(1, "Urgent & Important", tasks, saveTasks, setEditingTask, setShowModal)}
        {renderBox(2, "Not Urgent & Important", tasks, saveTasks, setEditingTask, setShowModal)}
        {renderBox(3, "Urgent & Not Important", tasks, saveTasks, setEditingTask, setShowModal)}
        {renderBox(4, "Not Urgent & Not Important", tasks, saveTasks, setEditingTask, setShowModal)}
      </div>

      {/* ========== MODAL ========== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>{editingTask ? "Edit Task" : "New Task"}</h2>

            <div className="form-row">
              <label>Task Name</label>
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
              <label>Duration (mins)</label>
              <input
                type="number"
                value={editingTask ? editingTask.duration : newTask.duration}
                onChange={(e) =>
                  editingTask
                    ? setEditingTask({ ...editingTask, duration: e.target.value })
                    : setNewTask({ ...newTask, duration: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <label>Due Date</label>
              <input
                type="date"
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

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={() => {
                  if (editingTask) {
                    saveTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
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

function renderBox(q, title, tasks, saveTasks, setEditingTask, setShowModal) {
  const filtered = tasks.filter(t => t.quadrant === q);

  const toggleDone = (id) => {
    saveTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const onDragStart = (e, task) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const onDrop = (e) => {
    const taskId = Number(e.dataTransfer.getData("taskId"));
    saveTasks(tasks.map(t =>
      t.id === taskId ? { ...t, quadrant: q } : t
    ));
  };

  return (
    <div
      className="matrix-box"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <h2>{title}</h2>

      <ul className="matrix-list">
        {filtered.length === 0 && <p>No tasks</p>}

        {filtered.map(task => (
          <li
            key={task.id}
            className={`matrix-task 
              ${task.completed ? "done" : ""} 
              ${isOverdue(task) ? "overdue" : ""}
            `}
            draggable
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
                <span
                  className="task-action edit"
                  onClick={() => {
                    setEditingTask(task);
                    setShowModal(true);
                  }}
                >
                  Edit
                </span>

                <span
                  className="task-action delete"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </span>
              </div>
            </div>

            <div className="task-meta">
              <span className={`due-date ${isOverdue(task) ? "overdue" : ""}`}>
                📅 {formatDate(task.dueDate)}
              </span>
              <span className="duration">⏱ {task.duration} min</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
