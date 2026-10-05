import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import Avatar from "../components/Avatar.jsx";
import TaskCard from "../components/TaskCard.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskDrawer from "../components/TaskDrawer.jsx";
import { STATUS_LABEL } from "../utils.js";

const SCOPES = [
  { key: "assigned", label: "Assigned to me" },
  { key: "created", label: "Created by me" },
  { key: "mine", label: "All my tasks" },
];

export default function Board() {
  const { user, logout } = useAuth();
  const [scope, setScope] = useState("assigned");
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("");
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [formTask, setFormTask] = useState(undefined); // undefined = closed, null = new, object = edit
  const [openId, setOpenId] = useState(() => new URLSearchParams(window.location.search).get("task"));

  const say = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const loadTasks = useCallback(async () => {
    try {
      setTasks(await api.tasks({ scope, q, priority }));
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [scope, q, priority]);

  const loadStats = useCallback(() => api.stats().then(setStats).catch(() => {}), []);
  const refresh = useCallback(() => Promise.all([loadTasks(), loadStats()]), [loadTasks, loadStats]);

  useEffect(() => {
    const t = setTimeout(loadTasks, q ? 250 : 0);
    return () => clearTimeout(t);
  }, [loadTasks, q]);

  useEffect(() => {
    loadStats();
    api.users().then(setUsers).catch(() => {});
  }, [loadStats]);

  const closeDrawer = () => {
    setOpenId(null);
    if (window.location.search) window.history.replaceState({}, "", window.location.pathname);
  };

  const changeStatus = async (task, status) => {
    try {
      await api.updateTask(task.id, { status });
      say(status === "completed" ? "Task completed. Notification emails are on the way." : `Moved to ${STATUS_LABEL[status]}.`);
      refresh();
    } catch (e) {
      say(e.message);
    }
  };

  const onSaved = (saved, editing) => {
    setFormTask(undefined);
    say(editing ? "Task updated." : "Task created. Notification emails are on the way.");
    refresh();
    if (editing) setOpenId(saved.id);
  };

  const remove = async (task) => {
    try {
      await api.deleteTask(task.id);
      closeDrawer();
      say("Task deleted.");
      refresh();
    } catch (e) {
      say(e.message);
    }
  };

  const columns = ["todo", "in_progress", "completed"];

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">Tasklane</span>
        <div className="topbar-right">
          <button className="btn-primary" onClick={() => setFormTask(null)}>
            New task
          </button>
          <span className="me">
            <Avatar person={user} size={30} />
            <span className="me-name">{user.name}</span>
          </span>
          <button className="btn-ghost" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <main className="content">
        {stats && (
          <section className="stats" aria-label="Summary">
            <div>
              <b>{stats.open_for_me}</b> open for you
            </div>
            <div>
              <b>{stats.in_progress}</b> in progress
            </div>
            <div className={stats.overdue ? "warn" : ""}>
              <b>{stats.overdue}</b> overdue
            </div>
            <div>
              <b>{stats.completed}</b> of {stats.total} done
            </div>
          </section>
        )}

        <section className="filters">
          <div className="tabs" role="tablist">
            {SCOPES.map((s) => (
              <button key={s.key} role="tab" aria-selected={scope === s.key} onClick={() => setScope(s.key)}>
                {s.label}
              </button>
            ))}
          </div>
          <input type="search" placeholder="Search by title" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search tasks" />
          <select value={priority} onChange={(e) => setPriority(e.target.value)} aria-label="Filter by priority">
            <option value="">Any priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </section>

        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}

        <section className="board">
          {columns.map((col) => {
            const items = tasks.filter((t) => t.status === col);
            return (
              <div className="column" key={col}>
                <h2>
                  {STATUS_LABEL[col]} <span className="count">{items.length}</span>
                </h2>
                {loading && <p className="muted">Loading…</p>}
                {!loading && items.length === 0 && (
                  <p className="empty">{col === "todo" ? "Nothing waiting. Create a task to get started." : "No tasks here."}</p>
                )}
                {items.map((t) => (
                  <TaskCard key={t.id} task={t} me={user} onOpen={setOpenId} onStatus={changeStatus} />
                ))}
              </div>
            );
          })}
        </section>
      </main>

      {formTask !== undefined && (
        <TaskForm task={formTask} users={users} me={user} onClose={() => setFormTask(undefined)} onSaved={onSaved} />
      )}
      {openId && formTask === undefined && (
        <TaskDrawer
          id={openId}
          me={user}
          onClose={closeDrawer}
          onStatus={changeStatus}
          onEdit={(t) => setFormTask(t)}
          onDelete={remove}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
