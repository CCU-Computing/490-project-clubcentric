import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./LoginPage.css";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await login(username, password);

    if (ok) {
      navigate("/home");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="login-page">
      <div className="login-overlay">
        <h2 className="login-title">Log in</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
          />
          {error && <p className="login-error">{error}</p>}
          <button className="login-button" type="submit">
            Sign In
          </button>
        </form>

        <p className="login-footer">
          Don’t have an account? <a href="/signup">Create one</a>
        </p>
      </div>
    </div>
  );
}
