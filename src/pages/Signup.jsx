import { useState } from "react";
import "./Auth.css";

export default function Signup() {

  const [name, setName] = useState("");        // ✅ NEW
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !phone || !password) {        // ✅ UPDATED
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,          // ✅ SEND NAME
          phone,
          password
        }),
      });

      const data = await res.json();

      if (data.message) {
        setMessage("Signup successful ✅ Redirecting...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setError("Signup failed");
      }
    } catch {
      setError("Server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>Create Account</h2>

        {/* ✅ NEW FIELD */}
        <label>Shop Name</label>
        <input
          placeholder="Enter shop name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />

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

        {/* ✅ ERROR */}
        {error && <p className="error-msg">{error}</p>}

        {/* ✅ SUCCESS */}
        {message && <p className="success-msg">{message}</p>}

        <button onClick={handleSignup}>
          {loading ? "Creating..." : "Signup"}
        </button>

        <div className="auth-link">
          Already have an account?{" "}
          <span onClick={() => (window.location.href = "/login")}>
            Login
          </span>
        </div>

      </div>
    </div>
  );
}