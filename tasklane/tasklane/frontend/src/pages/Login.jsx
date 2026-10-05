import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../auth.jsx";

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState("");

  const onSuccess = async ({ credential }) => {
    setError("");
    try {
      await login(credential);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <main className="login">
      <section className="login-hero">
        <h1 aria-label="Write it down. Hand it off. Get it done.">
          <span className="struck s1">Write it down.</span>
          <span className="struck s2">Hand it off.</span>
          <span className="live">Get it done.</span>
        </h1>
        <p>
          Create tasks, assign them to teammates, and get an email the moment work is assigned or finished.
        </p>
      </section>

      <section className="login-card">
        <h2>Sign in to Tasklane</h2>
        <p>Use your Google account. There's no password to remember.</p>
        <div className="google-slot">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() => setError("Google sign-in didn't complete. Please try again.")}
            theme="outline"
            size="large"
            shape="rectangular"
            text="continue_with"
          />
        </div>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
      </section>
    </main>
  );
}
