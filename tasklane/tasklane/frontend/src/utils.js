export const STATUS_LABEL = { todo: "To do", in_progress: "In progress", completed: "Done" };
export const PRIORITY_LABEL = { low: "Low", medium: "Medium", high: "High" };

const today = () => new Date().toISOString().slice(0, 10);

export function isOverdue(task) {
  return Boolean(task.due_date) && task.status !== "completed" && task.due_date < today();
}

export function formatDue(iso) {
  if (!iso) return "No due date";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function formatWhen(iso) {
  return new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}
