import { useState } from "react";
import "./Auth.css";

export default function Login() {

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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, password })
      });

      const data = await res.json();

      if (data.token) {

        /* ✅ IMPORTANT FIX HERE */
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);   // ✅ STORE SHOP NAME

        window.location.href = "/";

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
          onClick={() => window.location.href = "/forgot-password"}
        >
          Forgot Password?
        </p>

        {/* ✅ ERROR MESSAGE */}
        {error && <p className="error-msg">{error}</p>}

        <button onClick={handleLogin}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-link">
          Don’t have an account?{" "}
          <span onClick={() => (window.location.href = "/signup")}>
            Signup
          </span>
        </div>

      </div>
    </div>
  );
}
