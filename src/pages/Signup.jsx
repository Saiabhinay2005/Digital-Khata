import { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS
import "./Auth.css";

export default function Signup() {
  const navigate = useNavigate();  // ✅ ADD THIS

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !phone || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
       "https://digital-khata-backend-yalb.onrender.com/api/auth/signup" ,// ✅ FIXED
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, phone, password }),
        }
      );

      const data = await res.json();

      if (data.message) {
        setMessage("Signup successful ✅ Redirecting...");

        setTimeout(() => {
          navigate("/login");   // ✅ FIXED
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

        {error && <p className="error-msg">{error}</p>}
        {message && <p className="success-msg">{message}</p>}

        <button onClick={handleSignup}>
          {loading ? "Creating..." : "Signup"}
        </button>

        <div className="auth-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </div>
      </div>
    </div>
  );
}