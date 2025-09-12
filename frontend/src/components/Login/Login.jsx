import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../Context/AuthContext';
import axios from "axios";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Adjust backend URL as needed
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      if (res.data && res.data.access_token) {
        // Optionally: fetch user profile here if backend provides it
        const userObject = { email }; // You may want to replace this with real user info
        login(userObject, res.data.access_token);
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#eceafd]">
      <form className="bg-white p-8 rounded-lg shadow-md w-80" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Attendance Login</h2>
        <input
          className="w-full border rounded p-2 mb-4"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-2 mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
