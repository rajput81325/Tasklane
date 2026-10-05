import Avatar from "./Avatar.jsx";
import { PRIORITY_LABEL, formatDue, isOverdue } from "../utils.js";

const NEXT = {
  todo: { status: "in_progress", label: "Start" },
  in_progress: { status: "completed", label: "Mark complete" },
  completed: { status: "todo", label: "Reopen" },
};

export default function TaskCard({ task, me, onOpen, onStatus }) {
  const next = NEXT[task.status];
  const mine = task.assignee.id === me.id;
  return (
    <article className={`card ${task.status === "completed" ? "is-done" : ""}`}>
      <button className="card-main" onClick={() => onOpen(task.id)}>
        <span className="card-title">{task.title}</span>
        <span className="card-meta">
          <span className={`prio prio-${task.priority}`}>{PRIORITY_LABEL[task.priority]}</span>
          <span className={isOverdue(task) ? "due overdue" : "due"}>
            {isOverdue(task) ? "Overdue: " : ""}
            {formatDue(task.due_date)}
          </span>
        </span>
      </button>
      <footer className="card-foot">
        <span className="who">
          <Avatar person={task.assignee} size={22} />
          {mine ? "You" : task.assignee.name}
        </span>
        <button className="btn-text" onClick={() => onStatus(task, next.status)}>
          {next.label}
        </button>
      </footer>
    </article>
  );
}
