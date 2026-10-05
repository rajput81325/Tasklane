import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function TaskForm({ task, users, me, onClose, onSaved }) {
  const editing = Boolean(task);
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    assigned_to: task?.assigned_to || me.id,
    priority: task?.priority || "medium",
    due_date: task?.due_date || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const saved = editing ? await api.updateTask(task.id, form) : await api.createTask(form);
      onSaved(saved, editing);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="dialog" role="dialog" aria-modal="true" aria-labelledby="form-title" onSubmit={submit}>
        <h2 id="form-title">{editing ? "Edit task" : "New task"}</h2>

        <label>
          Title
          <input value={form.title} onChange={set("title")} maxLength={200} autoFocus required />
        </label>
        <label>
          Description
          <textarea value={form.description} onChange={set("description")} rows={4} maxLength={2000} />
        </label>
        <label>
          Assign to
          <select value={form.assigned_to} onChange={set("assigned_to")}>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
                {u.id === me.id ? " (you)" : ""} · {u.email}
              </option>
            ))}
          </select>
        </label>
        <div className="row">
          <label>
            Priority
            <select value={form.priority} onChange={set("priority")}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label>
            Due date
            <input type="date" value={form.due_date} onChange={set("due_date")} />
          </label>
        </div>

        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" disabled={saving}>
            {saving ? "Saving…" : editing ? "Save changes" : "Create task"}
          </button>
        </div>
      </form>
    </div>
  );
}
