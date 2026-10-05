import { useAuth } from "./auth.jsx";
import Login from "./pages/Login.jsx";
import Board from "./pages/Board.jsx";

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <p className="boot">Loading your tasks…</p>;
  return user ? <Board /> : <Login />;
}
