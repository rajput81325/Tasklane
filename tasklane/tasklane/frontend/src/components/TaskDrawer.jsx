import { useEffect, useState } from "react";
import { api } from "../api.js";
import Avatar from "./Avatar.jsx";
import { PRIORITY_LABEL, STATUS_LABEL, formatDue, formatWhen, isOverdue } from "../utils.js";

export default function TaskDrawer({ id, me, onClose, onStatus, onEdit, onDelete }) {
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);

  const load = () =>
    api
      .task(id)
      .then(setTask)
      .catch((e) => setError(e.message));

  useEffect(() => {
    setTask(null);
    setError("");
    load();
  }, [id]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const changeStatus = async (status) => {
    await onStatus(task, status);
    load();
  };

  const post = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setPosting(true);
    try {
      const c = await api.addComment(id, comment);
      setTask((t) => ({ ...t, comments: [...t.comments, c] }));
      setComment("");
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const isCreator = task && task.created_by === me.id;

  return (
    <div className="overlay overlay-right" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Task details">
        <button className="btn-ghost drawer-close" onClick={onClose}>
          Close
        </button>

        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        {!task && !error && <p className="muted">Loading task…</p>}

        {task && (
          <>
            <h2>{task.title}</h2>
            {task.description && <p className="desc">{task.description}</p>}

            <dl className="facts">
              <dt>Status</dt>
              <dd>
                <select value={task.status} onChange={(e) => changeStatus(e.target.value)} aria-label="Change status">
                  {Object.entries(STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </dd>
              <dt>Assigned to</dt>
              <dd className="who">
                <Avatar person={task.assignee} size={22} /> {task.assignee.id === me.id ? "You" : task.assignee.name}
              </dd>
              <dt>Created by</dt>
              <dd className="who">
                <Avatar person={task.creator} size={22} /> {task.creator.id === me.id ? "You" : task.creator.name}
              </dd>
              <dt>Priority</dt>
              <dd>{PRIORITY_LABEL[task.priority]}</dd>
              <dt>Due</dt>
              <dd className={isOverdue(task) ? "overdue" : ""}>{formatDue(task.due_date)}</dd>
              {task.completed_at && (
                <>
                  <dt>Completed</dt>
                  <dd>{formatWhen(task.completed_at)}</dd>
                </>
              )}
            </dl>

            {isCreator && (
              <div className="drawer-actions">
                <button className="btn-ghost" onClick={() => onEdit(task)}>
                  Edit task
                </button>
                <button
                  className="btn-danger"
                  onClick={() => window.confirm("Delete this task for everyone?") && onDelete(task)}
                >
                  Delete task
                </button>
              </div>
            )}

            <h3>Comments</h3>
            <ul className="comments">
              {task.comments.length === 0 && <li className="muted">No comments yet. Start the conversation below.</li>}
              {task.comments.map((c) => (
                <li key={c.id}>
                  <Avatar person={c.author} size={26} />
                  <div>
                    <strong>{c.author.name}</strong> <span className="muted">{formatWhen(c.created_at)}</span>
                    <p>{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <form className="comment-form" onSubmit={post}>
              <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment" maxLength={1000} />
              <button className="btn-primary" disabled={posting || !comment.trim()}>
                Post
              </button>
            </form>
          </>
        )}
      </aside>
    </div>
  );
}
