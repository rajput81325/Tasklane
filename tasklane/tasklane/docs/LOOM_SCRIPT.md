# Loom walkthrough script (aim for 8 to 12 minutes)

Tip: open these side by side before recording: the live app, the GitHub repo, VS Code, the Supabase table editor and two Gmail inboxes.

## 1. Intro (30 s)
"Hi, I'm Aman. This is Tasklane, my submission for the Hairdrama Tech assignment: a task manager with Google login, task assignment and Gmail notifications. Stack: React, Flask, Supabase, Gmail API, deployed on Vercel and Render."

## 2. Live demo (3 min)
1. Sign in with Google account A. Mention a user is created automatically.
2. Sign in with account B in a second browser or incognito window so both exist.
3. As A: **New task**, assign to B, high priority, due date. Show the toast.
4. Open B's Gmail: the "New task assigned to you" email. Open A's Gmail: the confirmation. Click **Open task** to show the deep link.
5. As B: **Mark complete**. Show both inboxes receiving "Task completed".
6. Quick tour of extras: board columns, filters and search, summary strip, overdue highlighting, comments, edit and delete, permissions (B cannot edit the title).

## 3. Architecture (1 min)
Show the diagram in the README. Explain: browser, Flask API, Supabase, Gmail API. Why a backend JWT after Google login. Why the service_role key stays on the server and RLS is on.

## 4. Database (1 min)
Supabase table editor and `migrations/`: users, tasks (status and priority check constraints, foreign keys, `updated_at` trigger), task_comments, email_logs.

## 5. Backend code (3 min)
- `config.py`: everything from environment variables
- `__init__.py`: app factory, CORS, JSON error handlers
- `routes_auth.py`: verifying the Google ID token, upserting the user, issuing the JWT
- `auth.py`: the `login_required` decorator
- `routes_tasks.py`: validation in `clean`, the permission rules (creator vs assignee), where emails are triggered, the stats endpoint
- `emailer.py`: refresh token to access token to Gmail send, background thread, `email_logs`, why Gmail API instead of SMTP

## 6. Frontend code (2 min)
- `api.js`: one request helper, token handling, 401 handling
- `auth.jsx`: context, session restore
- `Login.jsx`: Google button
- `Board.jsx`: filters, stats, status changes, deep link handling
- `TaskForm.jsx`, `TaskDrawer.jsx`, `TaskCard.jsx`

## 7. Tests, repo and deployment (1 min)
Run `pytest` on camera. Show the commit history, `.env.example`, README. Mention Vercel + Render + Supabase and the production checklist.

## 8. Close (15 s)
"Thanks for watching. Ideas for next steps: due-date reminder emails, team workspaces, and a realtime board with Supabase Realtime."
