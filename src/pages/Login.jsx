import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();  // ✅ IMPORTANT

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://digital-khata-backend.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, password }),
        }
      );

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);

        // ✅ FIX: use navigate instead of reload
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch {
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        <label>Phone Number</label>
        <input
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setError("");
          }}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
        />

        {/* ✅ Forgot Password */}
        <p
          className="forgot-link"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>

        {/* ✅ ERROR */}
        {error && <p className="error-msg">{error}</p>}

        <button onClick={handleLogin}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-link">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/signup")}>
            Signup
          </span>
        </div>
      </div>
    </div>
  );
}