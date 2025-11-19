import { useAuth } from '../../hooks/useAuth';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage()
{
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e)
    {
        e.preventDefault();
        const ok = await login(username, password);

        if (ok)
        {
            navigate("/home");
        }
        else
        {
            setError("Invalid username or password");
        }
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Log in</h2>

            <form onSubmit={handleSubmit}>
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                />
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Sign In</button>
            </form>

            <p>
                Don’t have an account?{" "}
                <a href="/signup">Create one</a>
            </p>
        </div>
    );
}
