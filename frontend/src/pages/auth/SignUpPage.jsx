import { useState } from "react";
import { create_user } from "../../services/userService";
import { useNavigate } from "react-router-dom";

export default function SignUpPage()
{
    const navigate = useNavigate();

    // Local form state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [error, setError] = useState(null);

    // When user submits the form
    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        // Call your Django service
        const result = await create_user(
            username,
            password,
            firstName,
            lastName,
            email
        );

        if (result && result.status === true)
        {
            navigate("/login");   // redirect after success
        }
        else
        {
            setError(result?.error || "Sign up failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">

                <h2 className="text-2xl font-semibold text-center mb-6">
                    Create Account
                </h2>

                {error && (
                    <p className="text-red-500 text-center mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Username */}
                    <input
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {/* Email */}
                    <input
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* First Name */}
                    <input
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />

                    {/* Last Name */}
                    <input
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    {/* Password */}
                    <input
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Sign Up
                    </button>

                </form>

                {/* Link to login */}
                <p className="text-center mt-4 text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:underline">
                        Login
                    </a>
                </p>

            </div>
        </div>
    );
}
